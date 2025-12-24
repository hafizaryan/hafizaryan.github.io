tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        // Custom Monochrome Palette based on Tailwind Zinc
        bg: "#09090b", // Very Dark (Background)
        surface: "#18181b", // Dark Gray (Card)
        border: "#27272a", // Borders
        muted: "#a1a1aa", // Secondary Text
        white: "#fafafa", // Primary Text
      },
    },
  },
};

// Mapping: section id in the page, nav link id above
const navLinks = [
  { section: null, nav: "nav-intro" }, // special: home/top
  { section: "about", nav: "nav-about" },
  { section: "work", nav: "nav-work" },
  { section: "projects", nav: "nav-projects" },
  { section: "education", nav: "nav-education" },
  { section: "organization", nav: "nav-organization" },
  { section: "awards", nav: "nav-awards" },
  { section: "contact", nav: "nav-contact" },
];

// Placeholder to avoid runtime error if project modal logic is not present yet
function setupProjectModal() {}

// teks bold ketika klik active
function setActiveNavAll() {
  let scrollPos = window.scrollY + 140; // offset for fixed navbar
  let activeIdx = 0;
  for (let i = 1; i < navLinks.length; i++) {
    const sec = navLinks[i].section
      ? document.getElementById(navLinks[i].section)
      : null;
    if (sec && sec.offsetTop <= scrollPos) {
      activeIdx = i;
    }
  }

  navLinks.forEach((lnk, idx) => {
    const navEl = document.getElementById(lnk.nav);
    if (navEl) {
      navEl.classList.toggle("text-white", idx === activeIdx);
      navEl.classList.toggle("font-bold", idx === activeIdx);
    }
  });
}
window.addEventListener("scroll", setActiveNavAll);
window.addEventListener("DOMContentLoaded", () => {
  setActiveNavAll();
  setupProjectModal();
  setupSupportModal();
});

// Hide loading screen when page is fully loaded
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("fade-out");
    // Remove from DOM after animation completes
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
});

function setupSupportModal() {
  const supportLink = document.getElementById("support-link");
  const modal = document.getElementById("support-modal");
  const closeBtn = modal ? modal.querySelector("[data-close-support]") : null;
  if (!supportLink || !modal || !closeBtn) return;

  const openModal = (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  supportLink.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

// ajs

    // Initialize AOS Animation
        AOS.init({
            once: true, // Animation happens only once
            offset: 100,
            duration: 800,
            easing: 'ease-out-cubic',
        });

        // Mobile Menu Logic
        function toggleMenu() {
            const menu = document.getElementById('mobile-menu');
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                // Trigger reflow to enable transition
                menu.offsetHeight;
                menu.classList.remove('opacity-0', 'invisible');
            } else {
                menu.classList.add('opacity-0', 'invisible');
                setTimeout(() => {
                    menu.classList.add('hidden');
                }, 300);
            }
        }

        // Close mobile menu when a link is clicked
        function closeMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.add('opacity-0', 'invisible');
            setTimeout(() => {
                menu.classList.add('hidden');
            }, 300);
        }

        // Add click event listeners to all mobile menu links
        document.addEventListener('DOMContentLoaded', function () {
            const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        });
        