const scheduleDiv = document.getElementById("schedule");
const eastDiv = document.getElementById("east");
const westDiv = document.getElementById("west");

// 今日日期
const today = new Date().toISOString().split("T")[0];

// 取得今日賽程
async function fetchSchedule() {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`);
  const data = await res.json();

  scheduleDiv.innerHTML = "";

  data.events.forEach(game => {
    const home = game.competitions[0].competitors.find(t => t.homeAway === "home");
    const away = game.competitions[0].competitors.find(t => t.homeAway === "away");

    const status = game.status.type.description;

    scheduleDiv.innerHTML += `
      <div class="game-card">
        ${away.team.displayName} ${away.score || 0}
        vs
        ${home.team.displayName} ${home.score || 0}
        <br>
        狀態：${status}
      </div>
    `;
  });
}

// 取得戰績
async function fetchStandings() {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/standings`);
  const data = await res.json();

  eastDiv.innerHTML = "";
  westDiv.innerHTML = "";

  data.children.forEach(conference => {
    const teams = conference.standings.entries;

    teams.forEach((team, index) => {
      const name = team.team.displayName;
      const wins = team.stats.find(s => s.name === "wins").value;
      const losses = team.stats.find(s => s.name === "losses").value;

      const row = `
        <div class="team-row">
          ${index + 1}. ${name} (${wins}-${losses})
        </div>
      `;

      if (conference.name === "Eastern Conference") {
        eastDiv.innerHTML += row;
      } else {
        westDiv.innerHTML += row;
      }
    });
  });
}

// 初始載入
fetchSchedule();
fetchStandings();

// 每60秒更新比分
setInterval(fetchSchedule, 60000);