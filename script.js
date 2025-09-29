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
  numeradores.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 200;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
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
