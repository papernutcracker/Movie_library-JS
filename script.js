const API_KEY = 'YOUR_API_KEY_HERE'; //Вставте сюди свій API-ключ з OMDB
const BASE_URL = 'https://www.omdbapi.com/';

let currentTitle = '';
let currentType = '';
let currentPage = 1;

const searchForm = document.getElementById('searchForm');
const titleInput = document.getElementById('titleInput');
const typeSelect = document.getElementById('typeSelect');

const filmsSection = document.getElementById('filmsSection');
const filmsContainer = document.getElementById('filmsContainer');
const paginationContainer = document.getElementById('paginationContainer');

const detailsSection = document.getElementById('detailsSection');
const detailsContainer = document.getElementById('detailsContainer');

// Відправки форми
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Заборонено перезавантаження сторінки
    
    currentTitle = titleInput.value.trim();
    currentType = typeSelect.value;
    currentPage = 1;

    if (currentTitle) {
        searchMovies();
    }
});

// Пошук
async function searchMovies() {
    try {
        const url = `${BASE_URL}?s=${encodeURIComponent(currentTitle)}&type=${currentType}&page=${currentPage}&apikey=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        detailsSection.classList.add('hidden');
        detailsContainer.innerHTML = '';
        
        filmsSection.classList.remove('hidden');

        if (data.Response === "True") {
            renderMovies(data.Search);
            renderPagination(parseInt(data.totalResults));
        } else {
            // Якщо нічого не знайдено
            filmsContainer.innerHTML = '<h3 style="text-align: center; width: 100%;">Movie not found!</h3>';
            paginationContainer.innerHTML = '';
        }
    } catch (error) {
        console.error('Помилка запиту:', error);
        filmsContainer.innerHTML = '<p style="text-align: center; width: 100%;">Помилка завантаження даних.</p>';
    }
}

// Функція виведення карток фільмів
function renderMovies(movies) {
    filmsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title}">
            <div class="movie-info">
                <div>
                    <p>${movie.Type}</p>
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
                <button class="details-btn" onclick="getMovieDetails('${movie.imdbID}')">Details</button>
            </div>
        `;
        filmsContainer.appendChild(movieCard);
    });
}

// Функція виведення пагінації
function renderPagination(totalResults) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalResults / 10); 

    if (totalPages <= 1) return;

    // Межі кнопок
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 3);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        
        if (i === currentPage) {
            btn.disabled = true;
        }

        btn.addEventListener('click', () => {
            currentPage = i;
            searchMovies();
        });

        paginationContainer.appendChild(btn);
    }
}

// Функція отримання детальної інформації про 1 фільм
async function getMovieDetails(imdbID) {
    try {
        const url = `${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            renderDetails(data);
            detailsSection.classList.remove('hidden');
            detailsSection.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Помилка деталей:', error);
    }
}

// Виведення детальної інформації
function renderDetails(movie) {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
    
    detailsContainer.innerHTML = `
        <div class="details-wrapper">
            <img src="${posterUrl}" alt="${movie.Title}">
            <div class="details-text">
                <p><strong>Title:</strong> ${movie.Title}</p>
                <p><strong>Released:</strong> ${movie.Released}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Country:</strong> ${movie.Country}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Writer:</strong> ${movie.Writer}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Awards:</strong> ${movie.Awards}</p>
            </div>
        </div>
    `;
}
