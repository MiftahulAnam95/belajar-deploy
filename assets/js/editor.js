(() => {
  const data = window.DeployLabData;
  const storageKey = "deploy-project-lab-editor-v1";

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const loadState = () => {
    try {
      return { ...data.editorDefaults, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch (error) {
      return { ...data.editorDefaults };
    }
  };

  const saveState = () => {
    const state = {
      checklist: document.getElementById("checklistInput").value,
      connection: document.getElementById("connectionInput").value,
      database: document.getElementById("databaseInput").value
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const notesToHtml = (text) => {
    const lines = text.split(/\r?\n/);
    let inList = false;
    const html = [];
    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      } else if (line.startsWith("## ")) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      } else if (line.startsWith("- ")) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      } else if (/^\d+\./.test(line.trim())) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push(`<li>${escapeHtml(line.replace(/^\d+\.\s*/, ""))}</li>`);
      } else if (line.trim()) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push(`<p>${escapeHtml(line)}</p>`);
      }
    });
    if (inList) html.push("</ul>");
    return html.join("");
  };

  const analyze = () => {
    const checklist = document.getElementById("checklistInput").value;
    const connection = document.getElementById("connectionInput").value;
    const database = document.getElementById("databaseInput").value;
    const combined = `${checklist}\n${connection}\n${database}`.toLowerCase();

    const checks = [
      { id: "domain", label: "Domain dibuat", ok: /create a new domain|domains|subdomain|domain:/i.test(checklist) },
      { id: "db", label: "Database dibuat", ok: /create new database|mysql databases|database\s*:/i.test(checklist) },
      { id: "user", label: "User database", ok: /add new user|db_username|user\s*=|username|prefix_.*user/i.test(combined) },
      { id: "privilege", label: "Privilege user", ok: /add user to database|privilege|all privileges|manage user/i.test(combined) },
      { id: "upload", label: "Upload ZIP", ok: /upload|\.zip|extract|file manager/i.test(checklist) },
      { id: "host", label: "Host database", ok: /db_host|host\s*=|host-database|localhost|id\.domainesia|mysql/i.test(connection) },
      { id: "dbname", label: "Nama database", ok: /db_database|db\s*=|database/i.test(connection) && /prefix_|database_kamu|wilayah/i.test(connection) },
      { id: "import", label: "Import SQL", ok: /phpmyadmin|import|\.sql|tabel|table/i.test(database) },
      { id: "security", label: "Catatan keamanan", ok: /\.env|password|jangan|hapus|backup|document root|publik|public/i.test(combined) },
      { id: "test", label: "Testing live", ok: /test|login|crud|upload|logout|https|qa/i.test(combined) }
    ];

    const score = Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
    return { checks, score, checklist, connection, database };
  };

  const renderConsole = ({ checks, score }) => {
    const lines = [];
    lines.push("$ simulasi deploy hosting");
    lines.push(`Skor kesiapan: ${score}%`);
    lines.push("");
    lines.push("Checklist:");
    checks.forEach((check) => lines.push(`${check.ok ? "[x]" : "[ ]"} ${check.label}`));
    lines.push("");
    if (score >= 90) {
      lines.push("Status: siap dicoba di hosting latihan.");
    } else if (score >= 70) {
      lines.push("Status: hampir siap, lengkapi item yang belum centang.");
    } else {
      lines.push("Status: belum siap, mulai dari domain, database, user, upload, dan import SQL.");
    }
    document.getElementById("editorConsole").textContent = lines.join("\n");
  };

  const renderPreview = () => {
    const result = analyze();
    document.getElementById("deployScore").textContent = `${result.score}%`;
    document.getElementById("deployPreview").innerHTML = `
      <div class="deploy-board">
        <h3><i class="bi bi-cloud-check"></i> Deployment Board</h3>
        <p class="mb-0">Simulasi kesiapan project sebelum upload ke hosting.</p>
        <div class="deploy-grid">
          ${result.checks.map((check) => `<div class="deploy-pill ${check.ok ? "done" : ""}"><i class="bi ${check.ok ? "bi-check-circle-fill" : "bi-circle"}"></i>${escapeHtml(check.label)}</div>`).join("")}
        </div>
        <div class="readme-preview">
          ${notesToHtml(result.database)}
        </div>
      </div>
    `;
    renderConsole(result);
    saveState();
  };

  const bindTabs = () => {
    document.querySelectorAll("[data-editor-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.editorTab;
        document.querySelectorAll("[data-editor-tab]").forEach((item) => item.classList.toggle("active", item === button));
        document.querySelectorAll("[data-editor-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.editorPanel === tab));
      });
    });
  };

  const reset = () => {
    localStorage.removeItem(storageKey);
    const state = { ...data.editorDefaults };
    document.getElementById("checklistInput").value = state.checklist;
    document.getElementById("connectionInput").value = state.connection;
    document.getElementById("databaseInput").value = state.database;
    renderPreview();
    window.DeployLabLayout?.showToast("Simulator direset.");
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page !== "editor") return;
    const state = loadState();
    document.getElementById("checklistInput").value = state.checklist;
    document.getElementById("connectionInput").value = state.connection;
    document.getElementById("databaseInput").value = state.database;

    bindTabs();
    document.getElementById("runEditor").addEventListener("click", () => {
      renderPreview();
      window.DeployLabLayout?.showToast("Checklist disimulasikan.");
    });
    document.getElementById("resetEditor").addEventListener("click", reset);
    ["checklistInput", "connectionInput", "databaseInput"].forEach((id) => document.getElementById(id).addEventListener("input", saveState));
    renderPreview();
  });
})();
