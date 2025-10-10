const STORAGE_KEY = "safety360-state-v1";

const uuid = () => (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);

const clone = (value) => (typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value)));
const defaultState = {
  checks: {
    health: [
      {
        id: "H-001",
        title: "Weekly first aid kit inspection",
        frequency: "Weekly",
        location: "Reception",
        owner: "Alex Johnson",
        due: offsetDate(2),
        completed: false,
        notes: "Top up adhesive dressings if below minimum levels."
      },
      {
        id: "H-002",
        title: "Display screen equipment (DSE) review",
        frequency: "Quarterly",
        location: "All workstations",
        owner: "Priya Patel",
        due: offsetDate(28),
        completed: false
      },
      {
        id: "H-003",
        title: "Workplace temperature spot check",
        frequency: "Daily",
        location: "Production floor",
        owner: "Jordan Mills",
        due: offsetDate(-1),
        completed: false
      },
      {
        id: "H-004",
        title: "PPE stocktake",
        frequency: "Monthly",
        location: "Stores cupboard",
        owner: "Sasha Green",
        due: offsetDate(9),
        completed: true
      }
    ],
    fire: [
      {
        id: "F-001",
        title: "Fire alarm call-point test",
        frequency: "Weekly",
        location: "Site wide",
        owner: "Liam Carter",
        due: offsetDate(-3),
        completed: false
      },
      {
        id: "F-002",
        title: "Emergency lighting function test",
        frequency: "Monthly",
        location: "Warehouse mezzanine",
        owner: "Lena Ruiz",
        due: offsetDate(6),
        completed: false
      },
      {
        id: "F-003",
        title: "Fire extinguisher visual check",
        frequency: "Monthly",
        location: "All extinguishers",
        owner: "Marco Chen",
        due: offsetDate(4),
        completed: false
      },
      {
        id: "F-004",
        title: "Evacuation drill",
        frequency: "Annually",
        location: "Main facility",
        owner: "Holly James",
        due: offsetDate(90),
        completed: false
      }
    ]
  },
  incidents: [
    {
      id: uuid(),
      category: "Health",
      severity: "low",
      location: "Breakout space",
      description: "Minor slip reported near refreshment area. Floor cleaned and wet-floor signage deployed.",
      reportedOn: offsetDate(-4),
      status: "Closed"
    },
    {
      id: uuid(),
      category: "Fire",
      severity: "medium",
      location: "Warehouse bay 3",
      description: "Faulty extension lead discovered during walk-through. Lead removed and PAT retest booked.",
      reportedOn: offsetDate(-11),
      status: "Actioning"
    }
  ]
};

let state = loadState();
let activeTab = "health";

const statsContainer = document.getElementById("stats");
const progressEl = document.getElementById("completionProgress");
const checklistContainer = document.getElementById("checklist");
const scheduleContainer = document.getElementById("schedule");
const incidentList = document.getElementById("incidentList");
const incidentTemplate = document.getElementById("incidentTemplate");
const tabButtons = document.querySelectorAll('.tab-bar button');

render();

setupInteractions();

