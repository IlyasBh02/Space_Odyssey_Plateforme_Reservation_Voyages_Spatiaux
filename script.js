// Add this to every page to show user's name
function updateNavigation() {
    const session = localStorage.getItem('userSession');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userName = document.getElementById('user-name');
    
    if (session && JSON.parse(session).isLoggedIn) {
        const userData = JSON.parse(session);
        
        // Show logout link and user's name
        if (loginLink) loginLink.classList.add('hidden');
        if (logoutLink) logoutLink.classList.remove('hidden');
        if (userName) {
            userName.textContent = userData.name;
            userName.classList.remove('hidden');
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

// Call this on page load
document.addEventListener('DOMContentLoaded', updateNavigation);


function updateAuthLinks() {
            const session = localStorage.getItem('userSession');
            const isLoggedIn = session && JSON.parse(session).isLoggedIn;
            
            if (!isLoggedIn) {
                // Redirect to login if not authenticated
                window.location.href = 'login.html';
                return;
            }
            
            document.getElementById('login-link').classList.toggle('hidden', isLoggedIn);
            document.getElementById('logout-link').classList.toggle('hidden', !isLoggedIn);
            
            if (isLoggedIn) {
                const userData = JSON.parse(session);
                document.getElementById('logout-link').innerHTML = `Logout (${userData.username})`;
            }
        }

        document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userSession');
            window.location.href = 'index.html';
        });

        document.addEventListener('DOMContentLoaded', function() {
            createStars();
            updateAuthLinks();
            loadBookings();
        });