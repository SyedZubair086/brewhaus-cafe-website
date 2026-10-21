/* =========================================
   BREWHAUS - MAIN JAVASCRIPT
   Works with the current index.html and menu.html
   File location: js/main.js
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. MENU PAGE: Filter cards using the existing data-category values.
  const filterButtons = document.querySelectorAll(".filter-btn[data-category]");
  const menuCards = document.querySelectorAll(".menu-card[data-category]");

  if (filterButtons.length && menuCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedCategory = (
          button.dataset.category || "all"
        ).trim().toLowerCase();

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        menuCards.forEach((card) => {
          const cardCategory = (
            card.dataset.category || ""
          ).trim().toLowerCase();

          const shouldShow =
            selectedCategory === "all" ||
            selectedCategory === "*" ||
            cardCategory === selectedCategory;

          card.hidden = !shouldShow;
        });
      });
    });
  }

  // 2. MOBILE NAVIGATION: Add a toggle button if the HTML has no toggle yet.
  // This supports both current navbar structures without changing the HTML.
  const navbar = document.querySelector(".navbar");
  const navLinks = navbar?.querySelector(".nav-links");

  if (navbar && navLinks && !navbar.querySelector(".mobile-nav-toggle")) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-nav-toggle";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span></span><span></span><span></span>';

    Object.assign(toggle.style, {
      display: "none",
      border: "0",
      background: "transparent",
      padding: "8px",
      cursor: "pointer",
      flexDirection: "column",
      gap: "5px"
    });

    toggle.querySelectorAll("span").forEach((line) => {
      Object.assign(line.style, {
        display: "block",
        width: "25px",
        height: "2px",
        background: "currentColor"
      });
    });

    navbar.insertBefore(toggle, navLinks);

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const updateNavigation = () => {
      if (mobileQuery.matches) {
        toggle.style.display = "flex";
        navLinks.style.display =
          toggle.getAttribute("aria-expanded") === "true" ? "flex" : "none";

        Object.assign(navLinks.style, {
          flexDirection: "column",
          gap: "16px",
          width: "100%"
        });

        navbar.style.flexWrap = "wrap";
      } else {
        toggle.style.display = "none";
        navLinks.style.display = "";
        navLinks.style.flexDirection = "";
        navLinks.style.gap = "";
        navLinks.style.width = "";
        navbar.style.flexWrap = "";
        toggle.setAttribute("aria-expanded", "false");
      }
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );
      navLinks.style.display = isOpen ? "none" : "flex";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileQuery.matches) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open navigation menu");
          navLinks.style.display = "none";
        }
      });
    });

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", updateNavigation);
    } else {
      mobileQuery.addListener(updateNavigation);
    }

    updateNavigation();
  }

  // 3. GALLERY: Open an image in a lightbox if a gallery page uses these selectors.
  const galleryImages = document.querySelectorAll(
    "[data-lightbox], .gallery-grid img, .gallery-item img"
  );

  if (galleryImages.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "brewhaus-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image preview");

    lightbox.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close image preview">&times;</button>
      <img class="lightbox-image" alt="">
    `;

    Object.assign(lightbox.style, {
      display: "none",
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      background: "rgba(0, 0, 0, 0.92)",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    });

    const closeButton = lightbox.querySelector(".lightbox-close");
    const preview = lightbox.querySelector(".lightbox-image");

    Object.assign(closeButton.style, {
      position: "absolute",
      top: "18px",
      right: "24px",
      border: "0",
      background: "transparent",
      color: "#fff",
      fontSize: "42px",
      cursor: "pointer"
    });

    Object.assign(preview.style, {
      maxWidth: "90%",
      maxHeight: "85vh",
      objectFit: "contain"
    });

    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.style.display = "none";
    };

    galleryImages.forEach((image) => {
      image.style.cursor = "zoom-in";
      image.addEventListener("click", () => {
        preview.src = image.dataset.lightbox || image.currentSrc || image.src;
        preview.alt = image.alt || "BrewHaus gallery image";
        lightbox.style.display = "flex";
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  // 4. CONTACT PAGE: Basic client-side validation.
  // This validates fields only; it does not send an email.
  const contactForm = document.querySelector("#contact-form, .contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const emailInput = contactForm.querySelector('input[type="email"]');

      if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailInput.value.trim())) {
          emailInput.setCustomValidity("Please enter a valid email address.");
          emailInput.reportValidity();
          emailInput.setCustomValidity("");
          return;
        }
      }

      const message = contactForm.querySelector("#form-message, .form-message");

      if (message) {
        message.textContent =
          "Your form is valid. Email delivery is not connected yet.";
        message.setAttribute("role", "status");
      } else {
        alert("Your form is valid. Email delivery is not connected yet.");
      }
    });
  }

  // 5. OPTIONAL DARK MODE: Only activates if a matching toggle exists.
  const themeToggle = document.querySelector(
    "#theme-toggle, .theme-toggle, [data-theme-toggle]"
  );

  if (themeToggle) {
    const savedTheme = localStorage.getItem("brewhaus-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      document.documentElement.dataset.theme = savedTheme;
    }

    themeToggle.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.dataset.theme || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem("brewhaus-theme", newTheme);
      themeToggle.setAttribute("aria-pressed", String(newTheme === "dark"));
    });
  }

  // 6. OPTIONAL SCROLL REVEAL: Add .reveal to elements that should animate.
  const revealElements = document.querySelectorAll(".reveal, [data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // 7. OPTIONAL BACK-TO-TOP BUTTON.
  const backToTop = document.querySelector("#back-to-top, .back-to-top");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.hidden = window.scrollY < 300;
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 8. Optional automatic year.
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  console.log("BrewHaus JavaScript loaded.");
});
