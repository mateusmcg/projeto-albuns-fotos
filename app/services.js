var $services = (function () {

    var getAlbums = function (query) {
        return $.ajax({
            url: "https://api.spotify.com/v1/search",
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            },
            data: {
                q: query,
                type: 'album'
            }
        });
    };

    var getMusics = function (albumId) {
        return $.ajax({
            url: "https://api.spotify.com/v1/albums/" + albumId + "/tracks",
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        });
    };

    return {
        getAlbums: getAlbums,
        getMusics: getMusics
    }
})();