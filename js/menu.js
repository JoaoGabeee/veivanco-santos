const btn = document.getElementById('menu-btn');
const menuIcon = btn.querySelector('.menu-icon');

btn.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
});