var myApp = (function () {

    var init = function () {
        if ($auth.validateAuth()) {
            console.debug('Autenticado.', localStorage.getItem('access_token'));
        } else {
            $auth.authenticate();
        }
    };

    return {
        init: init
    }
})();

myApp.init();