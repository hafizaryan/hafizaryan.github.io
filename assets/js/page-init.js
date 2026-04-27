// Initialize AOS Animation
AOS.init({
  once: true,
  offset: 100,
  duration: 800,
  easing: "ease-out-cubic",
});

// Mobile Menu Logic
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;

  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    menu.offsetHeight;
    menu.classList.remove("opacity-0", "invisible");
  } else {
    menu.classList.add("opacity-0", "invisible");
    setTimeout(() => {
      menu.classList.add("hidden");
    }, 300);
  }
}

// Close mobile menu when a link is clicked
function closeMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;

  menu.classList.add("opacity-0", "invisible");
  setTimeout(() => {
    menu.classList.add("hidden");
  }, 300);
}

function showSuccessNotification() {
  const notification = document.createElement("div");
  notification.className = "fixed top-6 right-6 z-[200] animate-slide-in";
  notification.innerHTML = `
      <div class="bg-surface border border-border rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 max-w-sm">
          <div class="flex-shrink-0 text-green-400">
              <i class="fa-solid fa-check text-xl"></i>
          </div>
          <div class="flex-1">
              <p class="text-white text-sm font-medium">Pesan Anda telah berhasil terkirim!</p>
          </div>
          <button onclick="this.closest('.animate-slide-in').remove()" class="flex-shrink-0 text-gray-500 hover:text-gray-400 transition">
              <i class="fa-solid fa-times text-sm"></i>
          </button>
      </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("animate-slide-out");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function setupContactModal() {
  const modal = document.getElementById("contact-modal");
  const openButton = document.querySelector("[data-open-contact]");
  const closeButton = modal ? modal.querySelector("[data-close-contact]") : null;
  if (!modal || !openButton || !closeButton) return;
  if (modal.dataset.bound === "true") return;
  modal.dataset.bound = "true";

  const openModal = () => {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function bindPageEvents() {
  const mobileMenuLinks = document.querySelectorAll("#mobile-menu a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  setupContactModal();

  const contactForm = document.getElementById("contact-form");
  if (contactForm && !contactForm.dataset.bound) {
    contactForm.dataset.bound = "true";
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.elements.email.value;
      const message = this.elements.message.value;
      if (!email || !message) {
        alert("Please fill in all fields");
        return;
      }

      fetch(this.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, message }),
      })
        .then((response) => {
          if (response.ok) {
            showSuccessNotification();
            contactForm.reset();
            const contactModal = document.getElementById("contact-modal");
            if (contactModal) {
              contactModal.classList.add("hidden");
              document.body.classList.remove("overflow-hidden");
            }
          } else {
            alert("Failed to send message");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error sending message");
        });
    });
  }
}

document.addEventListener("DOMContentLoaded", bindPageEvents);
window.addEventListener("partials:loaded", bindPageEvents);
