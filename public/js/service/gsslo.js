var gsslo = new gsslo();

function gsslo() {
    this.login = function (idToken) {
        var message = {action: 'login', idToken: idToken};
        postMessage(message, getUrlIDP());
    }

    this.logout = function () {
        var message = {action: 'logout'};
        postMessage(message, getUrlIDP());
    }

    this.isLogued = function () {
        var message = {action: 'isLogued'};
        postMessage(message, getUrlIDP());
    }

    function getMetaTag(name) {
        var lstMeta = document.getElementsByTagName('meta');

        for (var i = 0; i < lstMeta.length; i++) {
            if (lstMeta[i].getAttribute("name") == name) {
                return lstMeta[i].getAttribute("content");
            }
        }
        return null;
    }

    function getUrlScript() {
        var lstScript = document.getElementsByTagName('script');
        var script = lstScript[lstScript.length - 1];
        var parser = document.createElement('a');
        return script.src;
    }

    function getUrlIframe() {
        var parser = document.createElement('a');
        parser.href = getUrlScript();

        var url = parser.protocol + '//' + parser.host + '/frame';
        var origin = document.location.origin;
        url = url + '?origin=' + origin;

        var fedId = getMetaTag('gsslo.federationId');
        url = (fedId) ? url + '&federationId=' + fedId : url;

        return url;
    }

    function getUrlIDP() {
        var parser = document.createElement('a');
        parser.href = getUrlScript();
        return parser.protocol + '//' + parser.host;
    }

    function getLocalStorageName(item) {
        var prefix = '';
        return prefix + item;
    }

    function postMessage(message, url) {
        var frame = document.getElementById('gsslo.iframe').contentWindow;
        frame.postMessage(message, getUrlIDP());
    }

    function dispashEvent(e, data) {
        var evt = new CustomEvent(e, {detail: data});
        window.dispatchEvent(evt);
    }

    function listener(e) {
        var data = e.data;

        if (data) {
            switch (data.action) {
                case 'gsslo.load':
                    if (typeof gssloLoad == 'function') {
                        gssloLoad();
                    }
                    dispashEvent('gssloLoad', null);
                    break;
                case 'gsslo.logued':
                    if (typeof gssloLogued == 'function') {
                        gssloLogued(data.idToken, data.user);
                    }
                    dispashEvent('gssloLogued', {idToken: data.idToken, user: data.user});
                    break;
                case 'gsslo.logout':
                    if (typeof gssloLogout == 'function') {
                        gssloLogout();
                    }
                    dispashEvent('gssloLogout');
                    break;
                case 'gsslo.nologued':
                    if (typeof gssloNologued == 'function') {
                        gssloNologued();
                    }
                    dispashEvent('gssloNologued');
                    break;
            }
        }
    }

    function run() {
        var iframeUrl = getUrlIframe();
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = iframeUrl;
        iframe.id = 'gsslo.iframe';

        document.body.appendChild(iframe);

        addEventListener('message', listener);
    }

    window.addEventListener('load', run);
}


