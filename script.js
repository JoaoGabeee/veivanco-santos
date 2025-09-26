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

  