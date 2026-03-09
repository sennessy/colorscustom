(() => {
  const toast = document.getElementById("cartToast");
  if (!toast) return;

  const closeBtn = toast.querySelector(".cart-toast__close");
  let hideTimer = null;

  const hideToast = () => {
    toast.classList.add("is-hidden");
    window.setTimeout(() => {
      toast.remove();
    }, 260);
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", hideToast);
  }

  hideTimer = window.setTimeout(hideToast, 4500);
  toast.addEventListener("mouseenter", () => {
    if (hideTimer) window.clearTimeout(hideTimer);
  });
  toast.addEventListener("mouseleave", () => {
    hideTimer = window.setTimeout(hideToast, 2000);
  });
})();
