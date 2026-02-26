const teamNames = {
  "Lakers": "湖人",
  "Warriors": "勇士",
  "Celtics": "塞爾提克",
  "Bucks": "公鹿",
  "Nets": "籃網"
};

document.getElementById("gameDate").valueAsDate = new Date();

function changeDate(offset) {
  const input = document.getElementById("gameDate");
  const date = new Date(input.value);
  date.setDate(date.getDate() + offset);
  input.valueAsDate = date;
  loadGames();
}

document.getElementById("gameDate").addEventListener("change", loadGames);

function loadGames() {
  const container = document.getElementById("games");
  const date = document.getElementById("gameDate").value;

  container.innerHTML = "";

  // 這裡用假資料示範（你之後可接 API）
  const games = [
    {
      home: "Lakers",
      away: "Warriors",
      homeScore: 102,
      awayScore: 98
    }
  ];

  games.forEach(game => {
    container.innerHTML += `
      <div class="game-card">
        <div class="team">
          <span>${teamNames[game.away] || game.away}</span>
          <span class="score">${game.awayScore}</span>
        </div>
        <div class="team">
          <span>${teamNames[game.home] || game.home}</span>
          <span class="score">${game.homeScore}</span>
        </div>
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