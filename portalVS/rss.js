const feedContainer = document.getElementById("feed");
const principalContainer = document.getElementById("noticia-principal");

const feeds = [
  "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/rss.xml",
  "https://www.contabeis.com.br/rss/noticias.xml",
  "https://www.sebrae.com.br/Sebrae/Portal Sebrae/rss.noticias?tipo=1"
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

function imagemAleatoria() {
  const index = Math.floor(Math.random() * imagensLocais.length);
  return imagensLocais[index];
}

let noticiasSecundarias = [];
let noticiaPrincipal = null;

async function carregarNoticias() {
  feedContainer.innerHTML = "<p class='text-center text-muted'>Carregando notícias...</p>";

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

  noticiaPrincipal = noticias.shift();
  noticiasSecundarias = noticias.slice(0, 12);

  mostrarNoticiaPrincipal(noticiaPrincipal);
  renderizarNoticias(noticiasSecundarias);

  setInterval(atualizarImagensComFade, 30000);
}

function extrairImagem(item) {
  if (item.enclosure?.link) return item.enclosure.link;

  const parser = new DOMParser();
  const doc = parser.parseFromString(item.description || item.content || '', 'text/html');
  const img = doc.querySelector('img');
  if (img?.src) return img.src;

  return imagemAleatoria();
}

function mostrarNoticiaPrincipal(item) {
  const imagem = extrairImagem(item);
  const descricao = (item.description || item.content || "").replace(/<[^>]+>/g, '').slice(0, 150) + '...';

  principalContainer.innerHTML = `
    <img id="principal-img" src="${imagem}" class="card-img-top fade-img" alt="${item.title}" 
         onerror="this.src='${imagemAleatoria()}';">
    <div class="card-body w-10">
      <h5 class="card-title">${item.title}</h5>
      <p class="card-text">${descricao}</p>
      <a href="${item.link}" target="_blank" class="btn btn-cta mt-3">Ler mais</a>
    </div>
  `;
}

function renderizarNoticias(lista) {
  feedContainer.innerHTML = "";
  lista.forEach((item, index) => {
    const imagem = extrairImagem(item);
    const descricao = (item.description || item.content || "").replace(/<[^>]+>/g, '').slice(0, 120) + '...';
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img id="secundaria-img-${index}" src="${imagem}" class="card-img-top fade-img" alt="${item.title}" 
             onerror="this.src='${imagemAleatoria()}';">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">${descricao}</p>
          <a href="${item.link}" target="_blank" class="btn btn-cta mt-auto">Ler mais</a>
        </div>
      </div>
    `;
    feedContainer.appendChild(card);
  });
}

function atualizarImagensComFade() {
  const principalImg = document.getElementById("principal-img");
  if (principalImg) {
    trocarImagemComFade(principalImg, extrairImagem(noticiaPrincipal));
  }

  noticiasSecundarias.forEach((item, index) => {
    const imgEl = document.getElementById(`secundaria-img-${index}`);
    if (imgEl) {
      trocarImagemComFade(imgEl, extrairImagem(item));
    }
  });
}

function trocarImagemComFade(imgEl, novaSrc) {
  imgEl.style.opacity = 0;
  setTimeout(() => {
    imgEl.src = novaSrc;
    imgEl.onerror = () => imgEl.src = imagemAleatoria();
    imgEl.style.opacity = 1;
  }, 500); 
}

const style = document.createElement('style');
style.innerHTML = `
  .fade-img {
    transition: opacity 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);

carregarNoticias();
