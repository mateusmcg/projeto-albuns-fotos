var myApp = (function () {

    var init = function () {
        if ($auth.validateAuth()) {
            console.debug('Autenticado.', localStorage.getItem('access_token'));
            initEvents();
        } else {
            $auth.authenticate();
        }
    };

    function initEvents() {
        $("#btnPesquisar").click(function (e) {
            e.preventDefault();
            var query = $("#txtPesquisar").val();
            return $services.getAlbums(query).done(function (result) {
                console.debug(result);
                var divAlbumList = $("#albumList");
                var albums = result.albums.items;
                $.map(albums, function (album, index) {
                    var albumImage = album.images[2];
                    var divAlbum = $('<div class="album"><img src="' + albumImage.url + '" height="' + albumImage.height + '" width="' + albumImage.width + '" />' + album.name + '</div>')
                    divAlbumList.append(divAlbum);
                });
            }).fail(function (error) {
                console.error(error);
            });
        });
    }

    return {
        init: init
    }
})();

myApp.init();