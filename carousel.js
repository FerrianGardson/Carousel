document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel").forEach((carouselContainer) => {
    const rows = carouselContainer.querySelectorAll(".row");

    rows.forEach((row) => {
      // Получаем значение column-gap
      const columnGap = parseInt(getComputedStyle(row).columnGap) || 0;
      console.log(`Значение column-gap для .row: ${columnGap}px`);

      // Кнопки и позиционные элементы
      const prevButtons = carouselContainer.querySelectorAll(
        ".carousel-button.left"
      );
      const nextButtons = carouselContainer.querySelectorAll(
        ".carousel-button.right"
      );
      const currentPositions = carouselContainer.querySelectorAll(
        ".position .current"
      );
      const totalPositions = carouselContainer.querySelectorAll(
        ".position .total"
      );
      const numbersContainer = carouselContainer.querySelector(
        ".position.numbers"
      );
      const bulletsContainer = carouselContainer.querySelector(
        ".position.bullets"
      );

      let carouselWidth = carouselContainer.offsetWidth; // Ширина карусели
      const totalCards = row.querySelectorAll(".card").length; // Общее количество карточек
      const totalScrollWidth = row.scrollWidth; // Общая ширина карусели (с учётом всех карточек)
      const totalScrollSteps = Math.ceil(totalScrollWidth / carouselWidth); // Общее количество шагов крутки

      let currentIndex = 0; // Индекс текущей позиции крутки

      // Функция для обновления карусели
      function updateCarousel() {
        const offset = -(currentIndex * (carouselWidth + columnGap)); // Смещение на ширину карусели с учетом columnGap

        console.log(`Карусель прокручивается на ${-offset}px`);
        console.log(`Текущий индекс: ${currentIndex}`);
        console.log(`Ширина карусели: ${carouselWidth}px`);
        console.log(`columnGap: ${columnGap}px`);

        row.style.transform = `translateX(${offset}px)`; // Применение смещения

        const endIndex = currentIndex + 1; // Индекс текущего экрана (плюс один для счёта)

        currentPositions.forEach(
          (position) => (position.textContent = endIndex)
        );
        totalPositions.forEach(
          (position) => (position.textContent = totalScrollSteps)
        );

        // Обновляем позиционные кружки и номера
        updateBullets();
        updateNumbers();

        // Активация или деактивация кнопок
        prevButtons.forEach((button) => (button.disabled = currentIndex === 0));
        nextButtons.forEach(
          (button) => (button.disabled = endIndex >= totalScrollSteps)
        );
      }

      // Функция для обновления числового счётчика
      function updateNumbers() {
        if (numbersContainer) {
          // Обновление счётчика
          numbersContainer.querySelector(".current").textContent =
            currentIndex + 1;
          numbersContainer.querySelector(
            ".total"
          ).textContent = totalScrollSteps;
        }
      }

      // Функция для обновления кружков (буллетов)
      function updateBullets() {
        if (bulletsContainer) {
          // Очистка старых кружков
          bulletsContainer.innerHTML = "";

          for (let i = 0; i < totalScrollSteps; i++) {
            const bullet = document.createElement("div");
            bullet.className = i === currentIndex ? "bullet active" : "bullet";

            bullet.addEventListener("click", () => {
              currentIndex = i; // Переход к выбранной позиции
              updateCarousel();
            });

            bulletsContainer.appendChild(bullet);
          }
        }
      }

      // Функция для показа следующего экрана карточек
      function showNextRow() {
        if (currentIndex < totalScrollSteps - 1) {
          currentIndex++; // Переход к следующему экрану
          console.log(`Переход к следующему экрану (индекс ${currentIndex})`);
        } else {
          currentIndex = totalScrollSteps - 1; // Остановка на последнем экране
          console.log("Достигнут последний экран, больше круток вправо нет");
        }
        updateCarousel();
      }

      // Функция для показа предыдущего экрана карточек
      function showPrevRow() {
        if (currentIndex > 0) {
          currentIndex--; // Переход к предыдущему экрану
          console.log(`Переход к предыдущему экрану (индекс ${currentIndex})`);
        } else {
          currentIndex = 0; // Остановка на первом экране
          console.log("Достигнут первый экран, больше круток влево нет");
        }
        updateCarousel();
      }

      // Привязка обработчиков событий к кнопкам
      nextButtons.forEach((button) =>
        button.addEventListener("click", showNextRow)
      );
      prevButtons.forEach((button) =>
        button.addEventListener("click", showPrevRow)
      );

      updateCarousel(); // Инициализация карусели

      // Обновление карусели при изменении размера окна
      window.addEventListener("resize", function () {
        carouselWidth = carouselContainer.offsetWidth; // Обновление ширины карусели
        console.log("Обновление размеров карусели при изменении размера окна");
        updateCarousel();
      });

      // Автоматическое перемещение вправо каждые 4 секунды только для каруселей с классом .cycled
      if (carouselContainer.classList.contains("cycled")) {
        setInterval(showNextRow, 4000);
      }
    });
  });
});
