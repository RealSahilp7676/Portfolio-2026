/**
 * Portfolio Base Interactions & Animation State Management
 * Enforced strict script loading context wrapper safeguard.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Initialize base systems
    initScrollTracking();
    initMobileMenu();
    initAboutStack();
    initConnectModal();
    initDesignVaultModal();
    
    console.log("Portfolio base workspace initialized successfully.");
});

/**
 * Handles the mobile navigation overlay state and accessibility transitions
 */
function initMobileMenu() {
    const trigger = document.getElementById("mobile-menu-trigger");
    const nav = document.getElementById("main-navigation");
    if (!trigger || !nav) return;

    const closeMenu = () => {
        trigger.classList.remove("is-active");
        nav.classList.remove("is-active");
        trigger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    };

    const openMenu = () => {
        trigger.classList.add("is-active");
        nav.classList.add("is-active");
        trigger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    };

    const toggleMenu = () => {
        if (trigger.classList.contains("is-active")) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    // Hamburger button click
    trigger.addEventListener("click", toggleMenu);

    // Close when tapping the translucent backdrop (not the nav-list itself)
    nav.addEventListener("click", (e) => {
        if (e.target === nav) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && trigger.classList.contains("is-active")) {
            closeMenu();
            trigger.focus();
        }
    });

    // Close menu when navigating via links
    const links = nav.querySelectorAll(".nav-link");
    links.forEach(link => {
        link.addEventListener("click", closeMenu);
    });
}

/**
 * Tracks window scroll state and applies dynamic updates to the navigation shell
 */
function initScrollTracking() {
    const header = document.getElementById("site-header");
    if (!header) return;

    // Scroll state threshold (pixels scrolled before header changes state)
    const scrollThreshold = 20;

    const handleScroll = () => {
        const scrolled = window.scrollY;
        
        // Dynamic navigation shell state modification placeholder
        if (scrolled > scrollThreshold) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    };

    // Attach passive scroll listener for optimal scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Run once on load to establish initial state
    handleScroll();
}

/**
 * Implements Pointer Drag Shuffling on Desktop/Tablet and Auto-Rotation on Mobile for the About stack
 */
