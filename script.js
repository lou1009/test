document.getElementById("gameDate").valueAsDate = new Date();
document.getElementById("gameDate").addEventListener("change", loadGames);

function changeDate(offset) {
  const input = document.getElementById("gameDate");
  const date = new Date(input.value);
  date.setDate(date.getDate() + offset);
  input.valueAsDate = date;
  loadGames();
}

// NBA 隊伍 logo 對照表
const teamLogoMap = {
  "Atlanta Hawks": "1610612737",
  "Boston Celtics": "1610612738",
  "Brooklyn Nets": "1610612751",
  "Charlotte Hornets": "1610612766",
  "Chicago Bulls": "1610612741",
  "Cleveland Cavaliers": "1610612739",
  "Dallas Mavericks": "1610612742",
  "Denver Nuggets": "1610612743",
  "Detroit Pistons": "1610612765",
  "Golden State Warriors": "1610612744",
  "Houston Rockets": "1610612745",
  "Indiana Pacers": "1610612754",
  "Los Angeles Clippers": "1610612746",
  "Los Angeles Lakers": "1610612747",
  "Memphis Grizzlies": "1610612763",
  "Miami Heat": "1610612748",
  "Milwaukee Bucks": "1610612749",
  "Minnesota Timberwolves": "1610612750",
  "New Orleans Pelicans": "1610612740",
  "New York Knicks": "1610612752",
  "Oklahoma City Thunder": "1610612760",
  "Orlando Magic": "1610612753",
  "Philadelphia 76ers": "1610612755",
  "Phoenix Suns": "1610612756",
  "Portland Trail Blazers": "1610612757",
  "Sacramento Kings": "1610612758",
  "San Antonio Spurs": "1610612759",
  "Toronto Raptors": "1610612761",
  "Utah Jazz": "1610612762",
  "Washington Wizards": "1610612764"
};

// 儲存上一輪比分，用於閃爍比較
let previousScores = {};

async function loadGames() {
  const container = document.getElementById("games");
  container.innerHTML = "載入中...";
  const date = document.getElementById("gameDate").value;

  try {
    const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://balldontlie.io/api/v1/games?dates[]=${date}`)}`;
    const res = await fetch(proxyURL);
    if (!res.ok) throw new Error("網路錯誤");
    const wrapped = await res.json();
    const data = JSON.parse(wrapped.contents);

    container.innerHTML = "";

    if (!data.data.length) {
      container.innerHTML = "當日無比賽";
      return;
    }

    data.data.forEach(game => {
      const home = game.home_team;
      const away = game.visitor_team;
      const isLive = game.status.includes("Q");

      const logoHome = teamLogoMap[home.full_name]
        ? `https://cdn.nba.com/logos/nba/${teamLogoMap[home.full_name]}/global/L/logo.svg`
        : "";
      const logoAway = teamLogoMap[away.full_name]
        ? `https://cdn.nba.com/logos/nba/${teamLogoMap[away.full_name]}/global/L/logo.svg`
        : "";

      // 判斷比分是否改變，用於閃動效果
      const prevKey = `${away.full_name}-${home.full_name}`;
      const prevScore = previousScores[prevKey] || {};
      const visitorChanged = prevScore.visitor !== game.visitor_team_score;
      const homeChanged = prevScore.home !== game.home_team_score;
      previousScores[prevKey] = {
        visitor: game.visitor_team_score,
        home: game.home_team_score
      };

      container.innerHTML += `
        <div class="game-card">
          <div class="game-row">
            <div class="team-block">
              ${logoAway ? `<img src="${logoAway}">` : ""}
              ${away.full_name}
            </div>
            <div class="score-big ${isLive && visitorChanged ? "live-score" : ""}">${game.visitor_team_score}</div>
          </div>
          <div class="game-row">
            <div class="team-block">
              ${logoHome ? `<img src="${logoHome}">` : ""}
              ${home.full_name}
            </div>
            <div class="score-big ${isLive && homeChanged ? "live-score" : ""}">${game.home_team_score}</div>
          </div>
          ${isLive
            ? `<div class="live-status">LIVE: ${game.status}</div>`
            : `<div class="game-status">${game.status}</div>`}
        </div>
      `;
    });

  } catch (err) {
    container.innerHTML = "API 讀取失敗";
    console.error(err);
  }
}

// 首次載入
loadGames();

// 每 30 秒自動刷新
setInterval(loadGames, 30000);