// Simple and clean my-bookings logic
function loadBookings() {
    // Check if user is logged in
    const session = getUserSession();
    if (!session || !session.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Get all bookings
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // SIMPLE FILTER: Get current user's bookings
    const userBookings = allBookings.filter(booking => 
        booking.userId === session.userId || booking.email === session.email
    );

    displayBookings(userBookings);
}

function displayBookings(bookings) {
    const container = document.getElementById('bookings-container');
    const noBookings = document.getElementById('no-bookings');

    if (bookings.length === 0) {
        container.classList.add('hidden');
        noBookings.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    noBookings.classList.add('hidden');
    container.innerHTML = '';

    // Show newest bookings first
    bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    bookings.forEach(booking => {
        const card = createBookingCard(booking);
        container.appendChild(card);
    });
}

function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card p-6';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="font-orbitron text-xl text-neon-blue">${getDestinationName(booking.destination)}</h3>
                <p class="text-gray-400">Booking ID: ${booking.id}</p>
                <span class="inline-block bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full mt-2">
                    ${booking.status || 'Confirmed'}
                </span>
            </div>
            <span class="text-neon-cyan font-bold text-xl">${booking.totalPrice || 'Price not set'}</span>
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
            <button onclick="viewTicket('${booking.id}')" class="action-btn bg-neon-blue">
                <i class="fas fa-ticket-alt mr-2"></i>View Ticket
            </button>
            <button onclick="editBooking('${booking.id}')" class="action-btn bg-green-600">
                <i class="fas fa-edit mr-2"></i>Edit
            </button>
            <button onclick="cancelBooking('${booking.id}')" class="action-btn bg-red-600">
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
    return new Date(dateString).toLocaleDateString();
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

// Debug function to check what's in localStorage
function debugBookings() {
    const all = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const session = getUserSession();
    console.log('All bookings:', all);
    console.log('User session:', session);
    console.log('Filtered bookings:', all.filter(b => 
        b.userId === session.userId || b.email === session.email
    ));
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    if (typeof initAuthNav === 'function') initAuthNav();
    loadBookings();
    debugBookings(); // Add this temporarily to debug
});