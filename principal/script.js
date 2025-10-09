//troca de imagens
document.addEventListener("DOMContentLoaded", function () {
  const imagens = [
    "../imagens/contador1.png",
    "../imagens/contador2.png",
    "../imagens/contador3.png"
  ];

  const precache = [];
  imagens.forEach(src => {
    const img = new Image();
    img.src = src;
    precache.push(img);
  });

  let index = 0;
  const imagem = document.getElementById("img-rotativa");
  const tempoTroca = 10000;

  setInterval(() => {
    imagem.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % imagens.length;

      imagem.src = imagens[index];
      imagem.onload = () => {
        imagem.style.opacity = 1;
      };
    }, 1000);
  }, tempoTroca);
});


//contador de números
const numeradores = document.querySelectorAll('.counter');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;

      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/\D/g, "");
        const increment = target / 200;

        if (count < target) {
          const newValue = Math.ceil(count + increment);
          counter.innerText = newValue.toLocaleString("pt-BR");
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target.toLocaleString("pt-BR");
        }
      };

      updateCount();

      observer.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

numeradores.forEach(counter => {
  observer.observe(counter);
});


async function enviarFormulario(e) {
  e.preventDefault();
  const formulario = e.target;
  const data = new FormData(formulario);

  try {
    const response = await fetch(formulario.action, {
      method: formulario.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      mostrarModal("✅ Mensagem enviada com sucesso!", "sucesso");
      formulario.reset();
    } else {
      mostrarModal("❌ Ocorreu um erro. Tente novamente.", "erro");
    }
  } catch (error) {
    mostrarModal("⚠️ Erro de conexão. Verifique sua internet.", "erro");
  }
}

const formContato = document.getElementById("formularioContato");
if (formContato) formContato.addEventListener("submit", enviarFormulario);

const formDuvidas = document.querySelector("#duvidas form");
if (formDuvidas) formDuvidas.addEventListener("submit", enviarFormulario);

function mostrarModal(texto, tipo = "sucesso") {
  const overlay = document.createElement("div");
  overlay.className = `mensagem-modal-overlay mostrar`;

  const modal = document.createElement("div");
  modal.className = `mensagem-modal ${tipo}`;
  modal.innerHTML = `
    <p>${texto}</p>
    <button>OK</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector("button").addEventListener("click", () => fecharModal(overlay, modal));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fecharModal(overlay, modal);
  });

  setTimeout(() => fecharModal(overlay, modal), 4000);
}

function fecharModal(overlay, modal) {
  modal.style.animation = "modalFadeOut 0.4s ease forwards";
  overlay.style.opacity = "0";
  overlay.style.visibility = "hidden";

  setTimeout(() => overlay.remove(), 400);
}

//Botão do menu hamburguer 
const btn = document.getElementById('menu-btn');
const menuIcon = btn.querySelector('.menu-icon');

btn.addEventListener('click', () => {
  menuIcon.classList.toggle('active');
});