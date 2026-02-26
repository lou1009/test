const API_KEY = "91585da6-0d40-468f-a33e-5f208434cd5b";

document.getElementById("gameDate").valueAsDate = new Date();
document.getElementById("gameDate").addEventListener("change", loadGames);

function changeDate(offset) {
  const input = document.getElementById("gameDate");
  const date = new Date(input.value);
  date.setDate(date.getDate() + offset);
  input.valueAsDate = date;
  loadGames();
}

async function loadGames() {

  const container = document.getElementById("games");
  container.innerHTML = "載入中...";

  const date = document.getElementById("gameDate").value;

  try {
    const res = await fetch(
      `https://api.balldontlie.io/v1/games?dates[]=${date}`,
      {
        headers: {
          "Authorization": API_KEY
        }
      }
    );

    const data = await res.json();

    container.innerHTML = "";

    if (!data.data.length) {
      container.innerHTML = "當日無比賽";
      return;
    }

    data.data.forEach(game => {

      const home = game.home_team;
      const away = game.visitor_team;

      const isLive = game.status.includes("Q");

      const logoHome = `https://cdn.nba.com/logos/nba/${home.id}/global/L/logo.svg`;
      const logoAway = `https://cdn.nba.com/logos/nba/${away.id}/global/L/logo.svg`;

      container.innerHTML += `
        <div class="game-card">

          <div class="game-row">
            <div class="team-block">
              <img src="${logoAway}">
              ${away.full_name}
            </div>
            <div class="score-big ${isLive ? "live-score" : ""}">
              ${game.visitor_team_score}
            </div>
          </div>

          <div class="game-row">
            <div class="team-block">
              <img src="${logoHome}">
              ${home.full_name}
            </div>
            <div class="score-big ${isLive ? "live-score" : ""}">
              ${game.home_team_score}
            </div>
          </div>

          ${
            isLive
              ? `<div class="live-status">
                   <div class="live-dot"></div>
                   ${game.status}
                 </div>`
              : `<div class="game-status">${game.status}</div>`
          }

        </div>
      `;

    });

  } catch (err) {
    container.innerHTML = "API 讀取失敗";
  }
}

loadGames();
setInterval(loadGames, 30000);