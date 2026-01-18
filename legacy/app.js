const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

const copyButtons = document.querySelectorAll("[data-copy]");
copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const targetSelector = button.getAttribute("data-copy");
    const target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    const value = target.value || target.textContent || "";
    if (!value) {
      return;
    }

    const original = button.textContent;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        target.focus();
        target.select();
        document.execCommand("copy");
      }
      button.textContent = "Copied";
    } catch (error) {
      button.textContent = "Press Ctrl+C";
    }

    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  });
});
