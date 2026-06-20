(function () {
  var menuButton = document.querySelector(".mobile-menu-button");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var opened = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector(".hero-prev");
    var next = carousel.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        restart();
      });
    }

    restart();
  }

  function applyCardFilter(root) {
    var searchInput = root.querySelector(".card-search");
    var yearSelect = root.querySelector(".year-filter");
    var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));

    if (!searchInput && !yearSelect) {
      return;
    }

    function update() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";

      cards.forEach(function (card) {
        var keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
        var cardYear = card.getAttribute("data-year") || "";
        var matchedQuery = !query || keywords.indexOf(query) !== -1;
        var matchedYear = !year || cardYear === year;
        card.classList.toggle("is-hidden", !(matchedQuery && matchedYear));
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", update);
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", update);
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q && searchInput) {
      searchInput.value = q;
    }

    update();
  }

  document.querySelectorAll(".section-block").forEach(applyCardFilter);
})();

function initMoviePlayer(playerId, sourceUrl) {
  var root = document.getElementById(playerId);

  if (!root) {
    return;
  }

  var video = root.querySelector("video");
  var cover = root.querySelector(".player-cover");
  var hlsInstance = null;

  if (!video) {
    return;
  }

  function attachSource() {
    if (video.getAttribute("data-ready") === "true") {
      return;
    }

    video.setAttribute("data-ready", "true");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = sourceUrl;
  }

  function startPlayback() {
    attachSource();
    root.classList.add("is-playing");
    video.controls = true;

    var result = video.play();

    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener("play", function () {
    root.classList.add("is-playing");
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
