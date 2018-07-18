var $myApp = (function () {

    var init = function () {
        if ($auth.validateAuth()) {
            $auth.authMode();
        } else {
            $auth.anonymousMode();
        }
    };

    function btnPesquisarClick(e) {
        e.preventDefault();
        $("#albumList").empty();
        $("#noResults").hide();
        $("#loadingAlbums").show();
        var query = $("#txtPesquisar").val();
        return $services.getAlbums(query).done(function (result) {
            console.debug(result);
            $("#loadingAlbums").hide();

            if (result.albums && result.albums.items && result.albums.items.length > 0) {
                renderizarAlbums(result.albums.items);
            } else {
                $("#noResults").show();
            }
        }).fail(function (error) {
            console.error(error);
        });
    }

    function renderizarAlbums(albums) {
        var divAlbumList = $("#albumList");
        $.map(albums, function (album, index) {
            var albumImage = album.images[0];
            var cardAlbumHtml = '<div class="album-card">' +
                '   <img src="' + albumImage.url + '" height="128px" width="128px" />' +
                '   <div class="card-content"><b>' + album.name + ' [' + album.release_date.slice(0, 4) + ']</b></div>' +
                '</div>';

            var divAlbum = $(cardAlbumHtml)
            divAlbumList.append(divAlbum);
        });
    }

    return {
        init: init,
        btnPesquisarClick: btnPesquisarClick
    }
})();

$myApp.init();