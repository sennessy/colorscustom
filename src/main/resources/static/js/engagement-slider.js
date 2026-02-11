const engSlider = document.querySelector('.engagement-slider');
engSlider.addEventListener('wheel', (e) => {
    e.preventDefault();
    engSlider.scrollLeft += e.deltaY;
});
