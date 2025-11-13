// Variables globales
let allDestinations = [];
let filteredDestinations = [];

// Initialisation
async function initializeDestinationsPage() {
    await loadDestinationsData();
    setupEventListeners();
    displayDestinations(allDestinations);
}

// Chargement des données depuis le JSON
async function loadDestinationsData() {
    try {
        const response = await fetch('../destinations.json');
        if (!response.ok) throw new Error('Failed to load destinations data');
        
        const data = await response.json();
        allDestinations = data.destinations;
        filteredDestinations = [...allDestinations];
        
        console.log('✅ Destinations loaded:', allDestinations.length);
    } catch (error) {
        console.error('❌ Error loading destinations:', error);
        // Fallback manuel si le JSON ne charge pas
        loadFallbackDestinations();
    }
}

// Fallback si le JSON ne charge pas
function loadFallbackDestinations() {
    allDestinations = [
        {
            id: "moon",
            name: "The Moon",
            planet: "Earth's Moon",
            description: "Earth's closest celestial neighbor offers low-gravity adventures, stunning views of our home planet, and the historic Apollo landing sites.",
            travelDuration: "3 days",
            distance: "384,400 km",
            price: 25000,
            accommodations: ["standard", "luxury", "zero-g"]
        },
        {
            id: "mars",
            name: "Mars", 
            planet: "Mars",
            description: "The Red Planet awaits with its massive canyons, towering volcanoes, and mysterious past.",
            travelDuration: "7-9 months",
            distance: "54.6 million km",
            price: 150000,
            accommodations: ["standard", "luxury", "zero-g"]
        },
        {
            id: "europa",
            name: "Europa",
            planet: "Jupiter's Moon", 
            description: "Jupiter's icy moon hides a vast subsurface ocean that may harbor life.",
            travelDuration: "5-6 years",
            distance: "628.3 million km",
            price: 450000,
            accommodations: ["standard", "luxury"]
        },
        {
            id: "titan",
            name: "Titan",
            planet: "Saturn's Moon",
            description: "Saturn's largest moon features thick atmosphere, methane lakes, and complex organic chemistry.",
            travelDuration: "7 years", 
            distance: "1.2 billion km",
            price: 600000,
            accommodations: ["standard", "luxury"]
        },
        {
            id: "orbital-station",
            name: "Orbital Station",
            planet: "Low Earth Orbit",
            description: "Experience life in our luxurious orbital habitat with 360-degree views of Earth.",
            travelDuration: "2 days",
            distance: "400 km",
            price: 50000,
            accommodations: ["standard", "luxury", "zero-g"]
        },
        {
            id: "venus-clouds", 
            name: "Venus Cloud Cities",
            planet: "Venus",
            description: "Float among the clouds of Venus in our state-of-the-art cloud cities.",
            travelDuration: "5 months",
            distance: "41 million km", 
            price: 300000,
            accommodations: ["luxury", "zero-g"]
        }
    ];
    filteredDestinations = [...allDestinations];
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche en temps réel
    document.getElementById('search-input').addEventListener('input', applyFilters);
    
    // Filtres
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('price-filter').addEventListener('input', function() {
        document.getElementById('price-value').textContent = 
            parseInt(this.value).toLocaleString();
        applyFilters();
    });
    document.getElementById('duration-filter').addEventListener('change', applyFilters);
    
    // Reset des filtres
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// Application de tous les filtres
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedType = document.getElementById('type-filter').value;
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    const maxDuration = document.getElementById('duration-filter').value;
    
    filteredDestinations = allDestinations.filter(destination => {
        // Filtre de recherche
        const matchesSearch = searchTerm === '' || 
            destination.name.toLowerCase().includes(searchTerm) ||
            destination.description.toLowerCase().includes(searchTerm) ||
            destination.planet.toLowerCase().includes(searchTerm);
        
        // Filtre par type
        const matchesType = selectedType === 'all' || 
            (selectedType === 'planet' && !destination.planet.includes('Moon') && destination.planet !== 'Low Earth Orbit') ||
            (selectedType === 'moon' && destination.planet.includes('Moon')) ||
            (selectedType === 'station' && destination.planet === 'Low Earth Orbit');
        
        // Filtre par prix
        const matchesPrice = destination.price <= maxPrice;
        
        // Filtre par durée
        const matchesDuration = maxDuration === 'any' || checkDurationMatch(destination.travelDuration, maxDuration);
        
        return matchesSearch && matchesType && matchesPrice && matchesDuration;
    });
    
    displayDestinations(filteredDestinations);
    updateResultsCount();
}

