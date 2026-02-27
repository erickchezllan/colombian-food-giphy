// Giphy API Configuration
const API_KEY = '0rAeLFYe8Z7jHr69qNePf9jaOH3UE8ni'; // Replace with your Giphy API key
const API_URL = 'https://api.giphy.com/v1/gifs/search';
const MAX_GIFS = 12;

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const giphyGrid = document.getElementById('giphyGrid');
const resultsSection = document.getElementById('resultsSection');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

// Default search on page load
document.addEventListener('DOMContentLoaded', () => {
    searchInput.value = 'arepas';
    handleSearch({ preventDefault: () => {} });
});

async function handleSearch(e) {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term!');
        return;
    }

    // Show loading
    giphyGrid.innerHTML = '<div class="loading">🔍 Searching Colombian food GIFs...</div>';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    try {
        const gifs = await fetchGiphyData(query);
        displayGifs(gifs);
    } catch (error) {
        console.error('Search error:', error);
        giphyGrid.innerHTML = '<div class="error">❌ Oops! No GIFs found. Try "arepas" or "empanadas"!</div>';
    }
}

async function fetchGiphyData(query) {
    const url = `${API_URL}?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${MAX_GIFS}&offset=0&rating=g&lang=en`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Giphy API error');
    }
    
    const data = await response.json();
    return data.data;
}

function displayGifs(gifs) {
    if (gifs.length === 0) {
        giphyGrid.innerHTML = '<div class="no-results">No Colombian food GIFs found! 😢</div>';
        return;
    }

    giphyGrid.innerHTML = gifs.map(gif => `
        <div class="giphy-item">
            <img src="${gif.images.fixed_height.url}" 
                 alt="${gif.title}" 
                 loading="lazy">
            <div class="gif-info">
                <small>${gif.title.substring(0, 50)}${gif.title.length > 50 ? '...' : ''}</small>
            </div>
        </div>
    `).join('');
}
