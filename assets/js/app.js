(() => {
  const data = window.DeployLabData;
  const progress = window.DeployLabProgress;

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const toast = (message) => window.DeployLabLayout?.showToast(message);
  const basePath = () => document.body.dataset.base || "";
  const lessonUrl = (lessonOrId) => {
    const id = typeof lessonOrId === "string" ? lessonOrId : lessonOrId.id;
    return `${basePath()}materi/${id}.html`;
  };
  const getLessonPhase = (lessonIndex) =>
    data.learningPhases.find((phase) => lessonIndex >= phase.lessonStart && lessonIndex <= phase.lessonEnd) || data.learningPhases[0];
  const getPhaseLessons = (phase) => data.lessons.slice(phase.lessonStart, phase.lessonEnd + 1);
  const getPhaseProgress = (phase) => {
    const phaseLessons = getPhaseLessons(phase);
    const completed = phaseLessons.filter((lesson) => progress.getState().completedLessons.includes(lesson.id)).length;
    return {
      completed,
      total: phaseLessons.length,
      percentage: phaseLessons.length ? Math.round((completed / phaseLessons.length) * 100) : 0
    };
  };
  const getNextLesson = () => {
    const state = progress.getState();
    return data.lessons.find((lesson) => !state.completedLessons.includes(lesson.id));
  };

  const codeBlock = (code, filename = "deploy-checklist") => `
    <div class="code-card">
      <div class="code-card-head"><span>${escapeHtml(filename)}</span><i class="bi bi-code-slash"></i></div>
      <pre><code>${escapeHtml(code)}</code></pre>
    </div>
  `;

  const buildPreviewDocument = (title, output) => `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        background: #ffffff;
        color: #102033;
        font-family: Inter, Arial, sans-serif;
        line-height: 1.55;
        margin: 0;
        padding: 18px;
      }
      .output-label {
        color: #0284c7;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .preview-console {
        background: #0f172a;
        border-radius: 12px;
        color: #e0f2fe;
        font-family: "JetBrains Mono", Consolas, monospace;
        font-size: 13px;
        margin: 12px 0 0;
        min-height: 120px;
        padding: 14px;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <div class="output-label">${escapeHtml(title)}</div>
    <pre class="preview-console">${escapeHtml(output)}</pre>
  </body>
</html>`;

  const renderLessonCodePreview = (lesson) => {
    const output = [
      ...(lesson.lineNotes || []),
      "",
      `Cek akhir: ${lesson.checkpoint}`
    ].join("\n");
    return `
      <div class="lesson-code-preview">
        <div class="lesson-preview-label"><i class="bi bi-eye"></i> Output yang harus dicek</div>
        <iframe class="lesson-preview-frame" title="Preview contoh ${escapeHtml(lesson.title)}" loading="lazy" srcdoc="${escapeHtml(buildPreviewDocument("Hasil cek deploy", output))}"></iframe>
      </div>`;
  };

  const renderStarterFlow = () => {
    const target = document.getElementById("starterFlow");
    if (!target) return;
    target.innerHTML = data.starterFlow
      .map(
        (step, index) => `
          <article class="starter-step">
            <span class="starter-number">${String(index + 1).padStart(2, "0")}</span>
            <i class="bi ${step.icon}"></i>
            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.description)}</p>
          </article>`
      )
      .join("");
  };

  const renderPhaseMap = (targetId = "phaseMap") => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const nextLesson = getNextLesson();
    const nextLessonIndex = nextLesson ? data.lessons.findIndex((lesson) => lesson.id === nextLesson.id) : data.lessons.length - 1;

    target.innerHTML = data.learningPhases
      .map((phase, index) => {
        const phaseProgress = getPhaseProgress(phase);
        const firstLesson = getPhaseLessons(phase)[0];
        const isActive = nextLessonIndex >= phase.lessonStart && nextLessonIndex <= phase.lessonEnd;
        const isCompleted = phaseProgress.total > 0 && phaseProgress.completed === phaseProgress.total;

        return `
          <article class="phase-card ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}">
            <div class="phase-card-head">
              <span><i class="bi ${phase.icon}"></i> Fase ${index + 1}</span>
              <strong>${phaseProgress.completed}/${phaseProgress.total}</strong>
            </div>
            <span class="lesson-stage">${escapeHtml(phase.label)}</span>
            <h3>${escapeHtml(phase.title)}</h3>
            <p>${escapeHtml(phase.description)}</p>
            <div class="phase-progress" aria-label="Progress ${escapeHtml(phase.title)}">
              <span style="width: ${phaseProgress.percentage}%"></span>
            </div>
            <small>${escapeHtml(phase.outcome)}</small>
            ${firstLesson ? `<a href="${lessonUrl(firstLesson)}">Buka fase ini <i class="bi bi-arrow-right"></i></a>` : ""}
          </article>`;
      })
      .join("");
  };

  const renderHomeDemo = (demoId = data.homeDemos[0]?.id) => {
    const tabs = document.getElementById("homeDemoTabs");
    const code = document.getElementById("homeDemoCode");
    const preview = document.getElementById("homeDemoPreview");
    const explain = document.getElementById("homeDemoExplain");
    const task = document.getElementById("homeDemoTask");
    if (!tabs || !code || !preview || !explain || !task) return;

    const demo = data.homeDemos.find((item) => item.id === demoId) || data.homeDemos[0];
    tabs.innerHTML = data.homeDemos
      .map(
        (item) => `
          <button class="demo-tab ${item.id === demo.id ? "active" : ""}" type="button" data-home-demo="${item.id}">
            ${escapeHtml(item.label)}
          </button>`
      )
      .join("");
    code.innerHTML = codeBlock(demo.code, demo.filename);
    preview.srcdoc = buildPreviewDocument("Output yang muncul", demo.output);
    explain.innerHTML = `<strong>${escapeHtml(demo.title)}</strong><p>${escapeHtml(demo.explanation)}</p>`;
    task.innerHTML = `<i class="bi bi-pencil-square"></i><span>${escapeHtml(demo.task)}</span>`;
  };

  const renderHomeDashboard = () => {
    const continueLink = document.getElementById("homeContinueLink");
    const nextLessonTitle = document.getElementById("homeNextLessonTitle");
    const nextLessonMeta = document.getElementById("homeNextLessonMeta");
    const progressPercent = document.getElementById("homeProgressPercent");
    const progressBar = document.getElementById("homeProgressBar");
    const completedCount = document.getElementById("homeCompletedCount");
    const currentPhase = document.getElementById("homeCurrentPhase");
    if (!continueLink && !nextLessonTitle && !nextLessonMeta && !progressPercent && !progressBar && !completedCount && !currentPhase) return;

    const state = progress.getState();
    const nextLesson = getNextLesson();
    const completed = state.completedLessons.length;
    const lessonPercentage = data.lessons.length ? Math.round((completed / data.lessons.length) * 100) : 0;
    const nextIndex = nextLesson ? data.lessons.findIndex((lesson) => lesson.id === nextLesson.id) : data.lessons.length - 1;
    const phase = nextIndex >= 0 ? getLessonPhase(nextIndex) : data.learningPhases[0];

    if (continueLink) {
      continueLink.href = nextLesson ? lessonUrl(nextLesson) : `${basePath()}progress.html`;
      continueLink.innerHTML = nextLesson ? 'Mulai sesi sekarang <i class="bi bi-arrow-right"></i>' : 'Lihat progress akhir <i class="bi bi-arrow-right"></i>';
    }
    if (nextLessonTitle) nextLessonTitle.textContent = nextLesson ? nextLesson.title : "Semua materi utama selesai";
    if (nextLessonMeta) nextLessonMeta.textContent = nextLesson ? `${phase.title} - ${nextLesson.duration}` : "Lanjutkan quiz, debugging, dan mini project";
    if (progressPercent) progressPercent.textContent = `${lessonPercentage}%`;
    if (progressBar) progressBar.style.width = `${lessonPercentage}%`;
    if (completedCount) completedCount.textContent = `${completed}/${data.lessons.length}`;
    if (currentPhase) currentPhase.textContent = phase.title;
  };

  const renderLessonNavigation = (lessonIndex, position = "top") => {
    const previousLesson = data.lessons[lessonIndex - 1];
    const nextLesson = data.lessons[lessonIndex + 1];
    if (!previousLesson && !nextLesson) return "";

    return `
      <nav class="lesson-nav lesson-nav-${position}" aria-label="Navigasi materi">
        ${
          previousLesson
            ? `<a class="lesson-nav-link" href="${lessonUrl(previousLesson)}">
                <i class="bi bi-arrow-left"></i>
                <span><small>Materi sebelumnya</small>${escapeHtml(previousLesson.title)}</span>
              </a>`
            : '<span class="lesson-nav-empty"></span>'
        }
        ${
          nextLesson
            ? `<a class="lesson-nav-link lesson-nav-next" href="${lessonUrl(nextLesson)}">
                <span><small>Materi berikutnya</small>${escapeHtml(nextLesson.title)}</span>
                <i class="bi bi-arrow-right"></i>
              </a>`
            : `<a class="lesson-nav-link lesson-nav-next" href="${basePath()}progress.html">
                <span><small>Setelah materi terakhir</small>Lihat progress belajar</span>
                <i class="bi bi-arrow-right"></i>
              </a>`
        }
      </nav>`;
  };

  const renderLessonLearningLoop = (lesson) => `
    <div class="detail-block learning-loop-block">
      <h3><i class="bi bi-signpost-2"></i> Cara belajar materi ini</h3>
      <div class="learning-loop-grid">
        <article><span>01</span><h4>Pahami masalahnya</h4><p>${escapeHtml(lesson.problem)}</p></article>
        <article><span>02</span><h4>Lihat checklist dan hasil</h4><p>Perhatikan folder, database, user, file konfigurasi, dan hasil cek apa yang harus muncul.</p></article>
        <article><span>03</span><h4>Ubah satu nilai</h4><p>${escapeHtml(lesson.exercise)}</p></article>
        <article><span>04</span><h4>Cek dengan bahasa sendiri</h4><p>${escapeHtml(lesson.checkpoint)}</p></article>
      </div>
    </div>`;

  const renderLessonCodeBridge = (lesson) => `
    <div class="code-bridge-grid">
      <div>
        <div class="bridge-label">Checklist atau konfigurasi</div>
        ${codeBlock(lesson.code, lesson.filename)}
      </div>
      <div>
        <div class="bridge-label">Output yang kamu cek</div>
        ${renderLessonCodePreview(lesson)}
      </div>
    </div>`;

  const activeLessonId = () => document.body.dataset.lessonId || data.lessons[0]?.id;

  const renderLessonGrid = (activeId = activeLessonId()) => {
    const grid = document.getElementById("lessonGrid");
    const count = document.getElementById("lessonDoneCount");
    if (!grid) return;

    const state = progress.getState();
    if (count) count.textContent = `${state.completedLessons.length}/${data.lessons.length}`;

    grid.innerHTML = data.lessons
      .map((lesson, index) => {
        const done = state.completedLessons.includes(lesson.id);
        const phase = getLessonPhase(index);
        return `
          <a class="lesson-card ${done ? "completed" : ""} ${lesson.id === activeId ? "active" : ""}" href="${lessonUrl(lesson)}" data-lesson-id="${lesson.id}">
            ${done ? '<i class="bi bi-check-circle-fill complete-mark"></i>' : ""}
            <span class="lesson-stage">${escapeHtml(phase.title)}</span>
            <span class="lesson-icon"><i class="bi ${lesson.icon}"></i></span>
            <div class="lesson-number">Materi ${String(index + 1).padStart(2, "0")}</div>
            <h3>${escapeHtml(lesson.title)}</h3>
            <p class="lesson-card-summary">${escapeHtml(lesson.overview || lesson.goal)}</p>
            <div class="lesson-card-footer">
              <span><i class="bi bi-clock"></i> ${escapeHtml(lesson.duration)}</span>
              <span>Belajar <i class="bi bi-arrow-right"></i></span>
            </div>
          </a>
        `;
      })
      .join("");
  };

  const renderLessonDetail = (lessonId = activeLessonId()) => {
    const target = document.getElementById("lessonDetail");
    if (!target) return;

    const lesson = data.lessons.find((item) => item.id === lessonId) || data.lessons[0];
    const state = progress.getState();
    const index = data.lessons.findIndex((item) => item.id === lesson.id);
    const phase = getLessonPhase(index);
    const completed = state.completedLessons.includes(lesson.id);
    const materiUrl = `${basePath()}materi.html`;

    target.innerHTML = `
      <div class="lesson-detail-head" id="${lesson.id}">
        <span class="eyebrow"><i class="bi ${lesson.icon}"></i> Materi ${String(index + 1).padStart(2, "0")} - ${escapeHtml(phase.title)} - ${escapeHtml(lesson.duration)}</span>
        <h2>${escapeHtml(lesson.title)}</h2>
        <p class="mb-0">${escapeHtml(lesson.goal)}</p>
      </div>
      <div class="lesson-detail-body">
        ${renderLessonNavigation(index, "top")}
        <div class="detail-block">
          <h3><i class="bi bi-compass"></i> Mulai dari sini</h3>
          <p><strong>Prasyarat:</strong> ${escapeHtml(lesson.prerequisite)}</p>
          <p><strong>Masalah:</strong> ${escapeHtml(lesson.problem)}</p>
          <div class="analogy-box">${escapeHtml(lesson.analogy)}</div>
        </div>
        ${renderLessonLearningLoop(lesson)}
        <div class="detail-block">
          <h3><i class="bi bi-lightbulb"></i> Penjelasan</h3>
          <div class="explanation-box">${escapeHtml(lesson.explanation)}</div>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-terminal"></i> Contoh</h3>
          ${renderLessonCodeBridge(lesson)}
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-list-check"></i> Yang harus kamu cek</h3>
          <div class="line-notes">
            ${lesson.lineNotes.map((note) => `<div><i class="bi bi-arrow-right-circle"></i><span>${escapeHtml(note)}</span></div>`).join("")}
          </div>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-list-ol"></i> Langkah belajar</h3>
          <ol class="beginner-steps">${lesson.steps.map((step) => `<li><span>${escapeHtml(step)}</span></li>`).join("")}</ol>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-card-text"></i> Istilah penting</h3>
          <div class="term-grid">
            ${lesson.terms.map((item) => `<div class="term-card"><strong>${escapeHtml(item.term)}</strong><p>${escapeHtml(item.meaning)}</p></div>`).join("")}
          </div>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-exclamation-circle"></i> Kesalahan umum</h3>
          <ul>${lesson.commonMistakes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-pencil-square"></i> Latihan kecil</h3>
          <div class="practice-box">${escapeHtml(lesson.exercise)}</div>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-bug"></i> Baca bug</h3>
          <p><strong>Pertanyaan:</strong> ${escapeHtml(lesson.debug.question)}</p>
          <div class="hint-box"><strong>Hint:</strong> ${escapeHtml(lesson.debug.hint)}</div>
          <p class="mt-2 mb-0"><strong>Solusi:</strong> ${escapeHtml(lesson.debug.solution)}</p>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-patch-question"></i> Mini quiz</h3>
          <p><strong>${escapeHtml(lesson.quiz.question)}</strong></p>
          <ul>${lesson.quiz.options.map((option, optionIndex) => `<li>${escapeHtml(option)}${optionIndex === lesson.quiz.answer ? " - jawaban benar" : ""}</li>`).join("")}</ul>
          <div class="checkpoint-box">${escapeHtml(lesson.quiz.explanation)}</div>
        </div>
        <div class="detail-block">
          <h3><i class="bi bi-arrow-repeat"></i> Recall</h3>
          <p>${escapeHtml(lesson.recall)}</p>
          <div class="checkpoint-box">${escapeHtml(lesson.checkpoint)}</div>
        </div>
        <div class="lesson-actions">
          <a class="btn btn-soft" href="${materiUrl}"><i class="bi bi-grid"></i> Daftar materi</a>
          <button class="btn btn-primary" type="button" data-complete-lesson="${lesson.id}">
            <i class="bi ${completed ? "bi-check-circle-fill" : "bi-check2-circle"}"></i> ${completed ? "Sudah selesai" : "Tandai selesai"}
          </button>
        </div>
        ${renderLessonNavigation(index, "bottom")}
      </div>
    `;

    target.querySelector("[data-complete-lesson]")?.addEventListener("click", (event) => {
      progress.markLesson(event.currentTarget.dataset.completeLesson);
      toast("Materi ditandai selesai.");
      renderLessonGrid(lesson.id);
      renderHomeDashboard();
      renderPhaseMap("phaseMap");
      renderPhaseMap("homePhaseMap");
      renderLessonDetail(lesson.id);
    });
  };

  const renderLessonsPage = () => {
    renderLessonGrid();
    renderPhaseMap("phaseMap");
  };

  const renderLessonPage = () => {
    const lessonId = activeLessonId();
    const lesson = data.lessons.find((item) => item.id === lessonId) || data.lessons[0];
    const index = data.lessons.findIndex((item) => item.id === lesson.id);
    const phase = getLessonPhase(index);
    const hero = document.getElementById("lessonPageHero");

    if (hero) {
      hero.innerHTML = `
        <a class="eyebrow" href="${basePath()}materi.html"><i class="bi bi-journal-code"></i> Materi ${String(index + 1).padStart(2, "0")} dari ${data.lessons.length} - ${escapeHtml(phase.title)}</a>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p>${escapeHtml(lesson.goal)}</p>
      `;
    }

    renderLessonDetail(lesson.id);
  };

  const renderQuizPage = () => {
    const target = document.getElementById("quizApp");
    if (!target) return;
    let current = 0;
    let score = 0;
    let answered = false;

    const renderQuestion = () => {
      const question = data.quizQuestions[current];
      const state = progress.getState();

      target.innerHTML = `
        <div class="quiz-head">
          <div class="quiz-progress-row">
            <span class="eyebrow"><i class="bi bi-patch-question"></i> Pertanyaan ${current + 1}/${data.quizQuestions.length}</span>
            <span class="status-pill">Skor terbaik ${state.quizBest}/${data.quizQuestions.length}</span>
          </div>
          <div class="progress app-progress mt-3" role="progressbar" aria-label="Progress quiz">
            <div class="progress-bar" style="width: ${Math.round((current / data.quizQuestions.length) * 100)}%"></div>
          </div>
        </div>
        <div class="quiz-body">
          <h2>${escapeHtml(question.question)}</h2>
          <div class="quiz-options">
            ${question.options.map((option, index) => `<button class="quiz-option" type="button" data-option="${index}"><i class="bi bi-circle"></i><span>${escapeHtml(option)}</span></button>`).join("")}
          </div>
          <div id="quizFeedback"></div>
        </div>
      `;

      target.querySelectorAll("[data-option]").forEach((button) => {
        button.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const selected = Number(button.dataset.option);
          const correct = selected === question.answer;
          if (correct) score += 1;

          target.querySelectorAll("[data-option]").forEach((optionButton) => {
            const optionIndex = Number(optionButton.dataset.option);
            optionButton.classList.toggle("correct", optionIndex === question.answer);
            optionButton.classList.toggle("wrong", optionIndex === selected && !correct);
            optionButton.querySelector("i").className = `bi ${optionIndex === question.answer ? "bi-check-circle-fill" : optionIndex === selected ? "bi-x-circle-fill" : "bi-circle"}`;
          });

          document.getElementById("quizFeedback").innerHTML = `
            <div class="feedback-box">
              <strong>${correct ? "Benar." : "Belum tepat."}</strong>
              <p class="mb-3">${escapeHtml(question.explanation)}</p>
              <button class="btn btn-primary" type="button" id="nextQuiz">${current + 1 === data.quizQuestions.length ? "Lihat hasil" : "Pertanyaan berikutnya"} <i class="bi bi-arrow-right"></i></button>
            </div>
          `;

          document.getElementById("nextQuiz").addEventListener("click", () => {
            current += 1;
            answered = false;
            if (current >= data.quizQuestions.length) {
              progress.saveQuizBest(score);
              renderResult();
              return;
            }
            renderQuestion();
          });
        });
      });
    };

    const renderResult = () => {
      const percent = Math.round((score / data.quizQuestions.length) * 100);
      target.innerHTML = `
        <div class="quiz-head">
          <span class="eyebrow"><i class="bi bi-trophy"></i> Hasil quiz</span>
          <h2 class="mt-2 mb-0">Skor kamu ${score}/${data.quizQuestions.length}</h2>
        </div>
        <div class="quiz-body">
          <div class="progress-value"><strong>${percent}%</strong><span>pemahaman dasar</span></div>
          <div class="progress app-progress mb-3"><div class="progress-bar" style="width: ${percent}%"></div></div>
          <p>${percent >= 80 ? "Fondasinya sudah kuat. Lanjutkan ke debugging dan project." : "Ulangi materi yang masih terasa kabur, lalu coba quiz lagi."}</p>
          <div class="lesson-actions">
            <button class="btn btn-primary" type="button" id="repeatQuiz"><i class="bi bi-arrow-repeat"></i> Ulangi quiz</button>
            <a class="btn btn-soft" href="debugging.html">Latihan debugging <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
      `;
      toast("Skor quiz tersimpan.");
      document.getElementById("repeatQuiz").addEventListener("click", () => {
        current = 0;
        score = 0;
        answered = false;
        renderQuestion();
      });
    };

    renderQuestion();
  };

  const renderChallengeList = (items, completedIds, activeId, targetId, icon) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = items
      .map(
        (item, index) => `
          <button type="button" class="challenge-list-btn ${item.id === activeId ? "active" : ""} ${completedIds.includes(item.id) ? "done" : ""}" data-challenge-id="${item.id}">
            <i class="bi ${completedIds.includes(item.id) ? "bi-check-circle-fill" : icon}"></i>
            <span>${index + 1}. ${escapeHtml(item.title)}</span>
          </button>
        `
      )
      .join("");
  };

  const renderDebugPage = () => {
    const active = data.debugChallenges[0]?.id;
    const render = (id = active) => {
      const state = progress.getState();
      const item = data.debugChallenges.find((debug) => debug.id === id) || data.debugChallenges[0];
      renderChallengeList(data.debugChallenges, state.completedDebug, item.id, "debugList", "bi-bug");
      const target = document.getElementById("debugDetail");
      target.innerHTML = `
        <div class="challenge-head">
          <span class="eyebrow"><i class="bi bi-bug"></i> Debugging</span>
          <h2 class="mt-2 mb-1">${escapeHtml(item.title)}</h2>
          <p class="mb-0">${escapeHtml(item.symptom)}</p>
        </div>
        <div class="challenge-body">
          <p><strong>${escapeHtml(item.question)}</strong></p>
          <pre class="debug-code-input">${escapeHtml(item.code)}</pre>
          <div class="lesson-actions">
            <button class="btn btn-soft" type="button" id="showHint"><i class="bi bi-lightbulb"></i> Lihat hint</button>
            <button class="btn btn-primary" type="button" id="showSolution"><i class="bi bi-check2-circle"></i> Lihat solusi</button>
            <button class="btn btn-soft" type="button" id="markDebug"><i class="bi bi-check-circle"></i> Tandai paham</button>
          </div>
          <div id="debugOutput"></div>
        </div>
      `;
      document.querySelectorAll("#debugList [data-challenge-id]").forEach((button) => button.addEventListener("click", () => render(button.dataset.challengeId)));
      document.getElementById("showHint").addEventListener("click", () => {
        document.getElementById("debugOutput").innerHTML = `<div class="feedback-box"><strong>Hint:</strong> ${escapeHtml(item.hint)}</div>`;
      });
      document.getElementById("showSolution").addEventListener("click", () => {
        document.getElementById("debugOutput").innerHTML = `
          <div class="solution-box">
            <strong>Alur membaca error:</strong>
            <ol>${item.explanation.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
            ${codeBlock(item.solution, "solusi")}
          </div>`;
      });
      document.getElementById("markDebug").addEventListener("click", () => {
        progress.markDebug(item.id);
        toast("Debugging ditandai paham.");
        render(item.id);
      });
    };
    render(active);
  };

  const renderRecallPage = () => {
    const active = data.recallChallenges[0]?.id;
    const render = (id = active) => {
      const state = progress.getState();
      const item = data.recallChallenges.find((recall) => recall.id === id) || data.recallChallenges[0];
      renderChallengeList(data.recallChallenges, state.completedRecall, item.id, "recallList", "bi-arrow-repeat");
      const target = document.getElementById("recallDetail");
      target.innerHTML = `
        <div class="challenge-head">
          <span class="eyebrow"><i class="bi bi-arrow-repeat"></i> ${escapeHtml(item.type)}</span>
          <h2 class="mt-2 mb-1">${escapeHtml(item.title)}</h2>
          <p class="mb-0">${escapeHtml(item.prompt)}</p>
        </div>
        <div class="challenge-body">
          <textarea class="code-input" id="recallAnswer" placeholder="Tulis jawabanmu dulu sebelum membuka jawaban." style="min-height: 180px"></textarea>
          <div class="lesson-actions mt-3">
            <button class="btn btn-primary" type="button" id="showRecall"><i class="bi bi-eye"></i> Buka jawaban</button>
            <button class="btn btn-soft" type="button" id="markRecall"><i class="bi bi-check-circle"></i> Saya ingat</button>
          </div>
          <div id="recallOutput"></div>
        </div>
      `;
      document.querySelectorAll("#recallList [data-challenge-id]").forEach((button) => button.addEventListener("click", () => render(button.dataset.challengeId)));
      document.getElementById("showRecall").addEventListener("click", () => {
        document.getElementById("recallOutput").innerHTML = `<div class="solution-box"><strong>Jawaban acuan:</strong><p class="mb-0">${escapeHtml(item.answer)}</p></div>`;
      });
      document.getElementById("markRecall").addEventListener("click", () => {
        progress.markRecall(item.id);
        toast("Recall tersimpan.");
        render(item.id);
      });
    };
    render(active);
  };

  const renderProjectPreview = (example) => `
    <div class="mini-window">
      <small>${escapeHtml(example.subtitle)}</small>
      <strong>${escapeHtml(example.title)}</strong>
      <div class="mini-line"><span style="width: ${example.progress}%"></span></div>
      <div class="chip-row">${example.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
  `;

  const renderProjectsPage = () => {
    const target = document.getElementById("projectGrid");
    if (!target) return;
    const state = progress.getState();
    target.innerHTML = data.projects
      .map((project) => {
        const done = state.completedProjects.includes(project.id);
        return `
          <article class="project-card">
            <div class="project-top">
              <span class="project-icon"><i class="bi ${project.icon}"></i></span>
              <div>
                <span class="eyebrow">${escapeHtml(project.level)}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.goal)}</p>
              </div>
            </div>
            <div class="mini-preview">${renderProjectPreview(project.example)}</div>
            <div class="chip-row">${project.features.map((feature) => `<span class="chip">${escapeHtml(feature)}</span>`).join("")}</div>
            <div class="project-meta">
              <strong>Langkah:</strong>
              <ol class="mb-2">${project.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
              <span>${escapeHtml(project.hint)}</span>
            </div>
            <button class="btn ${done ? "btn-soft" : "btn-primary"} w-100 mt-3" type="button" data-project-done="${project.id}">
              <i class="bi ${done ? "bi-check-circle-fill" : "bi-check2-circle"}"></i> ${done ? "Project selesai" : "Tandai selesai"}
            </button>
          </article>
        `;
      })
      .join("");

    target.querySelectorAll("[data-project-done]").forEach((button) => {
      button.addEventListener("click", () => {
        progress.markProject(button.dataset.projectDone);
        toast("Project ditandai selesai.");
        renderProjectsPage();
      });
    });
  };

  const renderProgressPage = () => {
    const target = document.getElementById("progressDashboard");
    if (!target) return;
    const stats = progress.calculateProgress(data);
    const badges = progress.getBadges(data);
    const recommendation = progress.getRecommendation(data);

    target.innerHTML = `
      <div class="progress-overview">
        <span class="mini-label">Progress total</span>
        <div class="progress-value"><strong>${stats.percent}%</strong><span>selesai</span></div>
        <div class="progress app-progress mb-3"><div class="progress-bar" style="width: ${stats.percent}%"></div></div>
        <p class="recommendation mb-0"><strong>${escapeHtml(recommendation.label)}:</strong> <a href="${recommendation.url}">${escapeHtml(recommendation.text)}</a></p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><i class="bi bi-journal-code"></i><strong>${stats.lessonsDone}/${stats.totalLessons}</strong><span>materi</span></div>
        <div class="stat-card"><i class="bi bi-patch-question"></i><strong>${stats.quizBest}/${stats.totalQuiz}</strong><span>skor quiz</span></div>
        <div class="stat-card"><i class="bi bi-bug"></i><strong>${stats.debugDone}/${stats.totalDebug}</strong><span>debugging</span></div>
        <div class="stat-card"><i class="bi bi-rocket-takeoff"></i><strong>${stats.projectDone}/${stats.totalProjects}</strong><span>project</span></div>
      </div>
      <div class="badge-panel">
        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-award badge-panel-icon"></i>
          <div>
            <span class="mini-label">Badge</span>
            <h3>Badge yang terbuka</h3>
          </div>
        </div>
        <div class="badge-grid">
          ${badges.map((badge) => `<div class="badge-item ${badge.unlocked ? "" : "locked"}"><i class="bi ${badge.icon}"></i><span>${escapeHtml(badge.title)}</span></div>`).join("")}
        </div>
      </div>
      <div class="lesson-actions">
        <a class="btn btn-primary" href="${basePath()}materi.html"><i class="bi bi-arrow-right"></i> Lanjut materi</a>
        <button class="btn btn-soft" type="button" id="resetProgress"><i class="bi bi-trash3"></i> Reset progress</button>
      </div>
    `;

    document.getElementById("resetProgress").addEventListener("click", () => {
      if (confirm("Reset semua progress belajar di browser ini?")) {
        progress.reset();
        toast("Progress direset.");
        renderProgressPage();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === "home") {
      renderStarterFlow();
      renderPhaseMap("homePhaseMap");
      renderHomeDemo();
      renderHomeDashboard();
    }
    if (page === "materi") renderLessonsPage();
    if (page === "lesson") renderLessonPage();
    if (page === "quiz") renderQuizPage();
    if (page === "debugging") renderDebugPage();
    if (page === "recall") renderRecallPage();
    if (page === "projects") renderProjectsPage();
    if (page === "progress") renderProgressPage();

    document.addEventListener("click", (event) => {
      const demoButton = event.target.closest("[data-home-demo]");
      if (!demoButton) return;
      renderHomeDemo(demoButton.dataset.homeDemo);
    });
  });
})();
