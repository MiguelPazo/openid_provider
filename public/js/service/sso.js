sso();

function sso() {
    this.config = {tokenId: null, origin: null};

    function boostrap() {
        this.config.origin = utils.getGetParam('origin');
        this.config.tokenId = 'token.' + utils.getGetParam('federationId');

        run();
    }

    function postMessageToParent(message) {
        window.parent.postMessage(message, '*');
    }

    function validateJWT(jwt) {
        try {
            var data = utils.decodeJWT(jwt);
            var exp = data.exp * 1000;
            var now = (new Date()).getTime();

            if (exp > now) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    function localStorageHandler() {
        var jwt = localStorage.getItem(this.config.tokenId);

        if (jwt) {
            login(jwt);
        } else {
            logout();
        }
    }

    function logout() {
        var message = {action: 'gsslo.logout'};
        localStorage.removeItem(this.config.tokenId);
        postMessageToParent(message);
    }

    function login(jwt) {
        if (validateJWT(jwt)) {
            var message = {
                action: 'gsslo.logued',
                jwt: jwt,
                user: utils.decodeJWT(jwt)
            };

            postMessageToParent(message);
        } else {
            logout();
        }
    }

    function listener(e) {
        var data = e.data;

        if (data) {
            switch (data.action) {
                case 'login':
                    if (data.hasOwnProperty('jwt')) {
                        localStorage.setItem(this.config.tokenId, data.jwt);
                        login(data.jwt);
                    }
                    break;
                case 'validate':
                    if (data.hasOwnProperty('jwt')) {
                        if (!validateJWT(data.jwt)) {
                            logout();
                        }
                    }
                    break;
                case 'logout':
                    logout();
                    break;
            }
        }
    }

    function run() {
        var jwt = localStorage.getItem(this.config.tokenId);

        if (jwt) {
            login(jwt);

            setInterval(function () {
                console.log('validateJWT');
                if (!validateJWT(jwt)) {
                    logout();
                }
            }, 60000);
        } else {
            var message = {action: 'gsslo.load'};
            postMessageToParent(message);
        }

        window.addEventListener('message', listener);
        window.addEventListener('storage', localStorageHandler);
    }

    window.addEventListener('load', boostrap);
}

var utils = {
    getOrigin: function () {
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        return window.location.origin;
    },
    getGetParam: function (key) {
        var src = String(window.location.href).split('?')[1];

        if (src != null) {
            var lstKey = src.split('&');

            for (i in lstKey) {
                var pair = lstKey[i].split('=');

                if (pair[0] == key) {
                    return pair[1];
                }
            }
        }

        return null;
    },
    decodeJWT: function (jwt) {
        var base64Url = jwt.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
}