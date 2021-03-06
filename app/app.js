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
        return $services.getSpotifyAlbums(query).done(function (result) {
            console.debug(result);
            $("#loadingAlbums").hide();

            if (result.albums && result.albums.items && result.albums.items.length > 0) {
                renderizarSpotifyAlbums(result.albums.items);
            } else {
                $("#noResults").show();
            }
        }).fail(function (error) {
            if (error.status == 401) {
                $auth.logOutSpotify();
            } else {
                console.error(error);
            }
        });
    }

    function renderizarSpotifyAlbums(albums) {
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
                renderizarSpotifyMusicas(albumId);
            });
            divAlbumList.append(divAlbum);
        });
    }

    function renderizarSpotifyMusicas(albumId) {

        $("#googlePhotosContent").hide();
        $("#albumFrame").show();
        $("#albumDetail").show();

        var spotifyFrame = '<iframe src="https://open.spotify.com/embed?uri=spotify:album:' + albumId + '" width="100%" height="100%" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
        $("#albumFrame").empty();
        $("#albumFrame").append(spotifyFrame);

        $("#albumDetail").empty();
        $services.getSpotifyMusics(albumId).done(function (result) {
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
                $auth.logOutSpotify();
            } else {
                console.error(error);
            }
        });
    }

    function renderizarGooglePhotosAlbums(albums) {
        var divAlbumList = $("#albumList");
        $.map(albums, function (album, index) {
            var itensCount = album.totalMediaItems ? album.totalMediaItems : 0;
            var cardAlbumHtml = '<div class="album-card" album-id="' + album.id + '">' +
                '   <img src="' + album.coverPhotoBaseUrl + '" height="95%" width="95%" />' +
                '   <div class="card-content"><b>' + album.title + ' (' + itensCount + ' photos)</b></div>' +
                '</div>';

            var divAlbum = $(cardAlbumHtml)
            divAlbum.click(function (e) {
                var albumId = $(this).attr("album-id");
                renderizarConteudoAlbumGooglePhotos(albumId);
            });
            divAlbumList.append(divAlbum);
        });
    }

    function renderizarConteudoAlbumGooglePhotos(albumId) {
        console.debug(albumId);
        $("#googlePhotosContent").empty();
        $("#googlePhotosContentLoading").show();
        $services.getGooglePhotosAlbumMedia(albumId).done(function (result) {
            console.debug(result);
            $("#addMediaToAlbumDiv").show();
            $("#addMediaToAlbumDiv").attr('album-id', albumId);

            $("#googlePhotosContentLoading").hide();
            $("#googlePhotosContent").empty();
            $("#googlePhotosContent").show();
            $("#albumFrame").hide();
            $("#albumDetail").hide();

            var mediaHtml = "<div class='row'>";
            $.map(result.mediaItems, function (media, index) {
                var mediaItemHtml = `<div class="col-md-3">
                                        <div class="media-card">
                                            <img src="` + media.baseUrl + `" height="100%" width="100%" />
                                        </div>
                                    </div>`;

                mediaHtml += mediaItemHtml;
            });

            mediaHtml += "</div>";

            $("#googlePhotosContent").append(mediaHtml);
        }).fail(function (error) {
            if (error.status == 401) {
                $auth.logOutGoogle();
            } else {
                console.error(error);
            }
        });
    }

    function createGooglePhotosAlbum() {
        $("#loadingAlbumCreate").show();
        $("#btnCreateAlbum").attr('disabled', 'disabled');
        $("#btnCancelCreateAlbum").attr('disabled', 'disabled');
        $("#txtAlbumName").attr('disabled', 'disabled');

        let newAlbum = {
            "album": {
                "title": $("#txtAlbumName").val()
            }
        };

        $services.createGooglePhotosAlbum(newAlbum).done(function (result) {
            $('#createAlbumModal').modal('toggle');
            $("#loadingAlbums").show();

            $("#loadingAlbumCreate").hide();
            $("#btnCreateAlbum").removeAttr('disabled');
            $("#btnCancelCreateAlbum").removeAttr('disabled');
            $("#txtAlbumName").removeAttr('disabled');
            $("#txtAlbumName").val('');

            $("#albumList").empty();
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
        }).fail(function (error) {
            if (error.status == 401) {
                $auth.logOutGoogle();
            } else {
                console.error(error);
            }
        });
    }

    function uploadMediaToGoogle() {
        let reader = new FileReader();
        reader.onload = function () {

            let fileName = $('#mediaUpload')[0].files[0].name;
            let arrayBuffer = this.result;
            let bytesArray = new Uint8Array(arrayBuffer);

            $services.uploadMediaToGoogle(fileName, bytesArray).done(function (result) {
                addMediaToAlbum(result, $("#addMediaToAlbumDiv").attr('album-id'), fileName);
            }).fail(function (error) {
                if (error.status == 401) {
                    $auth.logOutGoogle();
                } else {
                    alert("Houve um erro ao fazer o upload da sua imagem, tente novamente mais tarde.");
                }
            });

        }
        reader.readAsArrayBuffer($('#mediaUpload')[0].files[0]);
    }

    function addMediaToAlbum(token, albumId, mediaName) {

        let content = {
            albumId: albumId,
            newMediaItems: [
                {
                    description: mediaName,
                    simpleMediaItem: {
                        uploadToken: token
                    }
                }
            ]
        };

        $services.addMediaToAlbum(content).done(function (result) {
            $('#addMediaModal').modal('toggle');
            $("#googlePhotosContentModal").empty();
            $("#googlePhotosContentLoadingModal").show();
            $services.getGooglePhotosMedia().done(function (result) {
                $("#googlePhotosContentLoadingModal").hide();
                renderizarGooglePhotosMediaModal(result);
            }).fail(function (error) {
                if (error.status == 401) {
                    $auth.logOutGoogle();
                } else {
                    console.error(error);
                }
            });
        }).fail(function (error) {
            if (error.status == 401) {
                $auth.logOutGoogle();
            } else {
                console.error(error);
            }
        });
    }

    return {
        init: init,
        btnPesquisarClick: btnPesquisarClick,
        renderizarGooglePhotosAlbums: renderizarGooglePhotosAlbums,
        createGooglePhotosAlbum: createGooglePhotosAlbum,
        uploadMediaToGoogle: uploadMediaToGoogle
    }
})();

$myApp.init();