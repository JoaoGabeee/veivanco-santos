 const reveals = document.querySelectorAll('.reveal');
  window.addEventListener('scroll', () => {
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 50) {
        el.classList.add('active');
      }
    });
  });

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


document.addEventListener("DOMContentLoaded", function () {
  const imagens = [
    "imagens/contador1.png",
    "imagens/contador2.png",
    "imagens/contador3.png"
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
