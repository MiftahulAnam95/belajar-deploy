window.DeployLabLayout = (() => {
  const basePath = () => document.body.dataset.base || "";

  const links = [
    { page: "home", label: "Home", url: "index.html" },
    { page: "materi", label: "Materi", url: "materi.html" },
    { page: "quiz", label: "Quiz", url: "quiz.html" },
    { page: "debugging", label: "Debugging", url: "debugging.html" },
    { page: "recall", label: "Recall", url: "recall.html" },
    { page: "editor", label: "Simulator", url: "editor.html" },
    { page: "projects", label: "Project", url: "projects.html" },
    { page: "progress", label: "Progress", url: "progress.html" }
  ];

  const renderNav = () => {
    const page = document.body.dataset.page || "home";
    const base = basePath();
    const target = document.getElementById("appNav");
    if (!target) return;

    target.innerHTML = `
      <nav class="navbar navbar-expand-lg sticky-top app-navbar">
        <div class="container">
          <a class="navbar-brand" href="${base}index.html" aria-label="Deploy Project Lab">
            <span class="brand-mark"><i class="bi bi-cloud-upload"></i></span>
            <span class="brand-text"><strong>Deploy Lab</strong><span>Project Hosting</span></span>
          </a>
          <div class="d-flex align-items-center gap-2 order-lg-3">
            <button class="icon-btn" type="button" data-theme-toggle aria-label="Gunakan mode gelap" title="Mode gelap"><i class="bi bi-moon-stars"></i></button>
            <button class="navbar-toggler icon-btn" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Buka navigasi">
              <i class="bi bi-list"></i>
            </button>
          </div>
          <div class="collapse navbar-collapse order-lg-2" id="mainNav">
            <ul class="navbar-nav ms-lg-auto gap-lg-1">
              ${links
                .map(
                  (link) => `
                    <li class="nav-item">
                      <a class="nav-link ${link.page === page || (page === "lesson" && link.page === "materi") ? "active" : ""}" href="${base}${link.url}">${link.label}</a>
                    </li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      </nav>
    `;

    target.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
      const state = window.DeployLabProgress.getState();
      window.DeployLabProgress.setDarkMode(!state.darkMode);
      showToast(!state.darkMode ? "Mode gelap aktif" : "Mode terang aktif");
    });

    window.DeployLabProgress.applyTheme();
  };

  const renderFooter = () => {
    const base = basePath();
    const target = document.getElementById("appFooter");
    if (!target) return;
    target.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="d-flex flex-column flex-lg-row gap-2 justify-content-between">
            <span>Deploy Project Lab - lanjutan belajar web development menuju deploy profesional.</span>
            <span><a href="${base}materi.html">Materi</a> / <a href="${base}editor.html">Simulator</a> / <a href="${base}progress.html">Progress</a></span>
          </div>
        </div>
      </footer>
    `;
  };

  const renderToast = () => {
    const target = document.getElementById("appToast");
    if (!target) return;
    target.innerHTML = `
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" class="toast app-toast" role="status" aria-live="polite" aria-atomic="true">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill"></i>
            <span data-toast-message>Progress tersimpan.</span>
          </div>
        </div>
      </div>
    `;
  };

  const showToast = (message) => {
    const toastElement = document.getElementById("liveToast");
    const text = document.querySelector("[data-toast-message]");
    if (!toastElement || !text) return;
    text.textContent = message;
    if (window.bootstrap?.Toast) {
      window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1800 }).show();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    renderFooter();
    renderToast();
  });

  return { showToast, renderNav, renderFooter };
})();
