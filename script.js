const scheduleDiv = document.getElementById("schedule");
const eastDiv = document.getElementById("east");
const westDiv = document.getElementById("west");
const updateTime = document.getElementById("update-time");

// NBA 球隊中文對照
const teamMap = {
  "Atlanta Hawks": "亞特蘭大老鷹",
  "Boston Celtics": "波士頓塞爾提克",
  "Brooklyn Nets": "布魯克林籃網",
  "Charlotte Hornets": "夏洛特黃蜂",
  "Chicago Bulls": "芝加哥公牛",
  "Cleveland Cavaliers": "克里夫蘭騎士",
  "Detroit Pistons": "底特律活塞",
  "Indiana Pacers": "印第安納溜馬",
  "Miami Heat": "邁阿密熱火",
  "Milwaukee Bucks": "密爾瓦基公鹿",
  "New York Knicks": "紐約尼克",
  "Orlando Magic": "奧蘭多魔術",
  "Philadelphia 76ers": "費城七六人",
  "Toronto Raptors": "多倫多暴龍",
  "Washington Wizards": "華盛頓巫師",
  "Dallas Mavericks": "達拉斯獨行俠",
  "Denver Nuggets": "丹佛金塊",
  "Golden State Warriors": "金州勇士",
  "Houston Rockets": "休士頓火箭",
  "LA Clippers": "洛杉磯快艇",
  "Los Angeles Lakers": "洛杉磯湖人",
  "Memphis Grizzlies": "曼菲斯灰熊",
  "Minnesota Timberwolves": "明尼蘇達灰狼",
  "New Orleans Pelicans": "紐奧良鵜鶘",
  "Oklahoma City Thunder": "奧克拉荷馬雷霆",
  "Phoenix Suns": "鳳凰城太陽",
  "Portland Trail Blazers": "波特蘭拓荒者",
  "Sacramento Kings": "沙加緬度國王",
  "San Antonio Spurs": "聖安東尼奧馬刺",
  "Utah Jazz": "猶他爵士"
};

function getTeamName(name) {
  return teamMap[name] || name;
}

function getStatusClass(status) {
  if (status.includes("Final")) return "final";
  if (status.includes("Q") || status.includes("Half")) return "live";
  return "scheduled";
}

// 渲染賽程
async function fetchSchedule() {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`);
  const data = await res.json();

  scheduleDiv.innerHTML = "";

  data.events.forEach(game => {
    const home = game.competitions[0].competitors.find(t => t.homeAway === "home");
    const away = game.competitions[0].competitors.find(t => t.homeAway === "away");

    const status = game.status.type.description;
    const statusClass = getStatusClass(status);

    scheduleDiv.innerHTML += `
      <div class="game-card">
        <div class="teams-row">
          <div class="team-block">
            <img src="${home.team.logo}" alt="${home.team.displayName}" />
            <div class="team-name">${getTeamName(home.team.displayName)}</div>
          </div>
          <div class="score-block">${home.score || 0}</div>
          <div class="score-block">${away.score || 0}</div>
          <div class="team-block">
            <img src="${away.team.logo}" alt="${away.team.displayName}" />
            <div class="team-name">${getTeamName(away.team.displayName)}</div>
          </div>
        </div>
        <div class="status ${statusClass}">${status}</div>
      </div>
    `;
  });

  updateTime.innerText = "最後更新：" + new Date().toLocaleTimeString();
}

// 渲染戰績
async function fetchStandings() {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/standings`);
  const data = await res.json();

  eastDiv.innerHTML = "";
  westDiv.innerHTML = "";

  data.children.forEach(conf => {
    conf.standings.entries.forEach((team, index) => {
      const wins = team.stats.find(s => s.name === "wins").value;
      const losses = team.stats.find(s => s.name === "losses").value;

      const row = `
        <div class="team-row ${index < 8 ? "playoff" : ""}">
          ${index + 1}. ${getTeamName(team.team.displayName)} (${wins}-${losses})
        </div>
      `;

      if (conf.name.includes("Eastern")) {
        eastDiv.innerHTML += row;
      } else {
        westDiv.innerHTML += row;
      }
    });
  });
}

fetchSchedule();
fetchStandings();
setInterval(fetchSchedule, 10000);