function initAboutStack() {
    const deck = document.getElementById("image-stack-deck");
    const customCursor = document.getElementById("custom-drag-cursor");
    if (!deck) return;

    let cards = Array.from(deck.querySelectorAll(".card-stack-card"));
    let isDragging = false;
    let isAnimating = false;
    let startX = 0;
    let currentX = 0;
    let activeCard = null;
    let autoplayTimer = null;

    // Fix 1: Programmatically initialize inline z-indexes based on DOM order if not present
    cards.forEach((card, index) => {
        if (!card.style.zIndex) {
            // Assumes top card is the first one in the DOM. Adjust if your stack order is reversed.
            card.style.zIndex = (cards.length - index).toString();
        }
    });

    // Fix 2: Robustly find the top active card using computed styles or actual values
    const getActiveCard = () => {
        return cards.reduce((highest, card) => {
            const currentZ = parseInt(window.getComputedStyle(card).zIndex) || 0;
            const highestZ = parseInt(window.getComputedStyle(highest).zIndex) || 0;
            return currentZ > highestZ ? card : highest;
        }, cards[0]);
    };

    // Rearrange visual stack data indices based on z-index hierarchy
    const updateIndices = () => {
        const sorted = [...cards].sort((a, b) => {
            const zA = parseInt(window.getComputedStyle(a).zIndex) || 0;
            const zB = parseInt(window.getComputedStyle(b).zIndex) || 0;
            return zB - zA;
        });
        sorted.forEach((card, index) => {
            card.setAttribute("data-card-index", index);
        });
    };

    // Custom Drag Badge Cursor tracking
    const updateCursor = (e) => {
        if (!customCursor) return;
        const rect = deck.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        customCursor.style.left = `${x}px`;
        customCursor.style.top = `${y}px`;
    };

    deck.addEventListener("pointerenter", (e) => {
        if (window.innerWidth >= 768 && e.pointerType !== 'touch' && customCursor) {
            customCursor.classList.add("is-visible");
        }
    });

    deck.addEventListener("pointerleave", () => {
        if (customCursor) {
            customCursor.classList.remove("is-visible");
        }
        if (isDragging) endDrag();
    });

    deck.addEventListener("pointermove", (e) => {
        if (window.innerWidth >= 768) {
            if (e.pointerType !== 'touch') {
                updateCursor(e);
            }
            if (isDragging) drag(e);
        }
    });

    // Desktop/Tablet Pointer Drag handlers
    const startDrag = (e) => {
        if (window.innerWidth < 768 || isAnimating) return;
        if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only for mouse
        
        isDragging = true;
        startX = e.clientX;
        activeCard = getActiveCard();
        activeCard.style.transition = "none"; // disable transitions during manual tracking
        
        try {
            activeCard.setPointerCapture(e.pointerId);
        } catch (err) {
            console.warn("setPointerCapture failed:", err);
        }
        
        if (customCursor && e.pointerType !== 'touch') {
            customCursor.classList.add("is-dragging");
        }
    };

    const drag = (e) => {
        if (!isDragging || !activeCard) return;
        currentX = e.clientX - startX;
        const rotate = currentX * 0.05; // dynamic drag rotation
        activeCard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
    };

    const endDrag = (e) => {
        if (!isDragging || !activeCard) return;
        isDragging = false;
        
        if (e && e.pointerId !== undefined) {
            try {
                activeCard.releasePointerCapture(e.pointerId);
            } catch (err) {
                // ignore
            }
        }

        if (customCursor) customCursor.classList.remove("is-dragging");

        activeCard.style.transition = ""; // restore transform transition smooth timings
        
        const swipeThreshold = 100;
        if (currentX > swipeThreshold) {
            swipeAway("right");
        } else if (currentX < -swipeThreshold) {
            swipeAway("left");
        } else {
            activeCard.style.transform = ""; // bounce back
        }
        currentX = 0;
    };

    const swipeAway = (direction) => {
        isAnimating = true;
        const translateVal = direction === "right" ? "120%" : "-120%";
        const rotateVal = direction === "right" ? "10deg" : "-10deg";
        
        activeCard.style.transform = `translateX(${translateVal}) rotate(${rotateVal})`;
        activeCard.style.opacity = "0";

        // Cycle z-index hierarchy once translation completes
        setTimeout(() => {
            cards.forEach(card => {
                // Fix 3: Added a fallback (|| 0) to ensure calculation never fails into NaN numbers
                let z = parseInt(card.style.zIndex) || 0;
                if (card === activeCard) {
                    card.style.zIndex = "1"; // send to bottom of stack
                } else {
                    card.style.zIndex = (z + 1).toString(); // raise other cards
                }
            });

            activeCard.style.transform = "";
            activeCard.style.opacity = "";
            updateIndices();
            isAnimating = false;
        }, 400);
    };

    deck.addEventListener("pointerdown", startDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Initial stack indices mapping
    updateIndices();

    // Mobile Clockwise Auto-Rotation Carousel (setInterval 2.8s)
    const initAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            if (window.innerWidth < 768 && !isAnimating) {
                isAnimating = true;
                activeCard = getActiveCard();
                activeCard.classList.add("swipe-auto");
                
                setTimeout(() => {
                    cards.forEach(card => {
                        let z = parseInt(card.style.zIndex) || 0;
                        if (card === activeCard) {
                            card.style.zIndex = "1";
                        } else {
                            card.style.zIndex = (z + 1).toString();
                        }
                    });
                    activeCard.classList.remove("swipe-auto");
                    updateIndices();
                    isAnimating = false;
                }, 500); // Wait for CSS translation animation to complete
            }
        }, 2800);
    };

    initAutoplay();
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        } else {
            if (!autoplayTimer) initAutoplay();
        }
    });
}

/**
 * Manages the Connect With Me modal (triggers, overlay interactions, and full accessibility lifecycle)
 */
