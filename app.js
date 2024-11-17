document.addEventListener('DOMContentLoaded', function () {
    const animeContainer = document.getElementById('anime-list');
    const watchlistContainer = document.getElementById('watchlist');
    const searchInput = document.getElementById('search-input');
    const loginButton = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const loginError = document.getElementById('login-error');
    const mainPage = document.getElementById('main-page');
    const loginPage = document.getElementById('login-page');
    const logoutButton = document.getElementById('logout-btn');
    const viewAnimeListButton = document.getElementById('view-anime-list');
    const viewWatchlistButton = document.getElementById('view-watchlist');
    const animeListPage = document.getElementById('anime-list-page');
    const watchlistPage = document.getElementById('watchlist-page');
    
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    let currentUser = localStorage.getItem('currentUser');

    // Only allow 'Sudam Halder' as the username
    const allowedUser = 'Sudam Halder';

    // Check if user is logged in
    if (currentUser === allowedUser) {
        showMainPage();
    } else {
        showLoginPage();
    }

    // Handle login
    loginButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        if (username === allowedUser) {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            showMainPage();
        } else {
            loginError.textContent = "Invalid username. Only 'Sudam Halder' is allowed.";
        }
    });

    // Show the main page after login
    function showMainPage() {
        loginPage.style.display = 'none';
        mainPage.style.display = 'block';
        displayAnimeList();
        displayWatchlist();
    }

    // Show the login page
    function showLoginPage() {
        loginPage.style.display = 'block';
        mainPage.style.display = 'none';
    }

    // Handle logout
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        currentUser = null;
        showLoginPage();
    });

    // Fetch anime data
    async function fetchAnimeData(query = '') {
        const apiUrl = query
            ? `https://api.jikan.moe/v4/anime?q=${query}&limit=12`
            : 'https://api.jikan.moe/v4/top/anime';
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayAnimeList(data.data);
        } catch (error) {
            console.error('Error fetching anime data:', error);
        }
    }

    // Display anime list
    function displayAnimeList(animeList = []) {
        animeContainer.innerHTML = ''; // Clear current list
        animeList.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <button class="add-to-watchlist" data-id="${anime.mal_id}">Add to Watchlist</button>
            `;
            animeCard.querySelector('.add-to-watchlist').addEventListener('click', function () {
                addToWatchlist(anime, this);
            });
            animeContainer.appendChild(animeCard);
        });
    }

    // Add anime to the watchlist and update button
    function addToWatchlist(anime, button) {
        if (!watchlist.some(item => item.mal_id === anime.mal_id)) {
            // Add to watchlist
            watchlist.push(anime);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            displayWatchlist();
        }

        // Update the button to show a red checkmark and disable it
        button.innerHTML = '✔';
        button.style.color = 'red';
        button.disabled = true;
    }

    // Display the watchlist
    function displayWatchlist() {
        watchlistContainer.innerHTML = '';
        watchlist.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <button class="remove-from-watchlist" data-id="${anime.mal_id}">Remove</button>
            `;
            animeCard.querySelector('.remove-from-watchlist').addEventListener('click', function () {
                removeFromWatchlist(anime.mal_id);
            });
            watchlistContainer.appendChild(animeCard);
        });
    }

    // Remove anime from the watchlist
    function removeFromWatchlist(malId) {
        watchlist = watchlist.filter(anime => anime.mal_id !== malId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        displayWatchlist();
    }

    // Handle search input
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        fetchAnimeData(query);
    });

    // Show anime list page
    viewAnimeListButton.addEventListener('click', function () {
        animeListPage.style.display = 'block';
        watchlistPage.style.display = 'none';
        displayAnimeList();
    });

    // Show watchlist page
    viewWatchlistButton.addEventListener('click', function () {
        animeListPage.style.display = 'none';
        watchlistPage.style.display = 'block';
        displayWatchlist();
    });

    // Initial fetch of top anime
    fetchAnimeData();
});
