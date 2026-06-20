(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('play-overlay');
    var stream = typeof streamUrl === 'string' ? streamUrl : '';
    var started = false;
    var hlsInstance = null;

    if (!video || !button || !stream) {
      return;
    }

    function requestPlay() {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }

    function attachStream() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        requestPlay();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          requestPlay();
        });
        hlsInstance.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              hlsInstance.destroy();
              video.src = stream;
              requestPlay();
            }
          }
        });
        return;
      }
      video.src = stream;
      requestPlay();
    }

    function begin() {
      button.classList.add('is-hidden');
      if (!started) {
        started = true;
        attachStream();
      } else {
        requestPlay();
      }
    }

    button.addEventListener('click', begin);
    video.addEventListener('click', function () {
      if (!started) {
        begin();
      }
    });
  });
}());
