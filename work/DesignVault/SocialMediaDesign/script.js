document.addEventListener("DOMContentLoaded", () => {
    
    // ── 6 Posters Data Specification ──
    const posters = [
        {
            file: "BOTEN CR518 product showcase.webp",
            title: "EMBR00203D Injector Product Showcase",
            brandColor: "#e31e24",
            bgShade: "#ffe7e7",
            caption: "A high-impact product showcase highlighting the BOTEN CR518 diesel fuel injector test bench, utilizing bold typography and high-contrast red accents."
        },
        {
            file: "hny-efsouls.webp",
            title: "EFSOULS Happy New Year Festive Post",
            brandColor: "#00346e",
            bgShade: "#edf4ff",
            caption: "A creative festive social media post wishing a Happy New Year on behalf of EFSOULS, balancing dark blue aesthetics with gold sparks."
        },
        {
            file: "ACMA automechanika event announcement.webp",
            title: "ACMA automechanika Event Announcement",
            brandColor: "#c5a059",
            bgShade: "#fffbee",
            caption: "An event announcement poster designed for the ACMA Automechanika exhibition, emphasizing industry partnership, clean alignment, and corporate branding."
        },
        {
            file: "casila-31st-dec.webp",
            title: "Casila New Year's Eve Celebration",
            brandColor: "#f27a18",
            bgShade: "#fff5eb",
            caption: "A festive event banner designed for Casila's New Year's Eve celebration, incorporating elegant dark background elements and warm gold gradients."
        },
        {
            file: "BOTEN event partnership announcement.webp",
            title: "BOTEN Event Partnership Announcement",
            brandColor: "#0fa3b1",
            bgShade: "#e2f9f6",
            caption: "A professional announcement poster showcasing BOTEN's event partnership, featuring a modern grid layout and corporate color scheme."
        },
        {
            file: "ONYX-IP product announcement.webp",
            title: "ONYX-IP Product Announcement",
            brandColor: "#4a5568",
            bgShade: "#f5f5f5",
            caption: "A sleek product announcement poster for ONYX-IP, focusing on professional product rendering, minimal typography, and industrial aesthetics."
        }
    ];

    const assetBaseUrl = "../../../assets/work/Design%20Vault/Social%20Media%20Design/";

    let currentIndex = 0; // Starts with BOTEN CR518 showcase
    let slideInterval = null;
    const slideDuration = 8000; // 8 seconds

    // ── DOM References ──
    const displayArea = document.getElementById("gallery-display");
    const activePosterImg = document.getElementById("active-poster-img");

    const prevBtn = document.getElementById("dv-prev-btn");
    const nextBtn = document.getElementById("dv-next-btn");

    const prevThumbWrapper = document.getElementById("prev-thumb-wrapper");
    const activeThumbWrapper = document.getElementById("active-thumb-wrapper");
    const nextThumbWrapper = document.getElementById("next-thumb-wrapper");

    const prevThumbImg = prevThumbWrapper.querySelector(".dv-thumb-card-img");
    const activeThumbImg = activeThumbWrapper.querySelector(".dv-thumb-card-img");
    const nextThumbImg = nextThumbWrapper.querySelector(".dv-thumb-card-img");

    const prevThumbTitle = document.getElementById("prev-thumb-title");
    const activeThumbTitle = document.getElementById("active-thumb-title");
    const nextThumbTitle = document.getElementById("next-thumb-title");

    const timerBarFill = document.getElementById("timer-bar-fill");

    // ── Intersection Observer for Scroll Reveals ──
    const revealElements = document.querySelectorAll(".reveal-item");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: "0px 0px -50px 0px", threshold: 0 });

    revealElements.forEach((el) => revealObserver.observe(el));

    // ── Helper functions for Index Cycling ──
    const getPrevIndex = (index) => (index - 1 + posters.length) % posters.length;
    const getNextIndex = (index) => (index + 1) % posters.length;

    // ── Update UI State ──
    const updateGallery = (animate = true) => {
        const activeItem = posters[currentIndex];
        const prevItem = posters[getPrevIndex(currentIndex)];
        const nextItem = posters[getNextIndex(currentIndex)];

        // Update display area background shade & image
        displayArea.style.backgroundColor = activeItem.bgShade;
        
        if (animate) {
            activePosterImg.style.opacity = "0";
            activePosterImg.style.transform = "scale(0.97)";
            setTimeout(() => {
                activePosterImg.src = assetBaseUrl + activeItem.file;
                activePosterImg.style.opacity = "1";
                activePosterImg.style.transform = "scale(1)";
            }, 200);
        } else {
            activePosterImg.src = assetBaseUrl + activeItem.file;
        }

        // Update Thumbnails
        prevThumbImg.src = assetBaseUrl + prevItem.file;
        activeThumbImg.src = assetBaseUrl + activeItem.file;
        nextThumbImg.src = assetBaseUrl + nextItem.file;

        // Update Titles
        prevThumbTitle.textContent = prevItem.title;
        activeThumbTitle.textContent = activeItem.title;
        nextThumbTitle.textContent = nextItem.title;

        // Update Active Border color dynamically matching poster brand color
        activeThumbWrapper.querySelector(".dv-thumb-card").style.borderColor = activeItem.brandColor;
        activeThumbWrapper.querySelector(".dv-thumb-card").style.backgroundColor = activeItem.bgShade;

        // Update surrounding card bg shades
        prevThumbWrapper.querySelector(".dv-thumb-card").style.backgroundColor = prevItem.bgShade;
        nextThumbWrapper.querySelector(".dv-thumb-card").style.backgroundColor = nextItem.bgShade;
        prevThumbWrapper.querySelector(".dv-thumb-card").style.borderColor = "#e6e6fa";
        nextThumbWrapper.querySelector(".dv-thumb-card").style.borderColor = "#e6e6fa";

        // Restart timer bar animation
        startTimer();
    };

    // ── Timer/Progress Control ──
    const startTimer = () => {
        // Clear existing interval
        clearInterval(slideInterval);
        
        // Reset Progress Bar
        timerBarFill.style.transition = "none";
        timerBarFill.style.width = "0%";
        
        // Force Reflow
        void timerBarFill.offsetWidth;

        // Start CSS Transition over 8 seconds
        timerBarFill.style.transition = `width ${slideDuration}ms linear`;
        timerBarFill.style.width = "100%";

        // Trigger slide transition on completion
        slideInterval = setTimeout(() => {
            slideNext();
        }, slideDuration);
    };

    const slideNext = () => {
        currentIndex = getNextIndex(currentIndex);
        updateGallery(true);
    };

    const slidePrev = () => {
        currentIndex = getPrevIndex(currentIndex);
        updateGallery(true);
    };

    // ── Event Handlers ──
    nextBtn.addEventListener("click", () => {
        slideNext();
    });

    prevBtn.addEventListener("click", () => {
        slidePrev();
    });

    document.getElementById("prev-thumb-btn").addEventListener("click", () => {
        slidePrev();
    });

    document.getElementById("next-thumb-btn").addEventListener("click", () => {
        slideNext();
    });

    // ── Initialize ──
    updateGallery(false);

});
