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
            if (error.status == 401) {
                $auth.logOut();
            } else {
                console.error(error);
            }
        });
    }

    function renderizarAlbums(albums) {
        var divAlbumList = $("#albumList");
        $.map(albums, function (album, index) {
            var albumImage = album.images[0];
            var cardAlbumHtml = '<div class="album-card" album-id="' + album.id + '">' +
                '   <img src="' + albumImage.url + '" height="128px" width="128px" />' +
                '   <div class="card-content"><b>' + album.name + ' [' + album.release_date.slice(0, 4) + ']</b></div>' +
                '</div>';

            var divAlbum = $(cardAlbumHtml)
            divAlbum.click(function (e) {
                var albumId = $(this).attr("album-id");
                renderizarMusicas(albumId);
            });
            divAlbumList.append(divAlbum);
        });
    }

    function renderizarMusicas(albumId) {

        var spotifyFrame = '<iframe src="https://open.spotify.com/embed?uri=spotify:album:' + albumId + '" width="100%" height="100%" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
        $("#albumFrame").empty();
        $("#albumFrame").append(spotifyFrame);

        $("#albumDetail").empty();
        $services.getMusics(albumId).done(function (result) {
            console.debug(result);

            var albumDetailHtml = `<div class="row">
                                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <h2>Details</h2>
                                        </div>
                                        <div id="tracksDetails" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            {{accordion}}
                                        </div>
                                    </div>`;

            var accordionHtml = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
            var tracks = result.items;
            $.map(tracks, function (track, index) {
                var accordionItem = `<div class="panel panel-default">
                                        <div class="panel-heading" role="tab" id="heading-` + track.id + `">
                                        <h4 class="panel-title">
                                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-`+ track.id + `" aria-expanded="true" aria-controls="` + index + `">
                                                #` + track.track_number + ` - ` + track.name.replace("<", "").replace(">", "") + `
                                            </a>
                                        </h4>
                                        </div>
                                        <div id="collapse-`+ track.id + `" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-` + track.id + `">
                                        <div class="panel-body">
                                            <pre><code>` + JSON.stringify(track, undefined, 2).replace("<", "").replace(">", "") + `</code></pre>
                                        </div>
                                        </div>
                                    </div>`;

                accordionHtml += accordionItem;
            });

            accordionHtml += '</div>';

            albumDetailHtml = albumDetailHtml.replace("{{accordion}}", accordionHtml);

            $("#albumDetail").append(albumDetailHtml);

        }).fail(function (error) {
            if (error.status == 401) {
                $auth.logOut();
            } else {
                console.error(error);
            }
        });
    }

    return {
        init: init,
        btnPesquisarClick: btnPesquisarClick
    }
})();

$myApp.init();