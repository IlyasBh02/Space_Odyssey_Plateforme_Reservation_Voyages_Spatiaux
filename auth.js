// Minimal authentication helper (simple and readable)
// Exposes: setUserSession(user), getUserSession(), clearUserSession(), initAuthNav(), logout()
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
        // simple redirect to project root index
        if (location.pathname.includes('/html/')) window.location.href = '../index.html';
        else window.location.href = 'index.html';
    }

    // Minimal nav initializer: hides login button and injects logout button with styling
    function initAuthNav() {
        const session = getUserSession();
        const authContainer = document.getElementById('auth-buttons');
        if (!authContainer) return;

        // Clear any previous buttons
        authContainer.innerHTML = '';

        if (session && session.isLoggedIn) {
            // Show logout button
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-link';
            logoutBtn.textContent = `Logout (${session.name})`;
            logoutBtn.className = 'px-4 py-2 rounded-lg font-bold bg-red-600 hover:bg-red-700 transition-colors text-white';
            logoutBtn.addEventListener('click', function(e){ e.preventDefault(); logout(); });
            authContainer.appendChild(logoutBtn);
        } else {
            // Show login button
            const loginBtn = document.createElement('button');
            loginBtn.id = 'login-link';
            loginBtn.textContent = 'Login';
            loginBtn.className = 'px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity text-white';
            loginBtn.addEventListener('click', function(){ 
                const loginUrl = (location.pathname.includes('/html/') ? 'login.html' : 'html/login.html');
                window.location.href = loginUrl; 
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
