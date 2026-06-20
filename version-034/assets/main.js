(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
            document.body.classList.toggle('nav-open', mobileNav.classList.contains('is-open'));
        });
    }

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
        const prev = slider.querySelector('[data-hero-prev]');
        const next = slider.querySelector('[data-hero-next]');
        let current = 0;
        let timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        const input = panel.querySelector('[data-filter-input]');
        const region = panel.querySelector('[data-filter-region]');
        const type = panel.querySelector('[data-filter-type]');
        const section = panel.closest('.content-section') || document;
        const cards = Array.from(section.querySelectorAll('[data-movie-list] .movie-card'));
        const empty = section.querySelector('[data-empty-state]');

        function runFilter() {
            const keyword = input ? input.value.trim().toLowerCase() : '';
            const selectedRegion = region ? region.value : '';
            const selectedType = type ? type.value : '';
            let visible = 0;

            cards.forEach(function (card) {
                const text = (card.getAttribute('data-tags') || '').toLowerCase();
                const cardRegion = card.getAttribute('data-region') || '';
                const cardType = card.getAttribute('data-type') || '';
                const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                const matchRegion = !selectedRegion || cardRegion === selectedRegion;
                const matchType = !selectedType || cardType === selectedType;
                const matched = matchKeyword && matchRegion && matchType;

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, region, type].forEach(function (control) {
            if (control) {
                control.addEventListener('input', runFilter);
                control.addEventListener('change', runFilter);
            }
        });
    });
})();
