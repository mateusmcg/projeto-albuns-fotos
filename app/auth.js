var $auth = (function () {

    var returnUri = $.getJSON({ url: "../env/env.json", async: false }).responseJSON.redirectUrl

    var isAuthGoogle = function () {
        return localStorage.getItem("google_access_token") != null;
    }

    var isAuthSpotify = function () {
        return localStorage.getItem("spotify_access_token") != null;
    }

    var googleAuth = function () {
        $("#SpotifyBrand").hide();
        $("#GooglePhotosBrand").show();
        $("#homeMenuBtn").show();
        $("#createAlbumRow").show();

        $("#btnGoogleLogout").show();
        $("#btnGoogleLogout").unbind("click");
        $("#btnGoogleLogout").click(function (e) {
            logOutGoogle();
        });

        $("#searchForm").hide();

        $("#asideContent").show();
        $("#loadingAlbums").hide();
        $("#noResults").hide();

        $("#loadingAlbumCreate").hide();

        $("#loadingAlbums").show();
        $services.getGooglePhotosAlbums().done(function (result) {
            console.debug(result);
            $("#loadingAlbums").hide();
            $myApp.renderizarGooglePhotosAlbums(result.albums);
        }).fail(function (error) {
            if (error.status == 401) {
                $auth.logOutGoogle();
            } else {
                console.error(error);
            }
        });

        $("#btnCreateAlbum").click(function (e) {
            $myApp.createGooglePhotosAlbum();
        });
    }

    var spotifyAuth = function () {
        $("#SpotifyBrand").show();
        $("#GooglePhotosBrand").hide();
        $("#homeMenuBtn").show();
        $("#createAlbumRow").hide();

        $("#btnGoogleLogout").hide();

        $("#btnSpotifyLogout").show();
        $("#btnSpotifyLogout").unbind("click");
        $("#btnSpotifyLogout").click(function (e) {
            logOutSpotify();
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

    var authenticateSpotify = function () {
        let clientId = $.getJSON({ url: "../config/config.json", async: false }).responseJSON.spotifyClientId;
        let scopes = 'user-read-private user-read-email';
        window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=' + encodeURIComponent(scopes) + '&redirect_uri=' + encodeURIComponent(returnUri);
    }

    var authenticateGoogle = function () {
        let clientId = $.getJSON({ url: "../config/config.json", async: false }).responseJSON.googleClientId;
        let scopes = 'https://www.googleapis.com/auth/photoslibrary';
        let state = 'google-photos-api';
        window.location = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + clientId + '&scope=' + encodeURIComponent(scopes) + '&redirect_uri=' + encodeURIComponent(returnUri) + '&response_type=token&state=' + state;
    }

    var validateAuth = function () {
        let spotify_access_token = localStorage.getItem("spotify_access_token");
        let google_access_token = localStorage.getItem("google_access_token");

        if (spotify_access_token) {
            return true;
        } else if (google_access_token) {
            return true;
        } else {
            var query = window.location.hash.substring(1);
            var vars = query.split("&");
            if (query.indexOf("state=google-photos-api") != -1) {
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == 'access_token') {
                        var access_token = pair[1];
                        localStorage.setItem("google_access_token", access_token);
                        window.location.href = returnUri;
                        return true;
                    }
                }
            } else {
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == 'access_token') {
                        var access_token = pair[1];
                        localStorage.setItem("spotify_access_token", access_token);
                        window.location.href = returnUri;
                        return true;
                    }
                }
            }

            return (false);
        }
    }

    var logOutSpotify = function () {
        localStorage.removeItem("spotify_access_token");
        $myApp.init();
    }

    var logOutGoogle = function () {
        localStorage.removeItem("google_access_token");
        $myApp.init();
    }

    var authMode = function () {
        if (isAuthGoogle()) {
            googleAuth();
        } else if (isAuthSpotify()) {
            spotifyAuth();
        } else {
            anonymousMode();
        }
    }

    var anonymousMode = function () {
        $("#btnSpotifyLogout").hide();
        $("#btnSpotifySignIn").show();
        $("#btnSpotifySignIn").unbind("click");
        $("#btnSpotifySignIn").click(function (e) {
            authenticateSpotify();
        });

        $("#btnGoogleLogout").hide();
        $("#btnGoogleSignIn").show();
        $("#btnGoogleSignIn").unbind("click");
        $("#btnGoogleSignIn").click(function (e) {
            authenticateGoogle();
        });

        $("#searchForm").hide();
        $("#loadingAlbums").hide();
        $("#noResults").hide();
        $("#asideContent").hide();
        $("#googlePhotosContent").hide();
        $("#SpotifyBrand").hide();
        $("#GooglePhotosBrand").hide();
        $("#homeMenuBtn").hide();
        $("#albumList").empty();
        $("#albumFrame").empty();
        $("#albumDetail").empty();
        $("#googlePhotosContent").empty();
    }

    return {
        validateAuth: validateAuth,
        anonymousMode: anonymousMode,
        authMode: authMode,
        logOutSpotify: logOutSpotify,
        logOutGoogle: logOutGoogle
    }
})();