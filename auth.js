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

    // Minimal nav initializer: hides login link and injects logout
    function initAuthNav() {
        const session = getUserSession();
        const loginLink = document.getElementById('login-link') || document.querySelector('nav a[href*="login.html"]');
        if (!loginLink) return;

        // Remove any previous logout we created
        const existing = document.getElementById('logout-link');
        if (existing) existing.remove();

        if (session && session.isLoggedIn) {
            loginLink.style.display = 'none';
            const a = document.createElement('a');
            a.href = '#';
            a.id = 'logout-link';
            a.className = loginLink.className;
            a.textContent = `Logout (${session.name})`;
            a.addEventListener('click', function(e){ e.preventDefault(); logout(); });
            loginLink.parentNode.insertBefore(a, loginLink.nextSibling);
        } else {
            loginLink.style.display = '';
        }
    }

    window.setUserSession = setUserSession;
    window.getUserSession = getUserSession;
    window.clearUserSession = clearUserSession;
    window.logout = logout;
    window.initAuthNav = initAuthNav;

    document.addEventListener('DOMContentLoaded', initAuthNav);
})();
