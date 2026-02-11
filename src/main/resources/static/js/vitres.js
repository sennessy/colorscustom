// Synchronisation des sliders
const verticalItems = document.querySelectorAll('.tint-vertical-item');
const horizontalItems = document.querySelectorAll('.tint-horizontal-item');

verticalItems.forEach(item => {
    item.addEventListener('click', () => {
        const index = item.dataset.index;

        verticalItems.forEach(i => i.classList.remove('active'));
        horizontalItems.forEach(i => i.classList.remove('active'));

        item.classList.add('active');
        document.querySelector(`.tint-horizontal-item[data-index="${index}"]`).classList.add('active');
    });
});
