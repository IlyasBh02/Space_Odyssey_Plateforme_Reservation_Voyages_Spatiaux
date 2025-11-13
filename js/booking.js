// Global variables to store data
let accommodationsData = [];
let destinationsData = [];
let passengerCount = 1; // Start with 1 (primary passenger)
let maxPassengers = 1; // Will be set based on selection

// Create stars background
function createStars() {
    const container = document.getElementById("stars-container");
    const starCount = 150;

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

// Mobile menu toggle
function setupMobileMenu() {
    document.getElementById("mobile-menu-button").addEventListener("click", function () {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("open");
    });
}

// Accommodation card selection
function setupAccommodationCardSelection() {
    const accommodationCards = document.querySelectorAll(".accommodation-card");
    const accommodationInput = document.getElementById("accommodation");

    accommodationCards.forEach((card) => {
        card.addEventListener("click", function () {
            accommodationCards.forEach((c) => c.classList.remove("selected"));
            this.classList.add("selected");
            accommodationInput.value = this.dataset.type;
            clearError("accommodation-error");
        });
    });
}

// Form validation functions
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
}

function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

// Show error message
function showError(input, message) {
    const errorElement = input.parentNode.querySelector(".error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
    input.classList.add("input-error");
    input.classList.remove("input-success");
}

// Clear error message
function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

// Show success state
function showSuccess(input) {
    const errorElement = input.parentNode.querySelector(".error-message");
    errorElement.style.display = "none";
    input.classList.remove("input-error");
    input.classList.add("input-success");
}

// Validate input on blur
function setupInputValidation() {
    const inputs = document.querySelectorAll("input[data-validation]");

    inputs.forEach((input) => {
        input.addEventListener("blur", function () {
            validateInput(this);
        });

        input.addEventListener("input", function () {
            // Clear error as user types
            if (this.value.trim() !== "") {
                const errorElement = this.parentNode.querySelector(".error-message");
                errorElement.style.display = "none";
                this.classList.remove("input-error");
            }
        });
    });
}

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    const validationType = input.getAttribute("data-validation");

    if (value === "") {
        showError(input, "This field is required");
        return false;
    }

    let isValid = false;
    let errorMessage = "";

    switch (validationType) {
        case "name":
            isValid = validateName(value);
            errorMessage = "Please enter a valid name (2-50 characters, letters only)";
            break;
        case "email":
            isValid = validateEmail(value);
            errorMessage = "Please enter a valid email address";
            break;
        case "phone":
            isValid = validatePhone(value);
            errorMessage = "Please enter a valid phone number";
            break;
    }

    if (!isValid) {
        showError(input, errorMessage);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;

    // Validate destination
    const destination = document.getElementById("destination");
    if (destination.value === "") {
        showError(destination, "Please select a destination");
        isValid = false;
    } else {
        clearError("destination-error");
    }

    // Validate departure date
    const departureDate = document.getElementById("departure-date");
    if (departureDate.value === "") {
        showError(departureDate, "Please select a departure date");
        isValid = false;
    } else if (!validateDate(departureDate.value)) {
        showError(departureDate, "Departure date must be today or in the future");
        isValid = false;
    } else {
        clearError("departure-date-error");
    }

    // Validate accommodation
    const accommodation = document.getElementById("accommodation");
    if (accommodation.value === "") {
        showError(accommodation, "Please select an accommodation type");
        isValid = false;
    } else {
        clearError("accommodation-error");
    }

    // Validate passenger forms
    const passengerForms = document.querySelectorAll(".passenger-form");
    passengerForms.forEach((form, index) => {
        const firstName = form.querySelector('input[name="first-name[]"]');
        const lastName = form.querySelector('input[name="last-name[]"]');
        const email = form.querySelector('input[name="email[]"]');
        const phone = form.querySelector('input[name="phone[]"]');

        if (!validateInput(firstName)) isValid = false;
        if (!validateInput(lastName)) isValid = false;
        if (!validateInput(email)) isValid = false;
        if (!validateInput(phone)) isValid = false;
    });

    return isValid;
}

// Form submission
function setupFormSubmission() {
    document.getElementById("booking-form").addEventListener("submit", function (e) {
        e.preventDefault();

        // Ensure user is logged in
        let session = null;
        try {
            session = (typeof getUserSession === 'function') ? getUserSession() : JSON.parse(localStorage.getItem('userSession') || 'null');
        } catch (err) {
            session = null;
        }

        if (!session || !session.isLoggedIn) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }

        if (validateForm()) {
            // gather booking data
            const destination = document.getElementById('destination').value;
            const departureDate = document.getElementById('departure-date').value;
            const accommodation = document.getElementById('accommodation').value;

            const passengerForms = document.querySelectorAll('.passenger-form');
            const passengers = [];
            passengerForms.forEach((form) => {
                passengers.push({
                    firstName: form.querySelector('input[name="first-name[]"]').value || '',
                    lastName: form.querySelector('input[name="last-name[]"]').value || '',
                    email: form.querySelector('input[name="email[]"]').value || '',
                    phone: form.querySelector('input[name="phone[]"]').value || '',
                    specialRequirements: form.querySelector('textarea[name="special-requirements[]"]')?.value || ''
                });
            });

            const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            const booking = {
                id: 'bk_' + Date.now(),
                userId: session.userId || session.email,
                userName: session.name || session.email,
                destination,
                departureDate,
                accommodation,
                passengers,
                timestamp: new Date().toISOString(),
            };

            allBookings.push(booking);
            localStorage.setItem('userBookings', JSON.stringify(allBookings));

            // Clear saved form data and redirect to My Bookings
            clearFormData();
            window.location.href = 'my-bookings.html';
        }
    });
}

