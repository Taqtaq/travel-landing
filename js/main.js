// ===== Helpers =====
// Simple helper for getElementById
const $ = (id) => document.getElementById(id);

// ===== Year =====
$("year").textContent = new Date().getFullYear();

// ===== Cookie banner (localStorage) =====
const COOKIE_KEY = "cookieAccepted";

function initCookie() {
  const accepted = localStorage.getItem(COOKIE_KEY);
  if (accepted === "yes") {
    $("cookieBanner").style.display = "none";
  }

  $("cookieAccept").addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "yes");
    $("cookieBanner").style.display = "none";
  });
}

// ===== Burger menu =====
function initBurger() {
  const burgerBtn = $("burgerBtn");
  const mobileMenu = $("mobileMenu");

  const openMenu = () => {
    mobileMenu.classList.add("is-open");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("is-open");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  };

  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("mobile__link")) closeMenu();
  });

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// ===== Header bg on scroll + scroll to top =====
function initScrollUI() {
  const header = $("header");
  const toTop = $("toTop");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    // Header background
    if (y > 10) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");

    // Scroll-to-top button
    if (y > 400) toTop.classList.add("is-visible");
    else toTop.classList.remove("is-visible");
  });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
// ===== Fetch API (GET) Destinations =====
async function loadDestinations() {
  const grid = $("destinationsGrid");
  const note = $("apiNote");

  grid.innerHTML = "";
  note.textContent = "Loading data...";

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();

    data.slice(0, 6).forEach((user) => {
      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <div class="card__body">
          <h3 class="card__name">${user.company.name}</h3>
          <p class="card__meta">City: ${user.address.city}</p>
          <p class="card__meta">Email: ${user.email}</p>
          <p class="card__meta">Website: ${user.website}</p>
          <span class="tag">API • GET</span>
        </div>
      `;

      grid.appendChild(card);
    });

    note.textContent = "Data loaded successfully (fetch + async/await).";
  } catch (error) {
    note.textContent = "Failed to load data from server.";
  }
}

// ===== Form validation (regex + required + show/hide pass) =====
function initForm() {
  const form = $("contactForm");
  const success = $("formSuccess");

  const nameInput = $("name");
  const emailInput = $("email");
  const phoneInput = $("phone");
  const passInput = $("password");
  const msgInput = $("message");

  const nameError = $("nameError");
  const emailError = $("emailError");
  const phoneError = $("phoneError");
  const passError = $("passError");
  const msgError = $("msgError");

  const toggleBtn = $("togglePass");

  // Simple regex rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^\+?\d[\d\s\-()]{7,}$/; // allows +995 555...
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // min 6, letters+digits

  const setError = (el, msg) => { el.textContent = msg; };
  const clearAll = () => {
    setError(nameError, "");
    setError(emailError, "");
    setError(phoneError, "");
    setError(passError, "");
    setError(msgError, "");
    success.textContent = "";
  };

  // Show/Hide password
  toggleBtn.addEventListener("click", () => {
    const isPass = passInput.type === "password";
    passInput.type = isPass ? "text" : "password";
    toggleBtn.textContent = isPass ? "Hide" : "Show";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAll();

    let ok = true;

    // Required checks + regex
    if (nameInput.value.trim().length < 2) {
      setError(nameError, "Please enter your name (min 2 characters).");
      ok = false;
    }

    if (!emailRegex.test(emailInput.value.trim())) {
      setError(emailError, "Please enter a valid email.");
      ok = false;
    }

    if (!phoneRegex.test(phoneInput.value.trim())) {
      setError(phoneError, "Please enter a valid phone (e.g. +995 555 123 456).");
      ok = false;
    }

    if (!passRegex.test(passInput.value.trim())) {
      setError(passError, "Password: min 6 chars, include letters and numbers.");
      ok = false;
    }

    if (msgInput.value.trim().length < 5) {
      setError(msgError, "Message must be at least 5 characters.");
      ok = false;
    }

    if (ok) {
      success.textContent = "Form submitted successfully (demo).";
      form.reset();

      // Reset password UI
      passInput.type = "password";
      toggleBtn.textContent = "Show";
    }
  });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  initCookie();
  initBurger();
  initScrollUI();
  initForm();
  loadDestinations();
});
