var $auth = (function () {

    let clientId = 'c4f29ee702f344feb8f56d21edca248e';
    let returnUri = $.getJSON({ url: "../env/env.json", async: false }).responseJSON.redirectUrl

    var authenticate = function () {
        var scopes = 'user-read-private user-read-email';
        window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=' + encodeURIComponent(scopes) + '&redirect_uri=' + encodeURIComponent(returnUri);
    }

    var validateAuth = function () {
        var access_token = localStorage.getItem("access_token");
        if (access_token) {
            return true;
        } else {
            var query = window.location.hash.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == 'access_token') {
                    var access_token = pair[1];
                    localStorage.setItem("access_token", access_token);
                    window.location.href = returnUri;
                    return true;
                }
            }
            return (false);
        }
    }

    var logOut = function () {
        localStorage.removeItem("access_token");
        $myApp.init();
    }

    var authMode = function () {
        $("#btnSpotifyLogout").show();
        $("#btnSpotifyLogout").unbind("click");
        $("#btnSpotifyLogout").click(function (e) {
            logOut();
        });

        $("#btnSpotifySignIn").hide();
        $("#btnSpotifySignIn").unbind("click");

        $("#searchForm").show();
        $("#btnPesquisar").click(function (e) {
            $myApp.btnPesquisarClick(e);
        });

        $("#asideContent").show();

        $("#loadingAlbums").hide();
        $("#noResults").hide();
    }

    var anonymousMode = function () {
        $("#btnSpotifyLogout").hide();
        $("#btnSpotifySignIn").show();
        $("#btnSpotifySignIn").unbind("click");
        $("#btnSpotifySignIn").click(function (e) {
            authenticate();
        });

        $("#searchForm").hide();
        $("#loadingAlbums").hide();
        $("#noResults").hide();
        $("#asideContent").hide();
        $("#albumList").empty();
        $("#albumFrame").empty();
        $("#albumDetail").empty();
    }

    return {
        validateAuth: validateAuth,
        anonymousMode: anonymousMode,
        authMode: authMode,
        logOut: logOut
    }
})();