function setupInteractions() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.target === activeTab) return;
      tabButtons.forEach((other) => {
        const isActive = other === btn;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-selected", isActive);
      });
      activeTab = btn.dataset.target;
      renderChecklist();
    });
  });

  document.getElementById("newCheckForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const type = formData.get("type");
    const title = formData.get("title").trim();
    const location = formData.get("location").trim();
    const frequency = formData.get("frequency");
    const owner = formData.get("owner").trim();
    const due = formData.get("due");

    if (!title || !location || !owner) {
      return showToast("Fill in all required fields", "error");
    }

    const newCheck = {
      id: `${type}-${Date.now()}`,
      title,
      location,
      frequency,
      owner,
      due,
      completed: false
    };

    state.checks[type].push(newCheck);
    saveState();
    event.target.reset();
    render();
    showToast("New check added", "success");
  });

  document.getElementById("incidentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const incident = {
      id: uuid(),
      category: formData.get("category"),
      severity: formData.get("severity"),
      location: formData.get("location").trim(),
      description: formData.get("description").trim(),
      reportedOn: new Date().toISOString().slice(0, 10),
      status: "Logged"
    };

    state.incidents.unshift(incident);
    saveState();
    event.target.reset();
    renderIncidents();
    showToast("Incident recorded", "info");
  });

  document.getElementById("downloadReport").addEventListener("click", () => {
    const report = buildReport();
    const file = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `safety360-report-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Report downloaded", "success");
  });

  document.getElementById("quickLogIssue").addEventListener("click", () => {
    const description = prompt("Describe the incident or hazard");
    if (!description) return;
    const incident = {
      id: uuid(),
      category: "Health",
      severity: "medium",
      location: "Not specified",
      description: description.trim(),
      reportedOn: new Date().toISOString().slice(0, 10),
      status: "Logged"
    };
    state.incidents.unshift(incident);
    saveState();
    renderIncidents();
    showToast("Quick log captured", "info");
  });
}

function render() {
  renderStats();
  renderChecklist();
  renderSchedule();
  renderIncidents();
}

function renderStats() {
  const allChecks = [...state.checks.health, ...state.checks.fire];
  const total = allChecks.length;
  const completed = allChecks.filter((check) => check.completed).length;
  const overdue = allChecks.filter((check) => !check.completed && isOverdue(check.due)).length;
  const dueThisWeek = allChecks.filter((check) => !check.completed && isDueWithin(check.due, 7)).length;

  const stats = [
    { label: "Open checks", value: total - completed },
    { label: "Completed", value: completed },
    { label: "Overdue", value: overdue },
    { label: "Due this week", value: dueThisWeek }
  ];

  statsContainer.innerHTML = stats
    .map(
      (stat) => `
        <div class="stat">
          <span>${stat.label}</span>
          <strong>${stat.value}</strong>
        </div>
      `
    )
    .join("");

  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  progressEl.style.transform = `scaleX(${completionRate / 100})`;
  progressEl.setAttribute("aria-label", `Completion ${completionRate}%`);
}

function renderChecklist() {
  const items = state.checks[activeTab];
  if (!items.length) {
    checklistContainer.innerHTML = `<div class="empty-state">No checks yet. Use the form below to add your first one.</div>`;
    return;
  }

  const sorted = [...items].sort((a, b) => new Date(a.due || Date.now()) - new Date(b.due || Date.now()));

  checklistContainer.innerHTML = sorted
    .map((item) => {
      const status = computeStatus(item);
      return `
        <article class="check-item ${item.completed ? "completed" : ""}" data-id="${item.id}">
          <header>
            <span class="check-title">${item.title}</span>
            <span class="status-chip ${status.className}">${status.label}</span>
          </header>
          <div class="meta-row">
            <span>📍 ${item.location}</span>
            <span>👤 ${item.owner}</span>
            <span>🗓 ${formatDate(item.due)}</span>
            <span>🔁 ${item.frequency}</span>
          </div>
          ${item.notes ? `<p>${item.notes}</p>` : ""}
          <div class="check-actions">
            <button class="action primary" data-action="toggle">${item.completed ? "Mark outstanding" : "Mark complete"}</button>
            <button class="action" data-action="snooze">Snooze 3 days</button>
          </div>
        </article>
      `;
    })
    .join("");

  checklistContainer.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const parent = event.currentTarget.closest(".check-item");
      const id = parent.dataset.id;
      const action = event.currentTarget.dataset.action;
      if (action === "toggle") {
        toggleCheck(id);
      } else if (action === "snooze") {
        snoozeCheck(id, 3);
      }
    });
  });
}

function toggleCheck(id) {
  const list = state.checks[activeTab];
  const target = list.find((item) => item.id === id);
  if (!target) return;
  target.completed = !target.completed;
  saveState();
  render();
  showToast(target.completed ? "Check completed" : "Marked as outstanding", "success");
}

function snoozeCheck(id, days) {
  const list = state.checks[activeTab];
  const target = list.find((item) => item.id === id);
  if (!target) return;
  const newDate = new Date(target.due || new Date());
  newDate.setDate(newDate.getDate() + days);
  target.due = newDate.toISOString().slice(0, 10);
  saveState();
  render();
  showToast(`Snoozed to ${formatDate(target.due)}`, "info");
}

function renderSchedule() {
  const farFuture = new Date("9999-12-31");
  const all = [...state.checks.health, ...state.checks.fire]
    .filter((item) => !item.completed)
    .sort((a, b) => (new Date(a.due || farFuture) - new Date(b.due || farFuture)))
    .slice(0, 5);

  if (!all.length) {
    scheduleContainer.innerHTML = `<div class="empty-state">Nothing due – great job!</div>`;
    return;
  }

  scheduleContainer.innerHTML = all
    .map((item) => {
      const days = daysUntil(item.due);
      const isOver = isOverdue(item.due);
      let urgency;
      if (isOver) {
        urgency = "Overdue";
      } else if (days === null) {
        urgency = "Date pending";
      } else if (days === 0) {
        urgency = "Due today";
      } else {
        urgency = `Due in ${days} day${days === 1 ? "" : "s"}`;
      }
      return `
        <article class="schedule-item">
          <strong>${item.title}</strong>
          <div class="schedule-meta">
            <span>${formatDate(item.due)}</span>
            <span>${item.owner}</span>
            <span>${urgency}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderIncidents() {
  if (!state.incidents.length) {
    incidentList.innerHTML = `<div class="empty-state">No incidents logged yet.</div>`;
    return;
  }

  incidentList.innerHTML = "";
  state.incidents.slice(0, 4).forEach((incident) => {
    const entry = incidentTemplate.content.firstElementChild.cloneNode(true);
    entry.querySelector("strong").textContent = `${incident.category} incident`;
    const tag = entry.querySelector(".tag");
    tag.textContent = incident.severity;
    tag.classList.add(incident.severity, incident.category.toLowerCase());
    const meta = entry.querySelector(".incident-meta");
    meta.innerHTML = `
      <span>📍 ${incident.location}</span>
      <span>🗓 ${formatDate(incident.reportedOn)}</span>
      <span>Status: ${incident.status}</span>
    `;
    entry.querySelector("p").textContent = incident.description;
    incidentList.appendChild(entry);
  });
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return clone(defaultState);
    const parsed = JSON.parse(stored);
    return {
      checks: {
        health: parsed.checks?.health ?? clone(defaultState.checks.health),
        fire: parsed.checks?.fire ?? clone(defaultState.checks.fire)
      },
      incidents: parsed.incidents ?? clone(defaultState.incidents)
    };
  } catch (error) {
    console.error("Failed to load state", error);
    return clone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state", error);
  }
}

function offsetDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

function computeStatus(item) {
  if (item.completed) {
    return { label: "Completed", className: "status-complete" };
  }
  if (isOverdue(item.due)) {
    return { label: "Overdue", className: "status-overdue" };
  }
  if (isDueWithin(item.due, 2)) {
    return { label: "Due soon", className: "status-due" };
  }
  return { label: "Scheduled", className: "status-due" };
}

function isOverdue(date) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  if (Number.isNaN(dueDate.getTime())) return false;
  return dueDate < today;
}

