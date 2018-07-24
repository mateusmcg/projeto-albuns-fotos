var $services = (function () {

    var getSpotifyAlbums = function (query) {
        return $.ajax({
            url: "https://api.spotify.com/v1/search",
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("spotify_access_token")
            },
            data: {
                q: query,
                type: 'album'
            }
        });
    };

    var getSpotifyMusics = function (albumId) {
        return $.ajax({
            url: "https://api.spotify.com/v1/albums/" + albumId + "/tracks",
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("spotify_access_token")
            }
        });
    };

    var getGooglePhotosAlbums = function () {
        return $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/albums",
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("google_access_token")
            }
        });
    }

    var getGooglePhotosAlbumMedia = function (albumId) {
        return $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/mediaItems:search",
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("google_access_token")
            },
            data: {
                albumId: albumId
            }
        });
    }

    return {
        getSpotifyAlbums: getSpotifyAlbums,
        getSpotifyMusics: getSpotifyMusics,
        getGooglePhotosAlbums: getGooglePhotosAlbums,
        getGooglePhotosAlbumMedia: getGooglePhotosAlbumMedia
    }
})();