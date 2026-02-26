const scheduleDiv = document.getElementById("schedule");
const updateTime = document.getElementById("update-time");
const datePicker = document.getElementById("datePicker");

// 預設今天
let selectedDate = new Date();

// URL 讀取日期參數
const params = new URLSearchParams(window.location.search);
if (params.get("date")) {
  selectedDate = new Date(params.get("date"));
}

datePicker.valueAsDate = selectedDate;

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function changeDate(offset) {
  selectedDate.setDate(selectedDate.getDate() + offset);
  datePicker.valueAsDate = selectedDate;
  updateURL();
  fetchSchedule();
}

datePicker.addEventListener("change", () => {
  selectedDate = new Date(datePicker.value);
  updateURL();
  fetchSchedule();
});

function updateURL() {
  const newDate = formatDate(selectedDate);
  history.replaceState(null, "", `?date=${newDate}`);
}

function getStatusClass(status) {
  if (status.includes("Final")) return "final";
  if (status.includes("Q") || status.includes("Half")) return "live";
  return "scheduled";
}

async function fetchSchedule() {
  const dateStr = formatDate(selectedDate).replaceAll("-", "");

  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}`
  );

  const data = await res.json();
  scheduleDiv.innerHTML = "";

  if (!data.events || data.events.length === 0) {
    scheduleDiv.innerHTML = "<p>當天沒有比賽</p>";
    return;
  }

  data.events.forEach(game => {
    const home = game.competitions[0].competitors.find(t => t.homeAway === "home");
    const away = game.competitions[0].competitors.find(t => t.homeAway === "away");

    const status = game.status.type.description;
    const statusClass = getStatusClass(status);

    scheduleDiv.innerHTML += `
      <div class="game-card">
        <div class="team">
          <span>
            <img src="${away.team.logo}" />
            ${away.team.displayName}
          </span>
          <strong>${away.score || 0}</strong>
        </div>

        <div class="team">
          <span>
            <img src="${home.team.logo}" />
            ${home.team.displayName}
          </span>
          <strong>${home.score || 0}</strong>
        </div>

        <div class="status ${statusClass}">
          ${status}
        </div>
      </div>
    `;
  });

  updateTime.innerText =
    "最後更新：" + new Date().toLocaleTimeString();
}

fetchSchedule();

// 只有今天才自動更新
setInterval(() => {
  const today = new Date().toISOString().split("T")[0];
  if (formatDate(selectedDate) === today) {
    fetchSchedule();
  }
}, 60000);