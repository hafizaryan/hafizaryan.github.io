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

// Project modal + filters
function setupProjectModal() {
  const cards = document.querySelectorAll('[data-project-card]');
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('[data-close-project]');
  const imgEl = document.getElementById('project-modal-image');
  const titleEl = document.getElementById('project-modal-title');
  const descEl = document.getElementById('project-modal-desc');
  const techEl = document.getElementById('project-modal-tech');
  const featEl = document.getElementById('project-modal-features');
  const repoEl = document.getElementById('project-modal-repo');
  const demoEl = document.getElementById('project-modal-demo');

  const openModal = (card) => {
    const title = card.dataset.title || card.querySelector('h3')?.textContent?.trim() || 'Project';
    const desc = card.dataset.desc || card.querySelector('p')?.textContent?.trim() || '';
    const tech = card.dataset.tech || '';
    const features = card.dataset.features || '';
    const image = card.dataset.image || card.querySelector('img')?.src || '';
    const link = card.dataset.link || '#';
    const demo = card.dataset.demo || '';

    titleEl.textContent = title;
    descEl.textContent = desc;
    if (image) {
      imgEl.src = image;
      imgEl.alt = title;
    } else {
      imgEl.removeAttribute('src');
      imgEl.alt = '';
    }

    // Render tech chips
    techEl.innerHTML = '';
    if (tech) {
      tech.split(',').map((s) => s.trim()).filter(Boolean).forEach((t) => {
        const span = document.createElement('span');
        span.className = 'border border-border px-2 py-1 text-xs text-gray-300';
        span.textContent = t;
        techEl.appendChild(span);
      });
    }

    // Render features list
    featEl.innerHTML = '';
    if (features) {
      features.split('|').map((s) => s.trim()).filter(Boolean).forEach((f) => {
        const li = document.createElement('li');
        li.textContent = f;
        featEl.appendChild(li);
      });
    }

    // Repo link
    repoEl.href = link;

    // Demo link handling
    if (demo && demo !== '#') {
      demoEl.href = demo;
      demoEl.classList.remove('hidden');
    } else {
      demoEl.href = '#';
      demoEl.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Filters
  const filterBar = document.getElementById('project-filters');
  if (filterBar) {
    const buttons = filterBar.querySelectorAll('button[data-filter]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.filter;

        // Toggle pressed state styles
        buttons.forEach((b) => {
          const pressed = b === btn;
          b.setAttribute('aria-pressed', String(pressed));
          b.classList.toggle('border-white', pressed);
        });

        // Show/Hide cards
        cards.forEach((card) => {
          const cat = card.dataset.category || 'all';
          const show = value === 'all' || value === cat;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }
}

// Fetch GitHub stars and forks for each card
function hydrateRepoStats() {
  const cards = document.querySelectorAll('[data-project-card][data-repo]');
  cards.forEach((card) => {
    const repo = card.dataset.repo;
    if (!repo) return;
    const statsEl = card.querySelector('[data-repo-stats]');
    if (!statsEl) return;

    // Hide until data arrives
    statsEl.classList.add('hidden');

    const starsEl = statsEl.querySelector('[data-stars]');
    const forksEl = statsEl.querySelector('[data-forks]');
    const updatedEl = statsEl.querySelector('[data-updated]');

    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (starsEl) starsEl.textContent = data.stargazers_count ?? '--';
        if (forksEl) forksEl.textContent = data.forks_count ?? '--';
        if (updatedEl) updatedEl.textContent = formatUpdatedDate(data.updated_at);

        // Only show if we have at least one real value
        const hasData =
          (data.stargazers_count ?? null) !== null ||
          (data.forks_count ?? null) !== null ||
          !!data.updated_at;
        if (hasData) statsEl.classList.remove('hidden');
      })
      .catch(() => {
        if (starsEl) starsEl.textContent = '--';
        if (forksEl) forksEl.textContent = '--';
        if (updatedEl) updatedEl.textContent = '--';
        statsEl.classList.add('hidden');
      });
  });
}

function formatUpdatedDate(value) {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Subtle tilt / shine effect on hover
function setupTilt() {
  const cards = document.querySelectorAll('[data-project-card]');
  const tiltMax = 6; // adjust intensity here (degrees)
  cards.forEach((card) => {
    card.classList.add('project-card');
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * tiltMax; // yaw
      const rotateX = -((y - midY) / midY) * tiltMax; // pitch
      card.style.setProperty('--tilt-x', `${rotateY}deg`);
      card.style.setProperty('--tilt-y', `${rotateX}deg`);
      card.style.setProperty('--shine-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--shine-y', `${(y / rect.height) * 100}%`);
    };

    const reset = () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--shine-x', '50%');
      card.style.setProperty('--shine-y', '50%');
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('mouseenter', reset);
  });
}

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
  setupTilt();
  hydrateRepoStats();
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
        