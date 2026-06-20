function initMoviePlayer(videoUrl) {
  var video = document.getElementById('movie-player');
  var cover = document.querySelector('.player-cover');
  var hlsInstance = null;
  var prepared = false;

  if (!video || !videoUrl) {
    return;
  }

  function preparePlayer() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = videoUrl;
  }

  function startPlayback() {
    preparePlayer();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
