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
            url: "https://photoslibrary.googleapis.com/v1/albums?pageSize=50",
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

    var getGooglePhotosMedia = function () {
        return $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/mediaItems:search?pageSize=50",
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("google_access_token")
            }
        });
    }

    var createGooglePhotosAlbum = function (album) {
        return $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/albums",
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("google_access_token")
            },
            data: JSON.stringify(album)
        });
    }

    var uploadMediaToGoogle = function (fileName, bytesArray) {
        return $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/uploads",
            method: "POST",
            contentType: 'application/octet-stream',
            processData: false,
            data: bytesArray,
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("google_access_token"),
                'X-Goog-Upload-File-Name': fileName
            },
        });
    }

    var addMediaToAlbum = function (content) {
        return $.ajax({
            url: "https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate",
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("google_access_token")
            },
            data: JSON.stringify(content)
        });
    }

    return {
        getSpotifyAlbums: getSpotifyAlbums,
        getSpotifyMusics: getSpotifyMusics,
        getGooglePhotosAlbums: getGooglePhotosAlbums,
        getGooglePhotosAlbumMedia: getGooglePhotosAlbumMedia,
        createGooglePhotosAlbum: createGooglePhotosAlbum,
        getGooglePhotosMedia: getGooglePhotosMedia,
        addMediaToAlbum: addMediaToAlbum,
        uploadMediaToGoogle: uploadMediaToGoogle
    }
})();