// Vérification de la correspondance de durée
function checkDurationMatch(duration, maxDuration) {
    const durationMap = {
        '1 week': 7,
        '1 month': 30,
        '1 year': 365,
        '5 years': 1825
    };
    
    const destinationDays = parseDurationToDays(duration);
    const maxDays = durationMap[maxDuration];
    
    return destinationDays <= maxDays;
}

// Conversion de la durée en jours
function parseDurationToDays(duration) {
    if (duration.includes('days') || duration.includes('day')) {
        return parseInt(duration);
    } else if (duration.includes('months')) {
        return parseInt(duration) * 30;
    } else if (duration.includes('years')) {
        return parseInt(duration) * 365;
    }
    return 0;
}

// Réinitialisation des filtres
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('price-filter').value = 1000000;
    document.getElementById('price-value').textContent = '1,000,000';
    document.getElementById('duration-filter').value = 'any';
    
    filteredDestinations = [...allDestinations];
    displayDestinations(filteredDestinations);
    updateResultsCount();
}

// Affichage des destinations
function displayDestinations(destinations) {
    const container = document.getElementById('destinations-container');
    
    if (destinations.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-search text-6xl text-gray-500 mb-4"></i>
                <h3 class="text-2xl font-orbitron text-gray-300 mb-2">No destinations found</h3>
                <p class="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = destinations.map((destination, index) => `
        <div class="planet-card p-8 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="flex justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}">
                <div class="w-64 h-64 rounded-full ${getPlanetGradient(destination.id)} flex items-center justify-center glow">
                    <i class="${getPlanetIcon(destination.id)} text-white text-6xl"></i>
                </div>
            </div>
            <div class="${index % 2 === 1 ? 'lg:order-1' : ''}">
                <h2 class="font-orbitron text-3xl mb-4 text-glow">${destination.name}</h2>
                <p class="text-gray-300 mb-4 text-lg">${destination.description}</p>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-space-purple/50 p-4 rounded-lg">
                        <h4 class="font-orbitron text-neon-blue mb-2">Journey Time</h4>
                        <p class="text-gray-300">${destination.travelDuration}</p>
                    </div>
                    <div class="bg-space-purple/50 p-4 rounded-lg">
                        <h4 class="font-orbitron text-neon-blue mb-2">Distance</h4>
                        <p class="text-gray-300">${destination.distance}</p>
                    </div>
                    <div class="bg-space-purple/50 p-4 rounded-lg">
                        <h4 class="font-orbitron text-neon-blue mb-2">Price</h4>
                        <p class="text-gray-300">$${destination.price.toLocaleString()}</p>
                    </div>
                    <div class="bg-space-purple/50 p-4 rounded-lg">
                        <h4 class="font-orbitron text-neon-blue mb-2">Type</h4>
                        <p class="text-gray-300">${getDestinationType(destination)}</p>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="booking.html?destination=${destination.id}" class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-center">
                        Book ${destination.name} Journey
                    </a>
                    <a href="#" class="border border-neon-blue text-neon-blue px-6 py-3 rounded-lg font-bold text-center hover:bg-neon-blue/10 transition-colors">
                        View Gallery
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Mise à jour du compteur de résultats
function updateResultsCount() {
    const countElement = document.getElementById('results-count');
    const total = allDestinations.length;
    const showing = filteredDestinations.length;
    
    if (showing === total) {
        countElement.textContent = `Showing all ${total} destinations`;
    } else {
        countElement.textContent = `Showing ${showing} of ${total} destinations`;
    }
}

// Helper functions
function getPlanetGradient(planetId) {
    const gradients = {
        'moon': 'bg-gradient-to-r from-gray-400 to-gray-200',
        'mars': 'bg-gradient-to-r from-red-500 to-orange-500',
        'europa': 'bg-gradient-to-r from-blue-300 to-blue-500',
        'titan': 'bg-gradient-to-r from-orange-400 to-yellow-500',
        'orbital-station': 'bg-gradient-to-r from-purple-400 to-pink-500',
        'venus-clouds': 'bg-gradient-to-r from-yellow-400 to-orange-300'
    };
    return gradients[planetId] || 'bg-gradient-to-r from-gray-400 to-gray-600';
}

function getPlanetIcon(planetId) {
    const icons = {
        'moon': 'fas fa-moon',
        'mars': 'fas fa-globe-americas',
        'europa': 'fas fa-snowflake',
        'titan': 'fas fa-ring',
        'orbital-station': 'fas fa-satellite',
        'venus-clouds': 'fas fa-cloud'
    };
    return icons[planetId] || 'fas fa-globe';
}

function getDestinationType(destination) {
    if (destination.planet.includes('Moon')) return 'Moon';
    if (destination.planet === 'Low Earth Orbit') return 'Space Station';
    return 'Planet';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initializeDestinationsPage();
});