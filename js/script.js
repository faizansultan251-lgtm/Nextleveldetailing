document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('slider-container');
    const beforeImg = document.getElementById('before-img');
    const sliderHandle = document.getElementById('slider-handle');

    if (sliderContainer && beforeImg && sliderHandle) {
        let isDragging = false;
        const updateSlider = (e) => {
            if (!isDragging) return;
            const rect = sliderContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let position = (x / rect.width) * 100;
            position = Math.max(0, Math.min(position, 100));
            beforeImg.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            sliderHandle.style.left = `${position}%`;
        };
        sliderContainer.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', updateSlider);
    }
});
