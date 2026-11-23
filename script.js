const list = document.querySelector("#game-list");
const search = document.querySelector("#search");
const count = document.querySelector("#game-count");
const empty = document.querySelector("#empty-state");
const error = document.querySelector("#load-error");

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.id === pageName));
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === pageName));
  window.scrollTo({top: 0, behavior: "smooth"});
}
document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
document.querySelector("#explore-button").addEventListener("click", () => showPage("biblioteca"));

function renderGames(items) {
  list.innerHTML = "";
  count.textContent = `${items.length} ${items.length === 1 ? "jogo" : "jogos"}`;
  empty.hidden = items.length !== 0;
  items.forEach(game => {
    const card = document.createElement("article");
    card.className = "game-card";
    const cover = document.createElement("div");
    cover.className = "game-cover";
    if (game.image) {
      const img = document.createElement("img");
      img.src = game.image;
      img.alt = `Capa de ${game.name || "jogo"}`;
      img.loading = "lazy";
      img.onerror = () => { cover.innerHTML = `<span class="cover-placeholder">${escapeHtml((game.name || "H").slice(0,1).toUpperCase())}</span>`; };
      cover.appendChild(img);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "cover-placeholder";
      placeholder.textContent = (game.name || "H").slice(0,1).toUpperCase();
      cover.appendChild(placeholder);
    }
    const info = document.createElement("div");
    info.className = "game-info";
    const title = document.createElement("h2"); title.textContent = game.name || "Jogo sem nome";
    const desc = document.createElement("p"); desc.textContent = game.description || "";
    const category = document.createElement("span"); category.className = "category"; category.textContent = game.category || "Geral";
    info.append(title, desc, category);
    const play = document.createElement("button");
    play.className = "play-button"; play.textContent = "▶ Jogar";
    play.addEventListener("click", () => {
      if (game.url) window.open(game.url, "_blank", "noopener,noreferrer");
    });
    card.append(cover, info, play);
    list.appendChild(card);
  });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
let games = [];
search.addEventListener("input", () => {
  const term = search.value.trim().toLocaleLowerCase("pt-BR");
  renderGames(games.filter(game => `${game.name} ${game.category} ${game.description}`.toLocaleLowerCase("pt-BR").includes(term)));
});
fetch("./games.json")
  .then(response => { if (!response.ok) throw new Error("games.json não encontrado"); return response.json(); })
  .then(data => {
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    games = data;
    renderGames(games);
  })
  .catch(() => { error.hidden = false; });
