// Global variables
let accommodationsData = [];
let destinationsData = [];
let passengerCount = 1;
let maxPassengers = 1;
let currentPrices = {
    destination: 0,
    accommodation: 0,
    extras: 0
};

// 1. INITIALISATION - PAS de vérification d'authentification pour l'accès
function initializePage() {
    console.log("🚀 Initialisation page booking...");
    
    createStarsBackground();
    setupMobileNavigation();
    setupBasicEventListeners();
    
    loadAllData();
    updateBookingButtonState(); // Mettre à jour l'état du bouton
    setupAuthMonitoring(); // Surveiller les changements de connexion
}

function checkAuthentication() {
    try {
        const session = (typeof getUserSession === 'function') 
            ? getUserSession() 
            : JSON.parse(localStorage.getItem('userSession') || 'null');
        return !!(session && session.isLoggedIn);
    } catch (e) {
        return false;
    }
}

// 2. METTRE À JOUR L'ÉTAT DU BOUTON DE RÉSERVATION
function updateBookingButtonState() {
    const submitButton = document.querySelector('#booking-form button[type="submit"]');
    
    const isLoggedIn = checkAuthentication();
    
    if (submitButton) {
        if (isLoggedIn) {
            // Utilisateur connecté - bouton actif
            submitButton.innerHTML = '<i class="fas fa-rocket mr-2"></i>Confirm Booking';
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            submitButton.classList.add('hover:bg-neon-cyan', 'cursor-pointer');
        } else {
            // Utilisateur non connecté - bouton désactivé
            submitButton.innerHTML = '<i class="fas fa-lock mr-2"></i>Login to Book';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            submitButton.classList.remove('hover:bg-neon-cyan', 'cursor-pointer');
        }
    }
}

// 3. MONITORER LES CHANGEMENTS DE CONNEXION
function setupAuthMonitoring() {
    // Vérifier l'état de connexion périodiquement
    setInterval(updateBookingButtonState, 2000);
    
    // Écouter les événements de stockage (connexion/déconnexion depuis d'autres onglets)
    window.addEventListener('storage', function(e) {
        if (e.key === 'userSession') {
            updateBookingButtonState();
        }
    });
}