// Get passenger type based on selection
function getPassengerType() {
    const selected = document.querySelector('input[name="passengers"]:checked');
    return selected ? selected.value : "solo";
}

// Update max passengers based on selection
function updateMaxPassengers() {
    const passengerType = getPassengerType();

    switch (passengerType) {
        case "solo":
            maxPassengers = 1;
            break;
        case "couple":
            maxPassengers = 2;
            break;
        case "group":
            maxPassengers = 6;
            break;
    }

    // Update button text
    const addButton = document.getElementById("add-passenger-btn");
    if (passengerType === "solo") {
        addButton.style.display = "none";
    } else {
        addButton.style.display = "block";
        addButton.textContent = `Add Passenger`;
    }

    // Remove extra forms if needed
    const passengerForms = document.querySelectorAll(".passenger-form");
    if (passengerForms.length > maxPassengers) {
        for (let i = passengerForms.length - 1; i >= maxPassengers; i--) {
            passengerForms[i].remove();
        }
        passengerCount = maxPassengers;
    }
}

// Add passenger form
function addPassengerForm() {
    if (passengerCount < maxPassengers) {
        passengerCount++;

        const container = document.getElementById("passenger-forms-container");
        const newForm = document.createElement("div");
        newForm.className = "passenger-form";
        newForm.id = `passenger-form-${passengerCount}`;

        newForm.innerHTML = `
            <div class="passenger-header">
                <h3 class="font-orbitron text-neon-blue">Passenger ${passengerCount}</h3>
                <div class="remove-passenger" data-index="${passengerCount}">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- First Name -->
                <div>
                    <label class="block mb-2 text-gray-300">First Name</label>
                    <input
                        type="text"
                        name="first-name[]"
                        placeholder="Enter passenger first name"
                        required
                        data-validation="name"
                    />
                    <div class="error-message" data-error="first-name"></div>
                </div>

                <!-- Last Name -->
                <div>
                    <label class="block mb-2 text-gray-300">Last Name</label>
                    <input
                        type="text"
                        name="last-name[]"
                        placeholder="Enter passenger last name"
                        required
                        data-validation="name"
                    />
                    <div class="error-message" data-error="last-name"></div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Email -->
                <div>
                    <label class="block mb-2 text-gray-300">Email Address</label>
                    <input
                        type="email"
                        name="email[]"
                        placeholder="Enter passenger email"
                        required
                        data-validation="email"
                    />
                    <div class="error-message" data-error="email"></div>
                </div>

                <!-- Phone -->
                <div>
                    <label class="block mb-2 text-gray-300">Phone Number</label>
                    <input
                        type="tel"
                        name="phone[]"
                        placeholder="Enter passenger phone number"
                        required
                        data-validation="phone"
                    />
                    <div class="error-message" data-error="phone"></div>
                </div>
            </div>

            <!-- Special Requirements -->
            <div class="mb-6">
                <label class="block mb-2 text-gray-300">Special Requirements</label>
                <textarea
                    class="pl-3 pt-1"
                    name="special-requirements[]"
                    rows="4"
                    placeholder="Any special requirements or notes..."
                ></textarea>
            </div>
        `;

        container.appendChild(newForm);

        // Update button text
        document.getElementById("add-passenger-btn").textContent = `Add Passenger`;

        // Setup validation for new inputs
        setupInputValidation();

        // Add event listener for remove button
        const removeButton = newForm.querySelector(".remove-passenger");
        removeButton.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            removePassengerForm(index);
        });
    }
}

