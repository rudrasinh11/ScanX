export function toast(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent("scanx:toast", { detail: { id: crypto.randomUUID(), message, type } })
  );
}

toast.success = (message) => toast(message, "success");
toast.error = (message) => toast(message, "error");
toast.info = (message) => toast(message, "info");
