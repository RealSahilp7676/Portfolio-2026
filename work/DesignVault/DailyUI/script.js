document.addEventListener("DOMContentLoaded", () => {
    
    // ── Colors palette to cycle ──
    const colors = [
        { brand: "#4f46e5", bg: "#eef2ff" }, // indigo
        { brand: "#0ea5e9", bg: "#f0f9ff" }, // sky
        { brand: "#10b981", bg: "#ecfdf5" }, // emerald
        { brand: "#f59e0b", bg: "#fffbeb" }, // amber
        { brand: "#ef4444", bg: "#fef2f2" }, // red
        { brand: "#8b5cf6", bg: "#f5f3ff" }, // violet
        { brand: "#ec4899", bg: "#fdf2f8" }, // pink
        { brand: "#14b8a6", bg: "#f0fdfa" }, // teal
        { brand: "#f97316", bg: "#fff7ed" }  // orange
    ];

    // ── 40 Days specifications ──
    const rawDays = [
        { num: 1, title: "Sign Up Page" },
        { num: 2, title: "Credit Card Checkout" },
        { num: 3, title: "Landing Page" },
        { num: 4, title: "Calculator" },
        { num: 5, title: "App Icon" },
        { num: 6, title: "User Profile" },
        { num: 7, title: "Settings" },
        { num: 8, title: "404 Page" },
        { num: 9, title: "Music Player" },
        { num: 10, title: "Social Share" },
        { num: 11, title: "Flash Message" },
        { num: 12, title: "E-Commerce Shop" },
        { num: 13, title: "Direct Messaging" },
        { num: 14, title: "Countdown Timer" },
        { num: 15, title: "ON and OFF Switch" },
        { num: 16, title: "Pop-Up Message" },
        { num: 17, title: "Email Receipt" },
        { num: 18, title: "Analytics Chart" },
        { num: 19, title: "Leaderboard" },
        { num: 20, title: "Location Tracker" },
        { num: 21, title: "Home Monitoring DB" },
        { num: 22, title: "Search" },
        { num: 23, title: "Onboarding" },
        { num: 24, title: "Boarding Pass" },
        { num: 25, title: "TV App" },
        { num: 26, title: "Subscribe" },
        { num: 27, title: "Dropdown" },
        { num: 28, title: "Contact Us" },
        { num: 29, title: "Map" },
        { num: 30, title: "Pricing" },
        { num: 31, title: "File Upload" },
        { num: 32, title: "Crowdfunding Campaign" },
        { num: 33, title: "Customize Product" },
        { num: 34, title: "Car Interface" },
        { num: 35, title: "Blog Post" },
        { num: 36, title: "EMI Calculator" },
        { num: 37, title: "Weather" },
        { num: 38, title: "Calendar" },
        { num: 39, title: "Testimonials" },
        { num: 40, title: "Dribbble Invite" }
    ];

    const posters = rawDays.map((day, index) => {
        const color = colors[index % colors.length];
        return {
            file: `Day ${day.num} - ${day.title}.webp`,
            title: `Day ${day.num} - ${day.title}`,
            brandColor: color.brand,
            bgShade: color.bg
        };
    });

    const assetBaseUrl = "../../../assets/work/Design%20Vault/Daily%20UI%20Posts/";

    let currentIndex = 0; // Starts with Day 1 - Sign Up Page (Index 0)
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
