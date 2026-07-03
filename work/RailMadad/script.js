document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll Reveal Engine
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll(".reveal-item");
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    // Once revealed, we can unobserve to keep it visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.15, // Trigger when 15% of the element is visible
            rootMargin: "0px 0px -50px 0px" // Slightly before the element hits the bottom
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    };

    // 2. Video Performance Optimization
    const initVideoOptimization = () => {
        const videoElements = document.querySelectorAll("video");
        if (videoElements.length === 0) return;

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Play video when in viewport
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn("Autoplay prevented:", error);
                        });
                    }
                } else {
                    // Pause video when out of viewport to save battery & CPU
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, {
            root: null,
            threshold: 0.1, // Trigger as soon as 10% of video is visible
            rootMargin: "50px 0px" // Start loading/playing slightly before it enters screen
        });

        videoElements.forEach(video => {
            videoObserver.observe(video);
        });
    };

    // Initialize scripts
    initScrollReveal();
    initVideoOptimization();
});
