window.DeployLabProgress = (() => {
  const key = "deploy-project-lab-progress-v1";

  const defaults = {
    completedLessons: [],
    completedDebug: [],
    completedRecall: [],
    completedProjects: [],
    quizBest: 0,
    darkMode: false,
    lastUpdated: null
  };

  const normalize = (value) => (Array.isArray(value) ? [...new Set(value)] : []);

  const getState = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "{}");
      return {
        ...defaults,
        ...stored,
        completedLessons: normalize(stored.completedLessons),
        completedDebug: normalize(stored.completedDebug),
        completedRecall: normalize(stored.completedRecall),
        completedProjects: normalize(stored.completedProjects),
        quizBest: Number(stored.quizBest || 0),
        darkMode: Boolean(stored.darkMode)
      };
    } catch (error) {
      return { ...defaults };
    }
  };

  const saveState = (state) => {
    const nextState = { ...state, lastUpdated: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(nextState));
    window.dispatchEvent(new CustomEvent("deploy-progress-updated", { detail: nextState }));
    return nextState;
  };

  const addUnique = (list, id) => (list.includes(id) ? list : [...list, id]);

  const markLesson = (id) => {
    const state = getState();
    return saveState({ ...state, completedLessons: addUnique(state.completedLessons, id) });
  };

  const markDebug = (id) => {
    const state = getState();
    return saveState({ ...state, completedDebug: addUnique(state.completedDebug, id) });
  };

  const markRecall = (id) => {
    const state = getState();
    return saveState({ ...state, completedRecall: addUnique(state.completedRecall, id) });
  };

  const markProject = (id) => {
    const state = getState();
    return saveState({ ...state, completedProjects: addUnique(state.completedProjects, id) });
  };

  const saveQuizBest = (score) => {
    const state = getState();
    return saveState({ ...state, quizBest: Math.max(state.quizBest, score) });
  };

  const setDarkMode = (value) => {
    const state = getState();
    const next = saveState({ ...state, darkMode: Boolean(value) });
    applyTheme();
    return next;
  };

  const reset = () => {
    localStorage.removeItem(key);
    applyTheme();
    window.dispatchEvent(new CustomEvent("deploy-progress-updated", { detail: getState() }));
  };

  const applyTheme = () => {
    const state = getState();
    document.body.classList.toggle("dark-mode", state.darkMode);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.innerHTML = state.darkMode ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
      toggle.setAttribute("aria-label", state.darkMode ? "Gunakan mode terang" : "Gunakan mode gelap");
      toggle.setAttribute("title", state.darkMode ? "Mode terang" : "Mode gelap");
    }
  };

  const calculateProgress = (data = window.DeployLabData) => {
    const state = getState();
    const quizWeight = data.quizQuestions.length ? state.quizBest / data.quizQuestions.length : 0;
    const done =
      state.completedLessons.length +
      state.completedDebug.length +
      state.completedRecall.length +
      state.completedProjects.length +
      quizWeight;
    const total =
      data.lessons.length +
      data.debugChallenges.length +
      data.recallChallenges.length +
      data.projects.length +
      1;
    const percent = total ? Math.round((done / total) * 100) : 0;

    return {
      percent: Math.min(100, percent),
      lessonsDone: state.completedLessons.length,
      debugDone: state.completedDebug.length,
      recallDone: state.completedRecall.length,
      projectDone: state.completedProjects.length,
      quizBest: state.quizBest,
      totalLessons: data.lessons.length,
      totalDebug: data.debugChallenges.length,
      totalRecall: data.recallChallenges.length,
      totalProjects: data.projects.length,
      totalQuiz: data.quizQuestions.length
    };
  };

  const getBadges = (data = window.DeployLabData) => {
    const state = getState();
    return data.badges.map((badge) => ({ ...badge, unlocked: badge.check(state) }));
  };

  const getRecommendation = (data = window.DeployLabData) => {
    const state = getState();
    const lesson = data.lessons.find((item) => !state.completedLessons.includes(item.id));
    if (lesson) {
      return { label: "Lanjutkan materi", text: lesson.title, url: `materi/${lesson.id}.html` };
    }
    if (state.quizBest < data.quizQuestions.length) {
      return { label: "Perkuat konsep", text: "Kerjakan quiz sampai benar semua", url: "quiz.html" };
    }
    const debug = data.debugChallenges.find((item) => !state.completedDebug.includes(item.id));
    if (debug) {
      return { label: "Latihan debugging", text: debug.title, url: "debugging.html" };
    }
    const project = data.projects.find((item) => !state.completedProjects.includes(item.id));
    if (project) {
      return { label: "Bangun portfolio", text: project.title, url: "projects.html" };
    }
    return { label: "Selesai", text: "Semua aktivitas utama sudah selesai", url: "progress.html" };
  };

  return {
    getState,
    saveState,
    markLesson,
    markDebug,
    markRecall,
    markProject,
    saveQuizBest,
    setDarkMode,
    reset,
    applyTheme,
    calculateProgress,
    getBadges,
    getRecommendation
  };
})();
