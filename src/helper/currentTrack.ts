class CurrentTrack {
    playing: boolean = false;
    progress: number = 0;
    songName: string = '';
    artists: string[] = [];
    albumName: string = '';
    songLink: string = '';
    songPicture: string = '';
    albumLink: string = '';
}

function transformCurrentTrack(currentTrack: SpotifyApi.CurrentlyPlayingResponse): CurrentTrack | undefined {

    let trackObject = currentTrack.item as SpotifyApi.TrackObjectFull;

    let trackInfo = new CurrentTrack();
    trackInfo.playing = currentTrack.is_playing;
    trackInfo.progress = currentTrack.progress_ms != null ? Math.round(currentTrack.progress_ms / 1000) : 0;
    trackInfo.songName = trackObject.name;
    trackObject.artists.forEach(artist => {
        trackInfo.artists.push(artist.name);
    });
    trackInfo.albumName = trackObject.album.name;
    trackInfo.songLink = trackObject.external_urls.spotify;
    let localMax = -Infinity;
    trackObject.album.images.forEach(image => {
        if (image.width !== undefined && image.width > localMax) {
            localMax = image.width;
            trackInfo.songPicture = image.url;
        }
    });
    trackInfo.albumLink = trackObject.album.external_urls.spotify;

    return trackInfo;
}

export {CurrentTrack, transformCurrentTrack};
