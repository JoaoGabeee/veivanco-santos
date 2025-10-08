const feedContainer = document.getElementById("feed");
const principalContainer = document.getElementById("noticia-principal");

const feeds = [
  "https://www.valor.com.br/financas/rss",
  "https://www.contabeis.com.br/rss/noticias/",
  "https://contabilidadeagora.webnode.page/rss/noticias.xml",
  "https://www.cmaiscontabilidade.com.br/RSS/Not%C3%ADcias"
];


const imagensLocais = [
  "imagens/imagem1.jpeg",
  "imagens/imagem2.jpeg",
  "imagens/imagem3.jpeg",
  "imagens/imagem4.jpg",
  "imagens/imagem5.jpg",
  "imagens/imagem6.jpg",
  "imagens/imagem7.jpg",
  "imagens/imagem8.jpg",
  "imagens/imagem9.jpg",
  "imagens/imagem10.jpg",
];

const imagensUsadas = new Set();
function imagemAleatoriaNova() {
  let imagem;
  do {
    const index = Math.floor(Math.random() * imagensLocais.length);
    imagem = imagensLocais[index];
  } while (imagensUsadas.has(imagem) && imagensUsadas.size < imagensLocais.length);
  imagensUsadas.add(imagem);
  return imagem;
}

let todasNoticias = [];
let noticiasExibidas = 0;
const noticiasPorPagina = 15;

async function carregarNoticias() {
  feedContainer.innerHTML = `
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 fw-bold">Carregando notícias...</p>
    </div>
  `;

  let noticias = [];

  for (const url of feeds) {
    try {
      const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const resposta = await fetch(apiURL);
      const dados = await resposta.json();
      if (dados.items) noticias.push(...dados.items);
    } catch (erro) {
      console.error("Erro ao carregar RSS:", erro);
    }
  }

  if (noticias.length === 0) {
    feedContainer.innerHTML = "<p class='text-center text-danger'>Não foi possível carregar as notícias no momento.</p>";
    return;
  }

  noticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const noticiaPrincipal = noticias.shift();
  todasNoticias = noticias;

  mostrarNoticiaPrincipal(noticiaPrincipal);
  renderizarNoticias();
}

function extrairImagem(item) {
  if (item.enclosure?.link) return item.enclosure.link;

  const parser = new DOMParser();
  const doc = parser.parseFromString(item.description || item.content || '', 'text/html');
  const img = doc.querySelector('img');
  if (img?.src) return img.src;

  return imagemAleatoriaNova();
}

function mostrarNoticiaPrincipal(item) {
  const imagem = extrairImagem(item);
  const descricao = (item.description || item.content || "").replace(/<[^>]+>/g, '').slice(0, 250) + '...';

  principalContainer.innerHTML = `
    <div class="card shadow-lg">
      <img src="${imagem}" class="card-img-top" alt="${item.title}" 
           onerror="this.src='${imagemAleatoriaNova()}';">
      <div class="card-body text-white">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-text">${descricao}</p>
        <a href="${item.link}" target="_blank" class="btn btn-cta mt-3">Ler mais</a>
      </div>
    </div>
  `;
}

function renderizarNoticias() {
  const noticias = todasNoticias.slice(noticiasExibidas, noticiasExibidas + noticiasPorPagina);

  if (noticias.length === 0) return;
  if (noticiasExibidas === 0) feedContainer.innerHTML = "";

  noticias.forEach((item) => {
    const imagem = extrairImagem(item);
    const descricao = (item.description || item.content || "").replace(/<[^>]+>/g, '').slice(0, 120) + '...';

    const card = document.createElement("div");
    card.className = "col-md-4 mb-4 fade-in";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imagem}" class="card-img-top" alt="${item.title}" 
             onerror="this.src='${imagemAleatoriaNova()}';">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">${descricao}</p>
          <a href="${item.link}" target="_blank" class="btn btn-cta mt-auto">Ler mais</a>
        </div>
      </div>
    `;
    feedContainer.appendChild(card);
  });

  noticiasExibidas += noticiasPorPagina;
  adicionarBotaoLerMais();
}

function adicionarBotaoLerMais() {
  const botaoExistente = document.getElementById("btn-ler-mais");
  if (botaoExistente) botaoExistente.remove();

  if (noticiasExibidas < todasNoticias.length) {
    const botaoContainer = document.createElement("div");
    botaoContainer.className = "text-center mt-4 fade-in";
    botaoContainer.id = "btn-container";
    botaoContainer.innerHTML = `
      <button id="btn-ler-mais" class="btn btn-cta px-4 py-2">
        Mostrar mais notícias
      </button>
    `;
    feedContainer.appendChild(botaoContainer);

    document.getElementById("btn-ler-mais").addEventListener("click", () => {
      renderizarNoticias();
    });
  }
}

carregarNoticias();
