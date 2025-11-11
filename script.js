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