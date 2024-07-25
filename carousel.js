document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carousel").forEach((carouselContainer) => {
      const rows = carouselContainer.querySelectorAll(".row");
  
      rows.forEach((carousel) => {
        // Кнопки и позиционные элементы
        const prevButtons = carouselContainer.querySelectorAll(
          ".carousel-button.left"
        );
        const nextButtons = carouselContainer.querySelectorAll(
          ".carousel-button.right"
        );
        const currentPositions =
          carouselContainer.querySelectorAll(".position .current");
        const totalPositions =
          carouselContainer.querySelectorAll(".position .all");
        const numbersContainer =
          carouselContainer.querySelector(".position.numbers");
        const bulletsContainer =
          carouselContainer.querySelector(".position.bullets");
  
        let cardWidth = carouselContainer.querySelector(".card").offsetWidth;
        let carouselWidth = carouselContainer.offsetWidth;
        // let gap = parseInt(getComputedStyle(carousel).gap) || 0;
        let gap = 0;
        let cardsPerView = Math.floor((carouselWidth + gap) / (cardWidth + gap));
        const totalCards = carousel.querySelectorAll(".card").length;
  
        let currentIndex = 0;
  
        function updateCarousel() {
          const offset = -(currentIndex * (cardWidth + gap));
          carousel.style.transform = `translateX(${offset}px)`;
  
          const endIndex = Math.min(currentIndex + cardsPerView, totalCards);
          currentPositions.forEach(
            (position) => (position.textContent = endIndex)
          );
          totalPositions.forEach(
            (position) => (position.textContent = totalCards)
          );
  
          // Обновляем позиционные кружки и номера
          updateBullets();
          updateNumbers();
  
          prevButtons.forEach((button) => (button.disabled = currentIndex === 0));
          nextButtons.forEach(
            (button) => (button.disabled = endIndex >= totalCards)
          );
        }
  
        function updateNumbers() {
          if (numbersContainer) {
            // Обновление старого счётчика
            numbersContainer.querySelector(".current").textContent = Math.min(currentIndex + cardsPerView, totalCards);
            numbersContainer.querySelector(".all").textContent = totalCards;
          }
        }
  
        function updateBullets() {
          if (bulletsContainer) {
            // Очистить контейнер кружков
            bulletsContainer.innerHTML = "";
  
            const totalBullets = Math.ceil(totalCards / cardsPerView);
  
            for (let i = 0; i < totalBullets; i++) {
              const bullet = document.createElement("div");
              bullet.className = i === Math.floor(currentIndex / cardsPerView) ? "bullet active" : "bullet";
  
              bullet.addEventListener("click", () => {
                currentIndex = i * cardsPerView;
                updateCarousel();
              });
  
              bulletsContainer.appendChild(bullet);
            }
          }
        }
  
        function showNextRow() {
          if (currentIndex + cardsPerView < totalCards) {
            currentIndex += cardsPerView;
          } else {
            currentIndex = totalCards - cardsPerView; // Показать последнюю группу карточек
          }
          updateCarousel();
        }
  
        function showPrevRow() {
          if (currentIndex > 0) {
            currentIndex -= cardsPerView;
            if (currentIndex < 0) currentIndex = 0; // Убедиться, что не уходит в отрицательные значения
            updateCarousel();
          }
        }
  
        nextButtons.forEach((button) =>
          button.addEventListener("click", showNextRow)
        );
        prevButtons.forEach((button) =>
          button.addEventListener("click", showPrevRow)
        );
  
        updateCarousel(); // Инициализация
  
        // Обновляем отображение при изменении размера окна
        window.addEventListener("resize", function () {
          cardWidth = carouselContainer.querySelector(".card").offsetWidth;
          carouselWidth = carouselContainer.offsetWidth;
          gap = parseInt(getComputedStyle(carousel).gap) || 0;
          cardsPerView = Math.floor((carouselWidth + gap) / (cardWidth + gap));
          const offset = -(currentIndex * (cardWidth + gap));
  
          carousel.style.transition = "none"; // Отключаем анимацию
          carousel.style.transform = `translateX(${offset}px)`;
          setTimeout(() => {
            carousel.style.transition = ""; // Включаем анимацию
          }, 0);
  
          updateCarousel();
        });
  
        // Автоматическое перемещение вправо каждые 4 секунды только для каруселей с классом .cycled
        if (carouselContainer.classList.contains("cycled")) {
          setInterval(showNextRow, 4000);
        }
      });
    });
  });
  