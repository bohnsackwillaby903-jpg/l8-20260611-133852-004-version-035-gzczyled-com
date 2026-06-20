(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var navPanel = document.querySelector('[data-nav-panel]');

    if (menuButton && navPanel) {
        menuButton.addEventListener('click', function () {
            navPanel.classList.toggle('open');
        });
    }

    var carousel = document.querySelector('[data-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-slide-dot') || 0));
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var querySync = document.querySelector('[data-query-sync]');
    var localSearch = document.querySelector('[data-local-search]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterCards(value) {
        var keyword = normalize(value);
        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-year'),
                card.textContent
            ].join(' '));
            card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
        });
    }

    if (querySync) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        querySync.value = q;
        filterCards(q);
    }

    if (localSearch) {
        localSearch.addEventListener('input', function () {
            filterCards(localSearch.value);
        });
    }
}());
