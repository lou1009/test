const scheduleDiv = document.getElementById("schedule");
const updateTime = document.getElementById("update-time");

const teamMap = {
  "Atlanta Hawks": "亞特蘭大老鷹",
  "Boston Celtics": "波士頓塞爾提克",
  "Brooklyn Nets": "布魯克林籃網",
  "Chicago Bulls": "芝加哥公牛",
  "New York Knicks": "紐約尼克",
  "Los Angeles Lakers": "洛杉磯湖人",
  "Golden State Warriors": "金州勇士"
  // 其餘你自己那份保留
};

function getTeamName(name){
  return teamMap[name] || name;
}

function getStatusClass(status){
  if(status.includes("Final")) return "final";
  if(status.includes("Q") || status.includes("Half")) return "live";
  return "scheduled";
}

async function fetchSchedule(){

  const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard");
  const data = await res.json();

  scheduleDiv.innerHTML = "";

  data.events.forEach(game => {

    const home = game.competitions[0].competitors.find(t => t.homeAway === "home");
    const away = game.competitions[0].competitors.find(t => t.homeAway === "away");

    const status = game.status.type.description;
    const statusClass = getStatusClass(status);

    scheduleDiv.innerHTML += `
      <div class="game-card">

        <div class="score-row">
          <div class="score">${away.score || 0}</div>
          <div class="score">${home.score || 0}</div>
        </div>

        <div class="team-row">

          <div class="team">
            <img src="${away.team.logo}">
            <div class="team-name">
              ${getTeamName(away.team.displayName)}
            </div>
          </div>

          <div class="team reverse">
            <img src="${home.team.logo}">
            <div class="team-name">
              ${getTeamName(home.team.displayName)}
            </div>
          </div>

        </div>

        <div class="status ${statusClass}">
          ${status}
        </div>

      </div>
    `;
  });

  updateTime.innerText = "最後更新：" + new Date().toLocaleTimeString();
}

fetchSchedule();
setInterval(fetchSchedule, 10000);