// Minimal authentication helper - FIXED VERSION
(function(){
    function getUserSession() {
        try { return JSON.parse(localStorage.getItem('userSession') || 'null'); }
        catch (e) { return null; }
    }

    function setUserSession(user) {
        const session = { isLoggedIn: true, userId: user.id, name: user.name, email: user.email };
        localStorage.setItem('userSession', JSON.stringify(session));
    }

    function clearUserSession() {
        localStorage.removeItem('userSession');
    }

    function logout() {
        clearUserSession();
        window.location.href = 'index.html';
    }

    function initAuthNav() {
        const session = getUserSession();
        const authContainer = document.getElementById('auth-buttons');
        if (!authContainer) return;

        authContainer.innerHTML = '';

        if (session && session.isLoggedIn) {
            // Only create My Bookings link if we're NOT on the My Bookings page
            if (!window.location.pathname.includes('my-bookings.html')) {
                const bookingsLink = document.createElement('a');
                bookingsLink.href = 'my-bookings.html';
                bookingsLink.textContent = 'My Bookings';
                bookingsLink.className = 'px-4 py-2 text-white hover:text-gray-300';
                authContainer.appendChild(bookingsLink);
            }
            
            // Create logout button
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = `Logout (${session.name})`;
            logoutBtn.className = 'px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white';
            logoutBtn.addEventListener('click', logout);
            authContainer.appendChild(logoutBtn);
        } else {
            // Show login button
            const loginBtn = document.createElement('button');
            loginBtn.textContent = 'Login';
            loginBtn.className = 'px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white';
            loginBtn.addEventListener('click', function(){ 
                window.location.href = 'login.html'; 
            });
            authContainer.appendChild(loginBtn);
        }
    }

    window.setUserSession = setUserSession;
    window.getUserSession = getUserSession;
    window.clearUserSession = clearUserSession;
    window.logout = logout;
    window.initAuthNav = initAuthNav;

    document.addEventListener('DOMContentLoaded', initAuthNav);
})();