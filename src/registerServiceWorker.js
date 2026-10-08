const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

function showUpdateLink(reload) {
  if (document.getElementById("mdwa-update")) return;
  const link = document.createElement("a");
  link.id = "mdwa-update";
  link.href = "#";
  link.className = "update-available";
  link.textContent = "Update available";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    reload();
  });
  document.body.appendChild(link);
}

export default function register() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  if (publicUrl.origin !== window.location.origin) return;

  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        const announce = () => {
          if (navigator.serviceWorker.controller) {
            showUpdateLink(() => window.location.reload());
          }
        };
        if (registration.waiting) announce();
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed") announce();
          });
        });
        if (isLocalhost) {
          console.log("Service worker registered for offline use.");
        }
      })
      .catch((error) => {
        console.error("Error during service worker registration:", error);
      });
  });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