function initConnectModal() {
    const modal = document.getElementById("connect-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const triggerButtons = document.querySelectorAll(".btn-connect, [href='#connect']");
    if (!modal || !closeBtn) return;

    let previousActiveElement = null;

    // Accessibility main elements to hide from screen readers when modal is active
    const appElements = [
        document.getElementById("site-header"),
        document.getElementById("main-content"),
        document.getElementById("site-footer")
    ].filter(Boolean);

    // List of focusable elements in the modal to trap keyboard navigation
    const getFocusableElements = () => {
        return Array.from(modal.querySelectorAll('button, a[href]')).filter(el => {
            return !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true';
        });
    };

    const openModal = () => {
        previousActiveElement = document.activeElement;
        
        modal.classList.add("is-active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // lock background scroll

        // Accessibility: Hide other DOM sections from screen readers
        appElements.forEach(el => el.setAttribute("aria-hidden", "true"));

        // Put focus on the close button or first interactive element
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        // Bind escape key & keydown listeners
        document.addEventListener("keydown", handleKeydown);
    };

    const closeModal = () => {
        modal.classList.remove("is-active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // restore background scroll

        // Accessibility: Restore other DOM sections
        appElements.forEach(el => el.removeAttribute("aria-hidden"));

        // Remove keyboard listeners
        document.removeEventListener("keydown", handleKeydown);

        // Return focus to trigger element
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }

        // Clean url hash if modal was opened by #connect hash path
        if (window.location.hash === "#connect") {
            // Remove the hash without triggering scroll
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    };

    // Keyboard Accessibility Handler (Focus trapping & Escape key)
    const handleKeydown = (e) => {
        if (e.key === "Escape") {
            closeModal();
            return;
        }

        if (e.key === "Tab") {
            const focusable = getFocusableElements();
            if (focusable.length === 0) return;

            const firstEl = focusable[0];
            const lastEl = focusable[focusable.length - 1];

            if (e.shiftKey) { // Shift + Tab (navigating backward)
                if (document.activeElement === firstEl) {
                    lastEl.focus();
                    e.preventDefault();
                }
            } else { // Tab (navigating forward)
                if (document.activeElement === lastEl) {
                    firstEl.focus();
                    e.preventDefault();
                }
            }
        }
    };

    // Event listeners
    triggerButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn.addEventListener("click", closeModal);

    // Close when clicking overlay backdrop outside the modal card
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Support opening modal directly via index.html#connect path
    const checkHash = () => {
        if (window.location.hash === "#connect") {
            openModal();
        }
    };

    window.addEventListener("hashchange", checkHash);
    checkHash(); // run on load
}

// Initialize dynamic case study modal logic
function initProjectModal() {
    const projectCards = document.querySelectorAll(".project-card[data-project-url]");
    const modal = document.getElementById("project-modal");
    const modalBody = document.getElementById("project-modal-body");
    const closeBtn = document.getElementById("project-modal-close");

    if (!projectCards.length || !modal || !modalBody || !closeBtn) return;

    let videoObserver = null;
    let revealObserver = null;

    // Scroll reveal observer setup
    const initRevealObserver = () => {
        const revealItems = modalBody.querySelectorAll(".reveal-item");
        if (!revealItems.length) return;

        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: modalBody, // Trigger relative to the scroll container
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        revealItems.forEach(item => revealObserver.observe(item));
    };

    // Video play/pause observer setup
    const initVideoObserver = () => {
        const videos = modalBody.querySelectorAll("video");
        if (!videos.length) return;

        videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Auto-play was prevented
                            console.warn("Autoplay prevented:", error);
                        });
                    }
                } else {
                    video.pause();
                }
            });
        }, {
            root: modalBody,
            threshold: 0.2
        });

        videos.forEach(video => videoObserver.observe(video));
    };

    const cleanupObservers = () => {
        if (revealObserver) {
            revealObserver.disconnect();
            revealObserver = null;
        }
        if (videoObserver) {
            videoObserver.disconnect();
            videoObserver = null;
        }
    };

    const openProject = async (url) => {
        try {
            // Show a loading state if desired (optional)
            modalBody.innerHTML = '<div class="loader">Loading...</div>';
            modal.classList.add("is-active");
            document.body.classList.add("body-no-scroll");

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();

            modalBody.innerHTML = html;

            // Wait a tick for DOM to update, then initialize observers
            setTimeout(() => {
                initRevealObserver();
                initVideoObserver();
            }, 50);

        } catch (error) {
            console.error("Failed to load project details:", error);
            modalBody.innerHTML = '<div class="error">Failed to load project content. Please try again.</div>';
        }
    };

    const closeProject = () => {
        modal.classList.remove("is-active");
        document.body.classList.remove("body-no-scroll");
        
        // Wait for CSS transition to finish before clearing content
        setTimeout(() => {
            cleanupObservers();
            modalBody.innerHTML = "";
        }, 550); // Matches the 0.55s CSS transition
    };

    projectCards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.preventDefault(); // In case the wrapper is an anchor
            const url = card.getAttribute("data-project-url");
            if (url) openProject(url);
        });
    });

    closeBtn.addEventListener("click", closeProject);

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeProject();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-active")) {
            closeProject();
        }
    });
}

// Add initProjectModal to the end
document.addEventListener("DOMContentLoaded", () => {
    initProjectModal();
});

/**
 * Design Vault Modal
 * Opens a centered sheet with blurred backdrop when Design Vault card is clicked.
 * Figma node 265:6246
 */
function initDesignVaultModal() {
    const modal = document.getElementById("design-vault-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("dv-close-btn");
    const triggers = [
        document.getElementById("design-vault-trigger"),
        document.getElementById("design-vault-trigger-title"),
    ].filter(Boolean);

    const openModal = () => {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        // Focus the close button for accessibility
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    // Trigger from both the image overlay button and the title button
    triggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Also allow clicking the whole card article to open
    const card = document.getElementById("design-vault-card");
    if (card) {
        card.addEventListener("click", (e) => {
            // Only open if not clicking a child that handles its own action
            openModal();
        });
    }

    // Close via button
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close on backdrop click (clicking outside the panel)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    // Check hash on load or change to auto-open Design Vault modal
    const checkHash = () => {
        if (window.location.hash === "#design-vault") {
            openModal();
        }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
}
