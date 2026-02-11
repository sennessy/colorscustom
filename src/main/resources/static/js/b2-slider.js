const slider = document.querySelector('.b2-slider');
slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
});
