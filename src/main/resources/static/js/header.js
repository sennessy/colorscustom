function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('open');
}

// Mobile dropdown
document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            link.parentElement.classList.toggle('open');
        }
    });
});
