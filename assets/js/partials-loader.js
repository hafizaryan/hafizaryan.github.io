function loadPartials() {
  const placeholders = document.querySelectorAll("[data-partial]");
  if (!placeholders.length) return Promise.resolve();

  const jobs = Array.from(placeholders).map(async (placeholder) => {
    const url = placeholder.getAttribute("data-partial");
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed loading partial: ${url}`);
      const html = await response.text();
      placeholder.outerHTML = html;
    } catch (error) {
      console.error(error);
    }
  });

  return Promise.all(jobs).then(() => {
    if (window.AOS && typeof window.AOS.refreshHard === "function") {
      window.AOS.refreshHard();
    }
    window.dispatchEvent(new Event("partials:loaded"));
  });
}

document.addEventListener("DOMContentLoaded", loadPartials);
