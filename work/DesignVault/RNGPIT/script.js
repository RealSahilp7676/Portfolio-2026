document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer for reveal animations
    const revealElements = document.querySelectorAll(".reveal-item");

    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it comes into view
        threshold: 0,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });
});
