(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = qs('[data-nav-toggle]');
  var nav = qs('[data-site-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = qs('[data-hero-slider]');
  if (hero) {
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === current);
      });
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(nextSlide, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    var next = qs('[data-hero-next]', hero);
    var prev = qs('[data-hero-prev]', hero);
    if (next) {
      next.addEventListener('click', function () {
        nextSlide();
        startTimer();
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var filterInput = qs('[data-filter-input]');
  var filterYear = qs('[data-filter-year]');
  var filterType = qs('[data-filter-type]');
  var filterList = qs('[data-filter-list]');
  var emptyState = qs('[data-empty-state]');
  if (filterList) {
    var cards = qsa('[data-movie-card]', filterList);

    function applyFilter() {
      var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
      var year = filterYear ? filterYear.value : '';
      var type = filterType ? filterType.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-keywords') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear.indexOf(year) === -1) {
          matched = false;
        }
        if (type && cardType.indexOf(type) === -1) {
          matched = false;
        }
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    [filterInput, filterYear, filterType].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  }

  var globalInput = qs('#globalSearch');
  var globalResults = qs('#searchResults');
  if (globalInput && globalResults && window.MOVIE_SEARCH_INDEX) {
    function renderSearch() {
      var keyword = globalInput.value.trim().toLowerCase();
      globalResults.innerHTML = '';
      if (!keyword) {
        return;
      }
      var results = window.MOVIE_SEARCH_INDEX.filter(function (item) {
        return item.keywords.toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 12);
      results.forEach(function (item) {
        var link = document.createElement('a');
        link.className = 'search-result-card';
        link.href = item.url;
        link.innerHTML = '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '"><span><strong>' + item.title + '</strong><span>' + item.meta + '</span><span>' + item.line + '</span></span>';
        globalResults.appendChild(link);
      });
    }
    globalInput.addEventListener('input', renderSearch);
  }

  var video = qs('[data-stream]');
  if (video) {
    var button = qs('.player-start');
    var source = video.getAttribute('data-stream');
    var hls = null;

    function playVideo() {
      if (!source) {
        return;
      }
      if (button) {
        button.classList.add('is-hidden');
      }
      if (video.getAttribute('data-ready') === '1') {
        video.play();
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.setAttribute('data-ready', '1');
        video.play();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.setAttribute('data-ready', '1');
          video.play();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hls) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
              hls = null;
              video.src = source;
              video.play();
            }
          }
        });
        return;
      }
      video.src = source;
      video.setAttribute('data-ready', '1');
      video.play();
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }
}());
