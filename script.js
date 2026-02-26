document.getElementById("gameDate").valueAsDate = new Date();
document.getElementById("gameDate").addEventListener("change", loadGames);

function changeDate(offset) {
  const input = document.getElementById("gameDate");
  const date = new Date(input.value);
  date.setDate(date.getDate() + offset);
  input.valueAsDate = date;
  loadGames();
}

function loadGames() {
  const container = document.getElementById("games");
  container.innerHTML = "";

  const games = [
    {
      homeName: "湖人",
      awayName: "勇士",
      homeLogo: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg",
      awayLogo: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg",
      homeScore: 102,
      awayScore: 98,
      status: "Final"
    }
  ];

  games.forEach(game => {
    container.innerHTML += `
      <div class="game-card">
        <div class="game-row">
          <div class="team-block">
            <img src="${game.awayLogo}">
            <div class="team-name">${game.awayName}</div>
          </div>
          <div class="score-big">${game.awayScore}</div>
        </div>

        <div class="game-row">
          <div class="team-block">
            <img src="${game.homeLogo}">
            <div class="team-name">${game.homeName}</div>
          </div>
          <div class="score-big">${game.homeScore}</div>
        </div>

        <div class="game-status">${game.status}</div>
      </div>
    `;
  });
}

/* ----------- 新聞 ----------- */

async function fetchNews() {
  const newsContainer = document.getElementById("news-container");

  const rssUrl = encodeURIComponent(
    "https://news.google.com/rss/search?q=NBA&hl=zh-TW&gl=TW&ceid=TW:zh-Hant"
  );

  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    newsContainer.innerHTML = '<div class="news-grid"></div>';
    const grid = document.querySelector(".news-grid");

    data.items.slice(0, 6).forEach(item => {
      const imgMatch = item.description.match(/<img.*?src="(.*?)"/);
      const image = imgMatch ? imgMatch[1] : "";

      grid.innerHTML += `
        <div class="news-card">
          <a href="${item.link}" target="_blank">
            ${image ? `<img src="${image}" />` : ""}
            <div class="news-content">
              <h3>${item.title}</h3>
              <p>${item.description.replace(/<[^>]+>/g, "").slice(0, 80)}...</p>
            </div>
          </a>
        </div>
      `;
    });

  } catch (error) {
    newsContainer.innerHTML = "<p>新聞載入失敗</p>";
  }
}

loadGames();
fetchNews();