const scheduleDiv = document.getElementById("schedule");
const updateTime = document.getElementById("update-time");

const teamMap = {
  "Atlanta Hawks": "老鷹",
  "Boston Celtics": "塞爾提克",
  "Brooklyn Nets": "籃網",
  "Charlotte Hornets": "黃蜂",
  "Chicago Bulls": "公牛",
  "Cleveland Cavaliers": "騎士",
  "Detroit Pistons": "活塞",
  "Indiana Pacers": "溜馬",
  "Miami Heat": "熱火",
  "Milwaukee Bucks": "公鹿",
  "New York Knicks": "尼克",
  "Orlando Magic": "魔術",
  "Philadelphia 76ers": "七六人",
  "Toronto Raptors": "暴龍",
  "Washington Wizards": "巫師",
  "Dallas Mavericks": "獨行俠",
  "Denver Nuggets": "金塊",
  "Golden State Warriors": "勇士",
  "Houston Rockets": "火箭",
  "LA Clippers": "快艇",
  "Los Angeles Lakers": "湖人",
  "Memphis Grizzlies": "灰熊",
  "Minnesota Timberwolves": "灰狼",
  "New Orleans Pelicans": "鵜鶘",
  "Oklahoma City Thunder": "雷霆",
  "Phoenix Suns": "太陽",
  "Portland Trail Blazers": "拓荒者",
  "Sacramento Kings": "國王",
  "San Antonio Spurs": "馬刺",
  "Utah Jazz": "爵士"
};

function getTeamName(name) {
  return teamMap[name] || name;
}

function getStatusClass(status) {
  if (status.includes("Final")) return "final";
  if (status.includes("Q") || status.includes("Half")) return "live";
  return "scheduled";
}

async function fetchSchedule() {
  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`
  );
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
          <div class="team-logo">
            <img src="${away.team.logo}">
          </div>

          <div class="score ${away.score > home.score ? 'winner' : ''}">
            ${away.score || 0}
          </div>

          <div class="center-status ${statusClass}">
            ${status}
          </div>

          <div class="score ${home.score > away.score ? 'winner' : ''}">
            ${home.score || 0}
          </div>

          <div class="team-logo">
            <img src="${home.team.logo}">
          </div>
        </div>

        <div class="team-info-row">
          <div class="team-info ${away.score > home.score ? 'winner-name' : ''}">
            <div class="team-name">
              ${getTeamName(away.team.displayName)}
            </div>
          </div>

          <div class="team-info ${home.score > away.score ? 'winner-name' : ''}">
            <div class="team-name">
              ${getTeamName(home.team.displayName)}
            </div>
          </div>
        </div>

      </div>
    `;
  });

  updateTime.innerText = "最後更新：" + new Date().toLocaleTimeString();
}

fetchSchedule();
setInterval(fetchSchedule, 10000);