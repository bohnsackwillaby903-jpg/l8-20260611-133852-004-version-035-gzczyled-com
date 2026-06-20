(function () {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
        });
    }

    const carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
        const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
        const previous = carousel.querySelector("[data-hero-prev]");
        const next = carousel.querySelector("[data-hero-next]");
        let current = 0;
        let timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (slides.length > 1) {
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                    startTimer();
                });
            });

            if (previous) {
                previous.addEventListener("click", function () {
                    showSlide(current - 1);
                    startTimer();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    showSlide(current + 1);
                    startTimer();
                });
            }

            startTimer();
        }
    }

    const filterPanel = document.querySelector("[data-filter-panel]");
    const cards = Array.from(document.querySelectorAll(".movie-card"));
    const emptyState = document.querySelector("[data-empty-state]");

    if (filterPanel && cards.length) {
        const textInput = filterPanel.querySelector("[data-filter-text]");
        const yearSelect = filterPanel.querySelector("[data-filter-year]");
        const regionSelect = filterPanel.querySelector("[data-filter-region]");
        const typeSelect = filterPanel.querySelector("[data-filter-type]");
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get("q") || "";

        function fillSelect(select, values) {
            if (!select) {
                return;
            }
            values.forEach(function (value) {
                if (!value) {
                    return;
                }
                const option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function uniqueValues(key) {
            return Array.from(new Set(cards.map(function (card) {
                return card.dataset[key] || "";
            }).filter(Boolean))).sort(function (a, b) {
                return b.localeCompare(a, "zh-Hans-CN");
            });
        }

        fillSelect(yearSelect, uniqueValues("year"));
        fillSelect(regionSelect, uniqueValues("region"));
        fillSelect(typeSelect, uniqueValues("type"));

        if (textInput && initialQuery) {
            textInput.value = initialQuery;
        }

        function applyFilters() {
            const keyword = textInput ? textInput.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";
            const region = regionSelect ? regionSelect.value : "";
            const type = typeSelect ? typeSelect.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const content = (card.dataset.search || "").toLowerCase();
                const matched = (!keyword || content.indexOf(keyword) !== -1) &&
                    (!year || card.dataset.year === year) &&
                    (!region || card.dataset.region === region) &&
                    (!type || card.dataset.type === type);
                card.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visible !== 0;
            }
        }

        [textInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }
}());