// Remove passenger form
function removePassengerForm(index) {
    const formToRemove = document.getElementById(`passenger-form-${index}`);
    if (formToRemove) {
        formToRemove.remove();
        passengerCount--;

        // Update button text
        document.getElementById("add-passenger-btn").textContent = `Add Passenger`;

        // Renumber remaining forms
        const passengerForms = document.querySelectorAll(".passenger-form");
        passengerForms.forEach((form, i) => {
            if (i > 0) {
                // Skip primary passenger
                form.id = `passenger-form-${i + 1}`;
                const header = form.querySelector(".passenger-header h3");
                header.textContent = `Passenger ${i + 1}`;

                const removeButton = form.querySelector(".remove-passenger");
                removeButton.setAttribute("data-index", i + 1);
            }
        });
    }
}

// Show max passenger modal
function showMaxPassengerModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById("max-passenger-modal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "max-passenger-modal";
        modal.className = "fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm";
        modal.innerHTML = `
            <div class="form-container max-w-md mx-4 p-6 relative">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-4 glow">
                        <i class="fas fa-users text-white text-xl"></i>
                    </div>
                    <h3 class="font-orbitron text-2xl mb-2 text-glow">Maximum Passengers Reached</h3>
                    <p class="text-gray-300">You've reached the maximum number of passengers for ${getPassengerType()} travel (${maxPassengers} ${maxPassengers === 1 ? "person" : "people"}).</p>
                </div>
                <div class="flex justify-center">
                    <button id="modal-ok-btn" class="btn-primary text-white px-6 py-3 rounded-lg font-bold">
                        Understood
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listener for the OK button
        document.getElementById("modal-ok-btn").addEventListener("click", function () {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Show the modal
    modal.style.display = "flex";
}

// Setup add passenger button
function setupAddPassengerButton() {
    document.getElementById("add-passenger-btn").addEventListener("click", function () {
        if (passengerCount < maxPassengers) {
            addPassengerForm();
        } else {
            showMaxPassengerModal();
        }
    });
}

// Load accommodations from JSON
async function loadAccommodations() {
    try {
        const response = await fetch("../accommodations.json");

        if (!response.ok) {
            throw new Error(`Failed to load accommodations: ${response.status}`);
        }

        const data = await response.json();
        accommodationsData = data.accommodations;

        console.log("Accommodations loaded:", accommodationsData);
    } catch (error) {
        console.error("Error loading accommodations:", error);
        alert("Unable to load accommodations. Please try again later.");
    }
}

// Load destinations from JSON
async function loadDestinations() {
    try {
        const response = await fetch("../destinations.json");

        if (!response.ok) {
            throw new Error(`Failed to load destinations: ${response.status}`);
        }

        const data = await response.json();
        destinationsData = data.destinations;

        const destinationSelect = document.getElementById("destination");

        // Clear existing options except the first one
        while (destinationSelect.children.length > 1) {
            destinationSelect.removeChild(destinationSelect.lastChild);
        }

        // Add destinations from JSON
        destinationsData.forEach((dest) => {
            const option = document.createElement("option");
            option.value = dest.id;
            option.textContent = `${dest.name} - ${dest.travelDuration} - From $${dest.price.toLocaleString()}`;
            option.setAttribute("data-destination", JSON.stringify(dest));
            destinationSelect.appendChild(option);
        });

        // Add event listener to show destination info when selected
        destinationSelect.addEventListener("change", function () {
            const selectedOption = this.options[this.selectedIndex];
            const destinationInfo = document.getElementById("destination-info");
            const accommodationsSection = document.getElementById("accommodations-section");

            if (selectedOption.value) {
                const dest = JSON.parse(selectedOption.getAttribute("data-destination"));

                // Update destination info display
                document.getElementById("destination-name").textContent = dest.name;
                document.getElementById("destination-description").textContent = dest.description;
                document.getElementById("destination-duration").textContent = dest.travelDuration;
                document.getElementById("destination-distance").textContent = dest.distance;
                document.getElementById("destination-gravity").textContent = dest.gravity;
                document.getElementById("destination-temperature").textContent = dest.temperature;
                document.getElementById("destination-price").textContent = `$${dest.price.toLocaleString()} ${dest.currency}`;

                // Show the destination info
                destinationInfo.classList.remove("hidden");

                // Show and populate accommodations for this destination
                showAccommodationsForDestination(dest);
                accommodationsSection.classList.add("visible");
            } else {
                // Hide the destination info and accommodations
                destinationInfo.classList.add("hidden");
                accommodationsSection.classList.remove("visible");
            }
        });
    } catch (error) {
        console.error("Error loading destinations:", error);

        // Fallback: You can add some default options here if the fetch fails
        const destinationSelect = document.getElementById("destination");
        const fallbackOption = document.createElement("option");
        fallbackOption.value = "";
        fallbackOption.textContent = "Unable to load destinations";
        fallbackOption.disabled = true;
        destinationSelect.appendChild(fallbackOption);

        // Show error message to user
        alert("Unable to load destinations. Please try again later.");
    }
}

// Show accommodations for selected destination
function showAccommodationsForDestination(destination) {
    const accommodationsContainer = document.getElementById("accommodations-container");
    const accommodationInput = document.getElementById("accommodation");

    // Clear existing accommodation cards
    accommodationsContainer.innerHTML = "";

    // Get available accommodation IDs for this destination
    const availableAccommodationIds = destination.accommodations || [];

    // Filter accommodations to show only those available at this destination
    const availableAccommodations = accommodationsData.filter((acc) =>
        availableAccommodationIds.includes(acc.id)
    );

    // Create accommodation cards
    availableAccommodations.forEach((acc, index) => {
        const card = document.createElement("div");
        card.className = `accommodation-card ${index === 0 ? "selected" : ""}`;
        card.dataset.type = acc.id;

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

    // Set the first accommodation as selected by default
    if (availableAccommodations.length > 0) {
        accommodationInput.value = availableAccommodations[0].id;
    }

    // Set up event listeners for the new accommodation cards
    setupAccommodationCardSelection();
}

// Save form data to localStorage
function saveFormData() {
    const formData = {
        destination: document.getElementById("destination").value,
        departureDate: document.getElementById("departure-date").value,
        passengers: document.querySelector('input[name="passengers"]:checked').value,
        accommodation: document.getElementById("accommodation").value,
        passengerForms: [],
    };

    // Save passenger form data
    const passengerForms = document.querySelectorAll(".passenger-form");
    passengerForms.forEach((form, index) => {
        const passengerData = {
            firstName: form.querySelector('input[name="first-name[]"]').value,
            lastName: form.querySelector('input[name="last-name[]"]').value,
            email: form.querySelector('input[name="email[]"]').value,
            phone: form.querySelector('input[name="phone[]"]').value,
            specialRequirements: form.querySelector('textarea[name="special-requirements[]"]').value,
        };
        formData.passengerForms.push(passengerData);
    });

    localStorage.setItem("bookingFormData", JSON.stringify(formData));
}

// Restore form data from localStorage
function restoreFormData() {
    const savedData = localStorage.getItem("bookingFormData");
    if (!savedData) return;

    const formData = JSON.parse(savedData);

    // Restore basic form fields
    if (formData.destination) {
        document.getElementById("destination").value = formData.destination;
        // Trigger change event to load accommodations
        document.getElementById("destination").dispatchEvent(new Event("change"));
    }

    if (formData.departureDate) {
        document.getElementById("departure-date").value = formData.departureDate;
    }

    if (formData.passengers) {
        const passengerRadio = document.querySelector(`input[name="passengers"][value="${formData.passengers}"]`);
        if (passengerRadio) {
            passengerRadio.checked = true;
            updateMaxPassengers();
        }
    }

    // Restore passenger forms after a delay to ensure accommodations are loaded
    setTimeout(() => {
        if (formData.accommodation) {
            document.getElementById("accommodation").value = formData.accommodation;
            // Select the accommodation card
            const accommodationCard = document.querySelector(`.accommodation-card[data-type="${formData.accommodation}"]`);
            if (accommodationCard) {
                document.querySelectorAll(".accommodation-card").forEach((card) => card.classList.remove("selected"));
                accommodationCard.classList.add("selected");
            }
        }

        // Restore passenger forms
        if (formData.passengerForms && formData.passengerForms.length > 0) {
            // Remove all passenger forms except the primary one
            const passengerForms = document.querySelectorAll(".passenger-form");
            for (let i = passengerForms.length - 1; i > 0; i--) {
                passengerForms[i].remove();
            }

            // Restore primary passenger data
            const primaryPassenger = formData.passengerForms[0];
            if (primaryPassenger) {
                const primaryForm = document.getElementById("passenger-form-0");
                primaryForm.querySelector('input[name="first-name[]"]').value = primaryPassenger.firstName || "";
                primaryForm.querySelector('input[name="last-name[]"]').value = primaryPassenger.lastName || "";
                primaryForm.querySelector('input[name="email[]"]').value = primaryPassenger.email || "";
                primaryForm.querySelector('input[name="phone[]"]').value = primaryPassenger.phone || "";
                primaryForm.querySelector('textarea[name="special-requirements[]"]').value = primaryPassenger.specialRequirements || "";
            }

            // Add and restore additional passenger forms
            for (let i = 1; i < formData.passengerForms.length; i++) {
                if (i < maxPassengers) {
                    addPassengerForm();
                    const passengerData = formData.passengerForms[i];
                    const passengerForm = document.getElementById(`passenger-form-${i + 1}`);

                    if (passengerForm && passengerData) {
                        passengerForm.querySelector('input[name="first-name[]"]').value = passengerData.firstName || "";
                        passengerForm.querySelector('input[name="last-name[]"]').value = passengerData.lastName || "";
                        passengerForm.querySelector('input[name="email[]"]').value = passengerData.email || "";
                        passengerForm.querySelector('input[name="phone[]"]').value = passengerData.phone || "";
                        passengerForm.querySelector('textarea[name="special-requirements[]"]').value = passengerData.specialRequirements || "";
                    }
                }
            }
        }
    }, 500); // Delay to ensure accommodations are loaded
}

// Clear form data from localStorage
function clearFormData() {
    localStorage.removeItem("bookingFormData");
}

// Add event listeners to save form data on input
function setupAutoSave() {
    // Save on input for text fields
    document.querySelectorAll("input, select, textarea").forEach((element) => {
        element.addEventListener("input", saveFormData);
        element.addEventListener("change", saveFormData);
    });

    // Save on radio button change
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener("change", saveFormData);
    });

    // Save when accommodation is selected
    document.addEventListener("click", function (e) {
        if (e.target.closest(".accommodation-card")) {
            setTimeout(saveFormData, 100);
        }
    });
}

// Setup passenger radio buttons
function setupPassengerRadios() {
    const passengerRadios = document.querySelectorAll('input[name="passengers"]');
    passengerRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            updateMaxPassengers();
            saveFormData();
        });
    });
}

// Check authentication
function checkAuth() {
    try {
        const session = (typeof getUserSession === 'function') ? getUserSession() : JSON.parse(localStorage.getItem('userSession') || 'null');
        if (!session || !session.isLoggedIn) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
        return true;
    } catch (e) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async function () {
    // Check authentication
    if (!checkAuth()) return;

    createStars();
    setupMobileMenu();
    setupPassengerRadios();
    setupAddPassengerButton();
    setupFormSubmission();
    setupInputValidation();

    // Initialize max passengers
    updateMaxPassengers();

    // Load both accommodations and destinations
    await loadAccommodations();
    await loadDestinations();

    // Setup auto-save and restore form data
    setupAutoSave();
    restoreFormData();
});