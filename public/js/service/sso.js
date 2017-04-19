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

    function validateJWT(idToken) {
        try {
            var data = utils.decodeJWT(idToken);
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
        var idToken = localStorage.getItem(this.config.tokenId);

        if (idToken) {
            login(idToken);
        } else {
            logout();
        }
    }

    function logout() {
        var message = {action: 'gsslo.logout'};
        localStorage.removeItem(this.config.tokenId);
        postMessageToParent(message);
    }

    function login(idToken) {
        if (validateJWT(idToken)) {
            var message = {
                action: 'gsslo.logued',
                idToken: idToken,
                user: utils.decodeJWT(idToken)
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
                    if (data.hasOwnProperty('idToken')) {
                        localStorage.setItem(this.config.tokenId, data.idToken);
                        login(data.idToken);
                    }
                    break;
                case 'logout':
                    logout();
                    break;
                case 'isLogued':
                    var token = localStorage.getItem(this.config.tokenId);

                    if (validateJWT(token)) {
                        login(token);
                    } else {
                        var message = {action: 'gsslo.nologued'};
                        postMessageToParent(message);
                    }
                    break;
            }
        }
    }

    function run() {
        var idToken = localStorage.getItem(this.config.tokenId);

        if (idToken) {
            login(idToken);

            setInterval(function () {
                if (!validateJWT(idToken)) {
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
    decodeJWT: function (idToken) {
        var base64Url = idToken.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
}