function isDueWithin(date, days) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  if (Number.isNaN(dueDate.getTime())) return false;
  const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  if (Number.isNaN(dueDate.getTime())) return null;
  const diff = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(date) {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function buildReport() {
  const lines = [];
  lines.push(`Safety360 compliance snapshot – ${new Date().toLocaleString()}`);
  lines.push("".padEnd(40, "="));
  const allChecks = [...state.checks.health, ...state.checks.fire];
  const completed = allChecks.filter((c) => c.completed).length;
  lines.push(`Total checks: ${allChecks.length}`);
  lines.push(`Completed: ${completed}`);
  lines.push(`Open: ${allChecks.length - completed}`);
  lines.push(`Overdue: ${allChecks.filter((c) => !c.completed && isOverdue(c.due)).length}`);
  lines.push("\nDetailed checklist status:");
  Object.entries(state.checks).forEach(([category, items]) => {
    lines.push(`\n${category.toUpperCase()} CHECKS:`);
    items.forEach((item) => {
      const statusText = item.completed ? "Completed" : `Due ${formatDate(item.due)}`;
      lines.push(`- ${item.title} (${item.frequency}) – ${statusText}`);
    });
  });

  lines.push("\nRecent incidents:");
  state.incidents.slice(0, 5).forEach((incident) => {
    lines.push(`- [${incident.category}] ${incident.description} (${incident.severity}) on ${formatDate(incident.reportedOn)} at ${incident.location}`);
  });

  return lines.join("\n");
}

function showToast(message, variant = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4200);
}
