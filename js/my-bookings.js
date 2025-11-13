// Complete my-bookings.js with all required functions
function createStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    const starCount = 150;
    container.innerHTML = '';
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(star);
    }
}

function loadBookings() {
    // Check if user is logged in
    const session = getUserSession ? getUserSession() : JSON.parse(localStorage.getItem('userSession') || 'null');
    
    if (!session || !session.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Get all bookings
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    console.log('All bookings from storage:', allBookings);
    console.log('Current user session:', session);
    
    // SIMPLE FILTER: Get current user's bookings
    const userBookings = allBookings.filter(booking => {
        const matches = booking.userId === session.userId || booking.email === session.email;
        console.log('Booking match check:', booking, matches);
        return matches;
    });

    console.log('Filtered user bookings:', userBookings);
    displayBookings(userBookings);
}

function displayBookings(bookings) {
    const container = document.getElementById('bookings-container');
    const noBookings = document.getElementById('no-bookings');

    if (!bookings || bookings.length === 0) {
        if (container) container.classList.add('hidden');
        if (noBookings) noBookings.classList.remove('hidden');
        return;
    }

    if (container) {
        container.classList.remove('hidden');
        container.innerHTML = '';
    }
    if (noBookings) noBookings.classList.add('hidden');

    // Show newest bookings first
    bookings.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));

    bookings.forEach(booking => {
        const card = createBookingCard(booking);
        if (container) container.appendChild(card);
    });
}

function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card p-6';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="font-orbitron text-xl text-neon-blue">${getDestinationName(booking.destination)}</h3>
                <p class="text-gray-400">Booking ID: ${booking.id || 'N/A'}</p>
                <span class="inline-block bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full mt-2">
                    ${booking.status || 'Confirmed'}
                </span>
            </div>
            <span class="text-neon-cyan font-bold text-xl">${booking.totalPrice || booking.price || 'Price not set'}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
                <strong class="text-gray-400">Departure:</strong><br>
                ${formatDate(booking.departureDate)}
            </div>
            <div>
                <strong class="text-gray-400">Package:</strong><br>
                ${getPackageName(booking.package)}
            </div>
            <div>
                <strong class="text-gray-400">Passengers:</strong><br>
                ${booking.passengers ? booking.passengers.length : 1}
            </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
            <button onclick="viewTicket('${booking.id}')" class="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <i class="fas fa-ticket-alt mr-2"></i>View Ticket
            </button>
            <button onclick="editBooking('${booking.id}')" class="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                <i class="fas fa-edit mr-2"></i>Edit
            </button>
            <button onclick="cancelBooking('${booking.id}')" class="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">
                <i class="fas fa-times mr-2"></i>Cancel
            </button>
        </div>
    `;
    
    return card;
}

// Simple helper functions
function getDestinationName(id) {
    const destinations = {
        'moon': 'The Moon',
        'mars': 'Mars', 
        'europa': 'Europa',
        'titan': 'Titan',
        'orbital-station': 'Orbital Station',
        'venus-clouds': 'Venus Cloud Cities'
    };
    return destinations[id] || id;
}

function getPackageName(id) {
    const packages = {
        'standard': 'Standard Cabin',
        'luxury': 'Luxury Suite', 
        'zero-g': 'Zero-G Pod',
        'family': 'Family Module',
        'research': 'Research Suite',
        'honeymoon': 'Honeymoon Suite'
    };
    return packages[id] || id;
}

function formatDate(dateString) {
    if (!dateString) return 'Date not set';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        return dateString;
    }
}

// Action functions
function viewTicket(bookingId) {
    window.location.href = `ticket.html?id=${bookingId}`;
}

function editBooking(bookingId) {
    localStorage.setItem('editBookingId', bookingId);
    window.location.href = `booking.html?edit=${bookingId}`;
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const updatedBookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
        loadBookings(); // Refresh the list
        alert('Booking cancelled successfully.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    if (typeof initAuthNav === 'function') initAuthNav();
    loadBookings();
});