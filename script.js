
/* =====================================
   STUDYSYNC - JAVASCRIPT
   Tasks, Progress, Dark Mode & Focus Timer
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ===== 1. SELECT HTML ELEMENTS =====

    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const progressPercent = document.getElementById("progressPercent");

    const heroProgress = document.getElementById("heroProgress");
    const heroProgressBar = document.getElementById("heroProgressBar");
    const heroCompleted = document.getElementById("heroCompleted");
    const heroRemaining = document.getElementById("heroRemaining");
    const heroMessage = document.getElementById("heroMessage");

    const taskProgressText = document.getElementById("taskProgressText");
    const taskProgressBar = document.getElementById("taskProgressBar");

    const solvedInput = document.getElementById("solvedInput");
    const updateSolved = document.getElementById("updateSolved");
    const solvedCount = document.getElementById("solvedCount");
    const codingSolvedDisplay = document.getElementById("codingSolvedDisplay");

    const themeToggle = document.getElementById("themeToggle");

    const greeting = document.getElementById("greeting");
    const currentDate = document.getElementById("currentDate");

    const timerDisplay = document.getElementById("timerDisplay");
    const timerStatus = document.getElementById("timerStatus");
    const focusMode = document.getElementById("focusMode");
    const startTimer = document.getElementById("startTimer");
    const resetTimer = document.getElementById("resetTimer");


    // ===== 2. SAFE LOCAL STORAGE HELPERS =====

    function loadData(key, fallback) {
        try {
            const saved = localStorage.getItem(key);

            if (saved === null) {
                return fallback;
            }

            return JSON.parse(saved);
        } catch (error) {
            return fallback;
        }
    }

    function saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("Could not save data in this browser.");
        }
    }


    // ===== 3. DATE AND GREETING =====

    function updateDate() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) {
            greeting.textContent = "Good morning! ☀️";
        } else if (hour < 17) {
            greeting.textContent = "Good afternoon! 👋";
        } else {
            greeting.textContent = "Good evening! 🌙";
        }

        currentDate.textContent = now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    updateDate();


    // ===== 4. DAILY TASKS =====

    const defaultTasks = [
        {
            id: "python",
            title: "Practice Python",
            detail: "Programming · 30 min",
            tag: "Learning",
            done: false
        },
        {
            id: "dsa",
            title: "Solve DSA problems",
            detail: "C++ · 45 min",
            tag: "Important",
            done: false
        },
        {
            id: "css",
            title: "Learn Web Development",
            detail: "HTML / CSS / JavaScript · 30 min",
            tag: "Practice",
            done: false
        }
    ];

    let tasks = loadData("studysyncTasks", null);

    if (!Array.isArray(tasks)) {
        tasks = defaultTasks.map(function (task) {
            return { ...task };
        });
    }

    function saveTasks() {
        saveData("studysyncTasks", tasks);
    }

    function renderTasks() {
        taskList.innerHTML = "";

        if (tasks.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "section-note";
            emptyMessage.textContent = "No tasks yet. Add your first task above!";
            taskList.appendChild(emptyMessage);
        }

        tasks.forEach(function (task) {
            const label = document.createElement("label");
            label.className = "task-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = Boolean(task.done);
            checkbox.setAttribute("aria-label", "Complete " + task.title);

            const customCheckbox = document.createElement("span");
            customCheckbox.className = "custom-checkbox";

            const details = document.createElement("span");
            details.className = "task-details";

            const title = document.createElement("strong");
            title.textContent = task.title;

            const description = document.createElement("small");
            description.textContent = task.detail || "Personal task";

            details.appendChild(title);
            details.appendChild(description);

            label.appendChild(checkbox);
            label.appendChild(customCheckbox);
            label.appendChild(details);

            if (task.tag) {
                const tag = document.createElement("span");
                tag.className = "task-tag tag-purple";
                tag.textContent = task.tag;
                label.appendChild(tag);
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("aria-label", "Delete " + task.title);

            // Prevent the label from toggling when Delete is clicked.
            deleteButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                tasks = tasks.filter(function (item) {
                    return item.id !== task.id;
                });

                saveTasks();
                renderTasks();
                updateProgress();
            });

            checkbox.addEventListener("change", function () {
                task.done = checkbox.checked;
                saveTasks();
                updateProgress();
            });

            label.appendChild(deleteButton);
            taskList.appendChild(label);
        });

        updateProgress();
    }


    // Add a new task.
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = taskInput.value.trim();

        if (title === "") {
            taskInput.focus();
            return;
        }

        const newTask = {
            id: "task-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
            title: title,
            detail: "Personal task",
            tag: "New",
            done: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        taskInput.value = "";
        taskInput.focus();
    });


    // Update every progress display.
    function updateProgress() {
        const total = tasks.length;

        const completed = tasks.filter(function (task) {
            return task.done;
        }).length;

        const remaining = total - completed;

        const percent = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        totalTasks.textContent = total;
        completedTasks.textContent = completed;
        progressPercent.textContent = percent + "%";

        heroProgress.textContent = percent + "%";
        heroProgressBar.style.width = percent + "%";
        heroCompleted.textContent = completed;
        heroRemaining.textContent = remaining;

        taskProgressText.textContent =
            completed + " of " + total + " tasks";

        taskProgressBar.style.width = percent + "%";

        if (total === 0) {
            heroMessage.textContent = "Add a task and start your journey!";
        } else if (percent === 100) {
            heroMessage.textContent = "Amazing! You completed every task! 🎉";
        } else if (percent >= 50) {
            heroMessage.textContent = "Great progress! Keep it going! 💪";
        } else {
            heroMessage.textContent = "Every small step counts. Let's begin!";
        }
    }

    renderTasks();


    // ===== 5. CODING PROGRESS TRACKER =====

    let savedSolved = loadData("solvedQuestions", 0);

    if (
        typeof savedSolved !== "number" ||
        !Number.isFinite(savedSolved) ||
        savedSolved < 0
    ) {
        savedSolved = 0;
    }

    savedSolved = Math.min(100000, Math.floor(savedSolved));

    function displaySolved() {
        solvedCount.textContent = savedSolved;
        codingSolvedDisplay.textContent = savedSolved;
        solvedInput.value = savedSolved;
    }

    displaySolved();

    updateSolved.addEventListener("click", function () {
        const value = solvedInput.value.trim();

        if (value === "") {
            solvedInput.focus();
            return;
        }

        const number = Number(value);

        if (
            !Number.isInteger(number) ||
            number < 0 ||
            number > 100000
        ) {
            alert("Please enter a whole number between 0 and 100000.");
            return;
        }

        savedSolved = number;

        saveData("solvedQuestions", savedSolved);
        displaySolved();
    });


    // ===== 6. DARK MODE =====

    let darkMode = loadData("studysyncDarkMode", false);

    function applyTheme() {
        document.body.classList.toggle("dark-mode", darkMode);

        themeToggle.textContent = darkMode ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            darkMode ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    applyTheme();

    themeToggle.addEventListener("click", function () {
        darkMode = !darkMode;

        saveData("studysyncDarkMode", darkMode);
        applyTheme();
    });


    // ===== 7. POMODORO FOCUS TIMER =====

    let remainingSeconds = Number(focusMode.value) * 60;
    let timerInterval = null;
    let timerRunning = false;

    function displayTimer() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");
    }

    function setTimerStatus(message) {
        timerStatus.textContent = message;
    }

    function stopTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        timerRunning = false;
        startTimer.textContent = "▶ Start";
    }

    function finishTimer() {
        stopTimer();

        remainingSeconds = 0;
        displayTimer();
        setTimerStatus("SESSION COMPLETE!");

        startTimer.textContent = "↻ Restart";

        alert("Focus session complete! Great work. 🎉");
    }

    function tickTimer() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            displayTimer();

            if (remainingSeconds === 0) {
                finishTimer();
            }
        }
    }

    startTimer.addEventListener("click", function () {
        if (timerRunning) {
            stopTimer();
            setTimerStatus("PAUSED");
            return;
        }

        if (remainingSeconds === 0) {
            remainingSeconds = Number(focusMode.value) * 60;
        }

        timerRunning = true;
        startTimer.textContent = "Ⅱ Pause";
        setTimerStatus("FOCUS IN PROGRESS");

        timerInterval = setInterval(tickTimer, 1000);
    });

    resetTimer.addEventListener("click", function () {
        stopTimer();

        remainingSeconds = Number(focusMode.value) * 60;

        displayTimer();
        setTimerStatus("READY TO FOCUS");
    });

    focusMode.addEventListener("change", function () {
        stopTimer();

        remainingSeconds = Number(focusMode.value) * 60;

        displayTimer();
        setTimerStatus("READY TO FOCUS");
    });

    displayTimer();


    // ===== 8. NAVIGATION ACTIVE STATE =====

    const navLinks = document.querySelectorAll(".nav-link");
    const pageSections = document.querySelectorAll(
        "#home, #tasks, #timetable, #coding, #focus"
    );

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        navLinks.forEach(function (link) {
                            const isActive =
                                link.getAttribute("href") ===
                                "#" + entry.target.id;

                            link.classList.toggle("active", isActive);
                        });
                    }
                });
            },
            {
                rootMargin: "-20% 0px -65% 0px"
            }
        );

        pageSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

});
