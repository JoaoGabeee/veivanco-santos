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

  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
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
  const imgElement = document.getElementById("img-rotativa");
  const intervaloTroca = 10000;

  setInterval(() => {
    imgElement.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % imagens.length;

      imgElement.src = imagens[index];
      imgElement.onload = () => {
        imgElement.style.opacity = 1;
      };
    }, 1000); 
  }, intervaloTroca);
});
