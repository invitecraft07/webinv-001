/* =========================================================
   PREMIUM WEDDING INVITATION
   Main JavaScript
   ========================================================= */


/* =========================================================
   CONFIGURATION
   =========================================================

   IMPORTANT:

   Change ONLY this date when customizing the invitation.

   Format:
   YYYY-MM-DDTHH:MM:SS

   Example:
   2026-12-20T10:30:00

   The date should represent the wedding date and time
   in the visitor's local timezone.
   ========================================================= */

const WEDDING_DATE = "2026-12-20T10:30:00";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeRevealAnimations();

    initializeCountdown();

});


/* =========================================================
   REVEAL ANIMATIONS
   ========================================================= */

function initializeRevealAnimations() {

    const animatedElements =
        document.querySelectorAll(".animate");


    /* Nothing to animate */
    if (!animatedElements.length) {
        return;
    }


    /*
        Respect users who prefer reduced motion.

        In this case, everything is immediately visible.
    */
    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        animatedElements.forEach(element => {
            element.classList.add("show");
        });

        return;
    }


    /*
        IntersectionObserver is more efficient than
        listening to scroll events continuously.
    */
    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("show");

                            /*
                                Once an element is revealed,
                                there is no need to observe it anymore.
                            */
                            observerInstance.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        animatedElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        /*
            Fallback for older browsers.
        */
        animatedElements.forEach(element => {

            element.classList.add("show");

        });

    }

}


/* =========================================================
   COUNTDOWN
   ========================================================= */

function initializeCountdown() {

    const countdownWrapper =
        document.querySelector(
            ".countdown-wrapper"
        );


    /*
        If the countdown section doesn't exist,
        simply stop here.
    */
    if (!countdownWrapper) {
        return;
    }


    /*
        Find countdown elements.
    */
    const daysElement =
        document.getElementById("d");

    const hoursElement =
        document.getElementById("h");

    const minutesElement =
        document.getElementById("m");

    const secondsElement =
        document.getElementById("s");


    /*
        Make sure all required elements exist.
    */
    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }


    /*
        Convert configured date to timestamp.
    */
    const weddingTimestamp =
        new Date(WEDDING_DATE).getTime();


    /*
        Validate the configured date.
    */
    if (Number.isNaN(weddingTimestamp)) {

        console.error(
            "Wedding Invitation: Invalid wedding date."
        );

        return;
    }


    /*
        Update countdown immediately.

        This prevents the page from displaying
        00:00:00 for the first second.
    */
    updateCountdown();


    /*
        Update every second.
    */
    const countdownTimer =
        window.setInterval(
            updateCountdown,
            1000
        );


    /*
        Countdown calculation.
    */
    function updateCountdown() {

        const currentTimestamp =
            Date.now();


        const difference =
            weddingTimestamp -
            currentTimestamp;


        /*
            Wedding date has arrived.
        */
        if (difference <= 0) {

            showWeddingDay();

            window.clearInterval(
                countdownTimer
            );

            return;
        }


        /*
            Time calculations.
        */
        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        /*
            Update UI.
        */
        daysElement.textContent =
            formatNumber(days);

        hoursElement.textContent =
            formatNumber(hours);

        minutesElement.textContent =
            formatNumber(minutes);

        secondsElement.textContent =
            formatNumber(seconds);

    }


    /*
        Format numbers with leading zero.
    */
    function formatNumber(number) {

        return String(number)
            .padStart(2, "0");

    }


    /*
        Wedding day state.
    */
    function showWeddingDay() {

        countdownWrapper.innerHTML = "";


        const weddingDayBox =
            document.createElement("div");


        weddingDayBox.className =
            "time-box";


        const icon =
            document.createElement("span");


        icon.textContent = "💍";


        const label =
            document.createElement("small");


        label.textContent =
            "Wedding Day";


        weddingDayBox.appendChild(icon);

        weddingDayBox.appendChild(label);

        countdownWrapper.appendChild(
            weddingDayBox
        );

    }

}


/* =========================================================
   OPTIONAL: SMOOTH INTERNAL LINKS
   =========================================================

   This provides a consistent smooth-scroll experience
   for internal anchor links.
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if (!link) {
            return;
        }


        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(
                targetId
            );


        if (!target) {
            return;
        }


        /*
            Respect reduced-motion preferences.
        */
        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        if (!prefersReducedMotion) {

            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);


/* =========================================================
   OPTIONAL: PREVENT BROKEN EXTERNAL IMAGES
   =========================================================

   If a customer's image is missing, hide the broken
   image rather than displaying a browser error icon.

   This is intentionally conservative and only affects
   images that fail to load.
   ========================================================= */

document.addEventListener(
    "error",
    event => {

        const element =
            event.target;


        if (
            element &&
            element.tagName === "IMG"
        ) {

            element.classList.add(
                "image-load-error"
            );

        }

    },
    true
);
