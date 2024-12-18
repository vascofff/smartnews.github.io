// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение на полный экран

let currentPage = 1; // Текущая страница новостей
let isLoading = false; // Флаг загрузки
const newsFeed = document.getElementById("newsFeed");
const loadingIndicator = document.getElementById("loading");

// Функция для загрузки новостей
async function loadNews() {
    if (isLoading) return;
    isLoading = true;

    // Показываем индикатор загрузки
    loadingIndicator.style.display = "block";

    try {
        const response = await fetch(`/api/news?page=${currentPage}`);
        if (!response.ok) {
            throw new Error("Ошибка загрузки новостей");
        }

        const news = await response.json();
        if (news.length === 0) {
            loadingIndicator.innerText = "Больше новостей нет";
            return;
        }

        news.forEach((post) => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
            `;
            newsFeed.appendChild(postDiv);
        });

        currentPage++;
    } catch (error) {
        console.error("Ошибка загрузки новостей:", error);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = "none";
    }
}

// Инициализация
loadNews();

// Обработчик скроллинга
window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Если пользователь находится внизу страницы, загружаем новые новости
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadNews();
    }
});