// 4. GESTION DE LA SOUMISSION AVEC REDIRECTION SI NON CONNECTÉ
function handleFormSubmission(event) {
    event.preventDefault();
    
    // Vérifier si l'utilisateur est connecté
    if (!checkAuthentication()) {
        // Rediriger vers la page de connexion avec retour vers cette page
        const currentUrl = window.location.href;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`;
        return;
    }
    
    // Si connecté, valider et traiter la réservation
    if (!validateFullForm()) {
        alert('Please correct the errors in the form before submitting.');
        return;
    }
    
    const session = (typeof getUserSession === 'function') 
        ? getUserSession() 
        : JSON.parse(localStorage.getItem('userSession') || 'null');
    
    saveBooking(session);
}

function createStarsBackground() {
    const container = document.getElementById("stars-container");
    if (!container) return;
    
    const starCount = 150;
    container.innerHTML = '';

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(star);
    }
}

function setupMobileNavigation() {
    const menuButton = document.getElementById("mobile-menu-button");
    const menu = document.getElementById("mobile-menu");
    
    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }
}

function setupBasicEventListeners() {
    const bookingForm = document.getElementById("booking-form");
    const addPassengerBtn = document.getElementById("add-passenger-btn");
    
    if (bookingForm) {
        bookingForm.addEventListener("submit", handleFormSubmission);
    }
    
    if (addPassengerBtn) {
        addPassengerBtn.addEventListener("click", addPassengerForm);
    }
    
    setupPassengerTypeListeners();
    setupPriceCalculationListeners();
}

// 5. CHARGEMENT DES DONNÉES
async function loadAllData() {
    try {
        await Promise.all([
            loadDestinations(),
            loadAccommodations()
        ]);
        console.log("✅ Toutes les données chargées");
    } catch (error) {
        console.error("Erreur chargement:", error);
        loadFallbackData();
    }
}

async function loadDestinations() {
    try {
        const response = await fetch("../destinations.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        destinationsData = data.destinations;
        populateDestinationSelect();
        
    } catch (error) {
        console.error("Erreur destinations:", error);
        throw error;
    }
}

async function loadAccommodations() {
    try {
        const response = await fetch("../accommodations.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        accommodationsData = data.accommodations;
        console.log("Accommodations chargés:", accommodationsData.length);
        
    } catch (error) {
        console.error("Erreur accommodations:", error);
        throw error;
    }
}

function loadFallbackData() {
    console.log("🔄 Chargement des données de secours...");
    
    destinationsData = [
        {
            id: "moon",
            name: "The Moon",
            travelDuration: "3 days",
            price: 25000,
            currency: "USD",
            description: "Earth's closest celestial neighbor offers low-gravity adventures and stunning views of our home planet.",
            distance: "384,400 km",
            gravity: "1.62 m/s² (16.6% of Earth)",
            temperature: "-173°C to 127°C",
            accommodations: ["standard", "luxury", "zero-g"]
        },
        {
            id: "mars", 
            name: "Mars",
            travelDuration: "7-9 months", 
            price: 150000,
            currency: "USD",
            description: "The Red Planet awaits with its massive canyons and towering volcanoes.",
            distance: "54.6 million km",
            gravity: "3.71 m/s² (38% of Earth)", 
            temperature: "-87°C to -5°C",
            accommodations: ["standard", "luxury", "zero-g"]
        }
    ];
    
    accommodationsData = [
        {
            id: "standard",
            name: "Standard Cabin",
            shortDescription: "Comfortable private quarters with basic amenities",
            size: "3 square meters", 
            occupancy: 1,
            pricePerDay: 500
        },
        {
            id: "luxury",
            name: "Luxury Suite", 
            shortDescription: "Spacious suite with premium amenities and viewports",
            size: "6 square meters",
            occupancy: 2,
            pricePerDay: 1200
        },
        {
            id: "zero-g", 
            name: "Zero-G Pod",
            shortDescription: "Advanced accommodation with zero-gravity experience",
            size: "4 square meters",
            occupancy: 1, 
            pricePerDay: 2000
        }
    ];
    
    populateDestinationSelect();
}

// 6. DESTINATIONS
function populateDestinationSelect() {
    const destinationSelect = document.getElementById("destination");
    if (!destinationSelect) {
        console.error("❌ Element destination non trouvé!");
        return;
    }

    while (destinationSelect.children.length > 1) {
        destinationSelect.removeChild(destinationSelect.lastChild);
    }

    destinationsData.forEach((dest) => {
        const option = document.createElement("option");
        option.value = dest.id;
        option.textContent = `${dest.name} - ${dest.travelDuration} - From $${dest.price.toLocaleString()}`;
        option.setAttribute("data-destination", JSON.stringify(dest));
        destinationSelect.appendChild(option);
    });

    console.log(`✅ ${destinationsData.length} destinations ajoutées`);

    destinationSelect.addEventListener("change", function () {
        const selectedOption = this.options[this.selectedIndex];
        const destinationInfo = document.getElementById("destination-info");
        const accommodationsSection = document.getElementById("accommodations-section");

        if (selectedOption.value) {
            const dest = JSON.parse(selectedOption.getAttribute("data-destination"));

            document.getElementById("destination-name").textContent = dest.name;
            document.getElementById("destination-description").textContent = dest.description;
            document.getElementById("destination-duration").textContent = dest.travelDuration;
            document.getElementById("destination-distance").textContent = dest.distance;
            document.getElementById("destination-gravity").textContent = dest.gravity;
            document.getElementById("destination-temperature").textContent = dest.temperature;
            document.getElementById("destination-price").textContent = `$${dest.price.toLocaleString()} ${dest.currency}`;

            destinationInfo.classList.remove("hidden");
            showAccommodationsForDestination(dest);
            accommodationsSection.classList.add("visible");
            
            currentPrices.destination = dest.price;
            updatePriceCalculation();
        } else {
            destinationInfo.classList.add("hidden");
            accommodationsSection.classList.remove("visible");
            currentPrices.destination = 0;
            updatePriceCalculation();
        }
    });
}

function showAccommodationsForDestination(destination) {
    const accommodationsContainer = document.getElementById("accommodations-container");
    const accommodationInput = document.getElementById("accommodation");

    if (!accommodationsContainer) return;

    accommodationsContainer.innerHTML = "";

    const availableAccommodations = accommodationsData.filter((acc) =>
        destination.accommodations.includes(acc.id)
    );

    availableAccommodations.forEach((acc, index) => {
        const card = document.createElement("div");
        card.className = `accommodation-card ${index === 0 ? "selected" : ""}`;
        card.dataset.type = acc.id;
        card.dataset.price = acc.pricePerDay;

        card.innerHTML = `
            <h3 class="font-orbitron text-neon-blue mb-2">${acc.name}</h3>
            <p class="text-sm text-gray-400">${acc.shortDescription}</p>
            <div class="mt-3 text-xs text-gray-500">
                <div class="flex justify-between mb-1">
                    <span>Size:</span>
                    <span>${acc.size}</span>
                </div>
                <div class="flex justify-between mb-1">
                    <span>Occupancy:</span>
                    <span>${acc.occupancy}</span>
                </div>
                <div class="flex justify-between">
                    <span>Price:</span>
                    <span class="font-bold text-neon-cyan">$${acc.pricePerDay}/day</span>
                </div>
            </div>
        `;

        accommodationsContainer.appendChild(card);
    });

    if (availableAccommodations.length > 0) {
        accommodationInput.value = availableAccommodations[0].id;
        currentPrices.accommodation = availableAccommodations[0].pricePerDay;
    }

    setupAccommodationCardSelection();
    updatePriceCalculation();
}

function setupAccommodationCardSelection() {
    const accommodationCards = document.querySelectorAll(".accommodation-card");
    const accommodationInput = document.getElementById("accommodation");

    accommodationCards.forEach((card) => {
        card.addEventListener("click", function () {
            accommodationCards.forEach((c) => c.classList.remove("selected"));
            this.classList.add("selected");
            accommodationInput.value = this.dataset.type;
            currentPrices.accommodation = parseInt(this.dataset.price) || 0;
            updatePriceCalculation();
        });
    });
}

// 7. GESTION DES PASSAGERS
function setupPassengerTypeListeners() {
    const passengerRadios = document.querySelectorAll('input[name="passengers"]');
    
    passengerRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updatePassengerConfiguration();
            updatePriceCalculation();
        });
    });
}

function updatePassengerConfiguration() {
    const selectedType = getSelectedPassengerType();
    
    switch(selectedType) {
        case 'solo':
            maxPassengers = 1;
            break;
        case 'couple':
            maxPassengers = 2;
            break;
        case 'group':
            maxPassengers = 6;
            break;
        default:
            maxPassengers = 1;
    }
    
    updatePassengerInterface();
    adjustPassengerFormsToLimit();
}

function getSelectedPassengerType() {
    const selected = document.querySelector('input[name="passengers"]:checked');
    return selected ? selected.value : 'solo';
}

function updatePassengerInterface() {
    const addButton = document.getElementById('add-passenger-btn');
    
    if (!addButton) return;
    
    if (getSelectedPassengerType() === 'solo') {
        addButton.style.display = 'none';
    } else {
        addButton.style.display = 'block';
        addButton.textContent = `Add Passenger (${passengerCount}/${maxPassengers})`;
    }
}

function adjustPassengerFormsToLimit() {
    const existingForms = document.querySelectorAll('.passenger-form');
    
    if (existingForms.length > maxPassengers) {
        for (let i = existingForms.length - 1; i >= maxPassengers; i--) {
            existingForms[i].remove();
        }
        passengerCount = maxPassengers;
    }
    
    updatePassengerInterface();
}

function addPassengerForm() {
    if (passengerCount >= maxPassengers) {
        showMaxPassengersModal();
        return;
    }
    
    passengerCount++;
    const container = document.getElementById('passenger-forms-container');
    const newForm = createPassengerForm(passengerCount);
    
    container.appendChild(newForm);
    setupInputValidationForForm(newForm);
    updatePassengerInterface();
    updatePriceCalculation();
}

function createPassengerForm(index) {
    const form = document.createElement('div');
    form.className = 'passenger-form';
    form.id = `passenger-form-${index}`;
    
    form.innerHTML = `
        <div class="passenger-header">
            <h3 class="font-orbitron text-neon-blue">
                ${index === 1 ? 'Primary Passenger' : `Passenger ${index}`}
            </h3>
            ${index > 1 ? `
                <div class="remove-passenger" onclick="removePassengerForm(${index})">
                    <i class="fas fa-times"></i>
                </div>
            ` : ''}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label class="block mb-2 text-gray-300">First Name</label>
                <input type="text" name="first-name[]" placeholder="Enter first name" required 
                       data-validation="name">
                <div class="error-message" data-error="first-name"></div>
            </div>
            
            <div>
                <label class="block mb-2 text-gray-300">Last Name</label>
                <input type="text" name="last-name[]" placeholder="Enter last name" required 
                       data-validation="name">
                <div class="error-message" data-error="last-name"></div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label class="block mb-2 text-gray-300">Email Address</label>
                <input type="email" name="email[]" placeholder="Enter email" required 
                       data-validation="email">
                <div class="error-message" data-error="email"></div>
            </div>
            
            <div>
                <label class="block mb-2 text-gray-300">Phone Number</label>
                <input type="tel" name="phone[]" placeholder="Enter phone number" required 
                       data-validation="phone">
                <div class="error-message" data-error="phone"></div>
            </div>
        </div>
        
        <div class="mb-6">
            <label class="block mb-2 text-gray-300">Special Requirements</label>
            <textarea name="special-requirements[]" rows="4" placeholder="Any special requirements or notes..."></textarea>
        </div>
    `;
    
    return form;
}

function removePassengerForm(index) {
    const formToRemove = document.getElementById(`passenger-form-${index}`);
    if (!formToRemove) return;
    
    formToRemove.remove();
    passengerCount--;
    renumberPassengerForms();
    updatePassengerInterface();
    updatePriceCalculation();
}

function renumberPassengerForms() {
    const forms = document.querySelectorAll('.passenger-form');
    
    forms.forEach((form, index) => {
        const newIndex = index + 1;
        form.id = `passenger-form-${newIndex}`;
        
        const header = form.querySelector('.passenger-header h3');
        header.textContent = newIndex === 1 ? 'Primary Passenger' : `Passenger ${newIndex}`;
        
        const removeBtn = form.querySelector('.remove-passenger');
        if (removeBtn) {
            removeBtn.setAttribute('onclick', `removePassengerForm(${newIndex})`);
        }
    });
}

function showMaxPassengersModal() {
    alert(`Maximum number of passengers reached (${maxPassengers}) for ${getSelectedPassengerType()} travel.`);
}

// 8. CALCUL DES PRIX
function setupPriceCalculationListeners() {
    document.querySelectorAll('input[name="extras"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePriceCalculation);
    });
}

function updatePriceCalculation() {
    currentPrices.extras = calculateExtrasTotal();
    
    const passengerCount = getPassengerCount();
    const basePrice = currentPrices.destination + currentPrices.accommodation;
    const totalBeforeExtras = basePrice * passengerCount;
    const finalTotal = totalBeforeExtras + currentPrices.extras;
    
    updatePriceDisplay(basePrice, passengerCount, finalTotal);
    document.getElementById('totalPrice').value = finalTotal;
}

function calculateExtrasTotal() {
    let total = 0;
    const extrasContainer = document.getElementById('extras-breakdown');
    
    if (!extrasContainer) return 0;
    
    extrasContainer.innerHTML = '';
    
    document.querySelectorAll('input[name="extras"]:checked').forEach(extra => {
        const price = parseInt(extra.getAttribute('data-price')) || 0;
        total += price;
        
        const extraElement = document.createElement('div');
        extraElement.className = 'flex justify-between text-neon-cyan text-sm';
        extraElement.innerHTML = `
            <span>${getExtraDisplayName(extra.value)}:</span>
            <span>+$${price.toLocaleString()}</span>
        `;
        extrasContainer.appendChild(extraElement);
    });
    
    return total;
}

function getPassengerCount() {
    const type = getSelectedPassengerType();
    switch(type) {
        case 'solo': return 1;
        case 'couple': return 2;
        case 'group': return Math.max(3, passengerCount);
        default: return 1;
    }
}

function getExtraDisplayName(extraId) {
    const names = {
        'insurance': 'Travel Insurance',
        'photo': 'Photo Pack', 
        'training': 'VIP Training',
        'souvenir': 'Souvenir Pack'
    };
    return names[extraId] || extraId;
}

function updatePriceDisplay(basePrice, passengerCount, finalTotal) {
    const basePriceElement = document.getElementById('base-price');
    const accommodationPriceElement = document.getElementById('accommodation-price');
    const passengersCountElement = document.getElementById('passengers-count');
    const totalPriceElement = document.getElementById('total-price');
    
    if (basePriceElement) basePriceElement.textContent = `$${currentPrices.destination.toLocaleString()}`;
    if (accommodationPriceElement) accommodationPriceElement.textContent = `$${currentPrices.accommodation.toLocaleString()}`;
    if (passengersCountElement) passengersCountElement.textContent = `${passengerCount} × $${basePrice.toLocaleString()}`;
    if (totalPriceElement) totalPriceElement.textContent = `$${finalTotal.toLocaleString()}`;
}

// 9. VALIDATION
function setupInputValidation() {
    const validatedInputs = document.querySelectorAll('input[data-validation]');
    
    validatedInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleInput(this);
        });
        
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
}

function setupInputValidationForForm(form) {
    const inputs = form.querySelectorAll('input[data-validation]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleInput(this);
        });
        
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
}

function validateSingleInput(input) {
    const value = input.value.trim();
    const validationType = input.getAttribute('data-validation');
    
    if (!value) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    let isValid = true;
    let errorMessage = '';
    
    switch(validationType) {
        case 'name':
            isValid = /^[a-zA-Z\s]{2,50}$/.test(value);
            errorMessage = 'Please enter a valid name (2-50 characters, letters only)';
            break;
            
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
            
        case 'phone':
            isValid = /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''));
            errorMessage = 'Please enter a valid phone number';
            break;
    }
    
    if (!isValid) {
        showInputError(input, errorMessage);
        return false;
    } else {
        showInputSuccess(input);
        return true;
    }
}

function showInputError(input, message) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    input.classList.add('input-error');
    input.classList.remove('input-success');
}

function showInputSuccess(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    input.classList.remove('input-error');
    input.classList.add('input-success');
}

function clearInputError(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    input.classList.remove('input-error');
}

function validateFullForm() {
    let isValid = true;
    
    const mainFields = [
        { id: 'destination', message: 'Please select a destination' },
        { id: 'departure-date', message: 'Please select a departure date' },
        { id: 'accommodation', message: 'Please select an accommodation type' }
    ];
    
    mainFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value) {
            showError(field.id + '-error', field.message);
            isValid = false;
        } else {
            clearError(field.id + '-error');
        }
    });
    
    const departureDate = document.getElementById('departure-date');
    if (departureDate && departureDate.value) {
        const selectedDate = new Date(departureDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError('departure-date-error', 'Departure date must be today or in the future');
            isValid = false;
        }
    }
    
    const passengerForms = document.querySelectorAll('.passenger-form');
    passengerForms.forEach(form => {
        const inputs = form.querySelectorAll('input[data-validation]');
        inputs.forEach(input => {
            if (!validateSingleInput(input)) {
                isValid = false;
            }
        });
    });
    
    return isValid;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// 10. SAUVEGARDE DE LA RÉSERVATION
function saveBooking(userSession) {
    const bookingData = collectBookingData(userSession);
    
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    allBookings.push(bookingData);
    localStorage.setItem('userBookings', JSON.stringify(allBookings));
    
    clearFormData();
    showBookingConfirmation(bookingData);
}

function collectBookingData(session) {
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departure-date').value;
    const accommodation = document.getElementById('accommodation').value;
    const totalPrice = document.getElementById('totalPrice').value;
    
    const passengers = [];
    document.querySelectorAll('.passenger-form').forEach(form => {
        passengers.push({
            firstName: form.querySelector('input[name="first-name[]"]').value,
            lastName: form.querySelector('input[name="last-name[]"]').value,
            email: form.querySelector('input[name="email[]"]').value,
            phone: form.querySelector('input[name="phone[]"]').value,
            specialRequirements: form.querySelector('textarea[name="special-requirements[]"]')?.value || ''
        });
    });
    
    const selectedExtras = [];
    document.querySelectorAll('input[name="extras"]:checked').forEach(extra => {
        selectedExtras.push({
            id: extra.value,
            name: getExtraDisplayName(extra.value),
            price: parseInt(extra.getAttribute('data-price')) || 0
        });
    });
    
    return {
        id: 'bk_' + Date.now(),
        userId: session.userId || session.email,
        userName: session.name || session.email,
        destination,
        departureDate,
        accommodation,
        passengers,
        totalPrice: parseInt(totalPrice),
        extras: selectedExtras,
        status: 'confirmed',
        timestamp: new Date().toISOString()
    };
}

function showBookingConfirmation(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-space-dark border border-neon-blue rounded-lg p-6 max-w-md mx-4">
            <h2 class="font-orbitron text-neon-green text-xl mb-4">🚀 Booking Confirmed!</h2>
            <p class="text-gray-300 mb-4">Your space journey to ${bookingData.destination} has been booked successfully!</p>
            <p class="text-neon-cyan mb-4">Total: $${bookingData.totalPrice.toLocaleString()}</p>
            <button onclick="redirectToBookings()" class="w-full bg-neon-blue text-space-dark py-2 rounded-lg font-bold hover:bg-neon-cyan transition-colors">
                View My Bookings
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function redirectToBookings() {
    window.location.href = 'my-bookings.html';
}

function clearFormData() {
    localStorage.removeItem('bookingFormData');
}

// 11. INITIALISATION FINALE
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    setTimeout(() => {
        setupInputValidation();
    }, 1000);
});