document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel").forEach((carouselContainer) => {
    const rows = carouselContainer.querySelectorAll(".row");

    rows.forEach((row) => {
      const columnGap = parseInt(getComputedStyle(row).columnGap) || 0;
      console.log(`Значение column-gap для .row: ${columnGap}px`);

      const prevButtons = carouselContainer.querySelectorAll(".carousel-button.left");
      const nextButtons = carouselContainer.querySelectorAll(".carousel-button.right");
      const currentPositions = carouselContainer.querySelectorAll(".position .current");
      const totalPositions = carouselContainer.querySelectorAll(".position .total");
      const numbersContainer = carouselContainer.querySelector(".position.numbers");
      const bulletsContainer = carouselContainer.querySelector(".position.bullets");

      let carouselWidth = carouselContainer.offsetWidth;
      const totalCards = row.querySelectorAll(".card").length;
      let totalScrollWidth = row.scrollWidth;
      let totalScrollSteps = Math.ceil(totalScrollWidth / carouselWidth);

      let currentIndex = 0;

      function updateCarousel() {
        const offset = -(currentIndex * (carouselWidth + columnGap));
        console.log(`Карусель прокручивается на ${-offset}px`);
        console.log(`Текущий индекс: ${currentIndex}`);
        console.log(`Ширина карусели: ${carouselWidth}px`);
        console.log(`columnGap: ${columnGap}px`);

        row.style.transform = `translateX(${offset}px)`;

        const endIndex = currentIndex + 1;
        currentPositions.forEach((position) => (position.textContent = endIndex));
        totalPositions.forEach((position) => (position.textContent = totalScrollSteps));

        updateBullets();
        updateNumbers();

        prevButtons.forEach((button) => (button.disabled = currentIndex === 0));
        nextButtons.forEach((button) => (button.disabled = endIndex >= totalScrollSteps));
      }

      function updateNumbers() {
        if (numbersContainer) {
          numbersContainer.querySelector(".current").textContent = currentIndex + 1;
          numbersContainer.querySelector(".total").textContent = totalScrollSteps;
        }
      }

      function updateBullets() {
        if (bulletsContainer) {
          bulletsContainer.innerHTML = "";

          for (let i = 0; i < totalScrollSteps; i++) {
            const bullet = document.createElement("div");
            bullet.className = i === currentIndex ? "bullet active" : "bullet";

            bullet.addEventListener("click", () => {
              currentIndex = i;
              updateCarousel();
            });

            bulletsContainer.appendChild(bullet);
          }
        }
      }

      function showNextRow() {
        if (currentIndex < totalScrollSteps - 1) {
          currentIndex++;
          console.log(`Переход к следующему экрану (индекс ${currentIndex})`);
        } else {
          currentIndex = totalScrollSteps - 1;
          console.log("Достигнут последний экран, больше круток вправо нет");
        }
        updateCarousel();
      }

      function showPrevRow() {
        if (currentIndex > 0) {
          currentIndex--;
          console.log(`Переход к предыдущему экрану (индекс ${currentIndex})`);
        } else {
          currentIndex = 0;
          console.log("Достигнут первый экран, больше круток влево нет");
        }
        updateCarousel();
      }

      nextButtons.forEach((button) => button.addEventListener("click", showNextRow));
      prevButtons.forEach((button) => button.addEventListener("click", showPrevRow));

      updateCarousel();

      window.addEventListener("resize", function () {
        carouselWidth = carouselContainer.offsetWidth;
        totalScrollWidth = row.scrollWidth;
        totalScrollSteps = Math.ceil(totalScrollWidth / carouselWidth);

        if (currentIndex >= totalScrollSteps) {
          currentIndex = totalScrollSteps - 1;
        }

        console.log("Обновление размеров карусели при изменении размера окна");
        updateCarousel();
      });

      if (carouselContainer.classList.contains("cycled")) {
        setInterval(showNextRow, 4000);
      }
    });
  });
});
