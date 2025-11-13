// Centralized authentication helper for all pages
// Provides: getUserSession, setUserSession, clearUserSession, updateNavigation, updateAuthLinks, requireAuth, logout
(function(){
    function getUserSession() {
        try {
            const s = localStorage.getItem('userSession');
            return s ? JSON.parse(s) : null;
        } catch (e) {
            return null;
        }
    }

    function setUserSession(user) {
        const session = {
            isLoggedIn: true,
            userId: user.id,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(session));
    }

    function clearUserSession() {
        localStorage.removeItem('userSession');
    }

    function ensureNavIds() {
        // Try to ensure there are elements with ids login-link and logout-link in the nav
        // If login link exists but has no id, assign it. If logout missing, create it (hidden).
        const navAnchors = document.querySelectorAll('nav a');
        let loginAnchor = document.getElementById('login-link');
        if (!loginAnchor) {
            for (const a of navAnchors) {
                if (a.getAttribute('href') && a.getAttribute('href').includes('login.html')) {
                    a.id = 'login-link';
                    loginAnchor = a;
                    break;
                }
            }
        }

        let logoutAnchor = document.getElementById('logout-link');
        if (!logoutAnchor) {
            // create a logout anchor next to login anchor if possible
            if (loginAnchor && loginAnchor.parentNode) {
                const a = document.createElement('a');
                a.href = '#';
                a.id = 'logout-link';
                a.className = loginAnchor.className + ' hidden';
                a.textContent = 'Logout';
                loginAnchor.parentNode.insertBefore(a, loginAnchor.nextSibling);
                logoutAnchor = a;
            }
        }
        return { loginAnchor, logoutAnchor };
    }

    function updateNavigation() {
        const session = getUserSession();
        const ids = ensureNavIds();
        const loginLink = ids.loginAnchor;
        const logoutLink = ids.logoutAnchor;

        if (session && session.isLoggedIn) {
            if (loginLink) loginLink.classList.add('hidden');
            if (logoutLink) {
                logoutLink.classList.remove('hidden');
                logoutLink.textContent = `Logout (${session.name})`; 
                logoutLink.addEventListener('click', function(e){
                    e.preventDefault();
                    logout();
                });
            }
        } else {
            if (loginLink) loginLink.classList.remove('hidden');
            if (logoutLink) logoutLink.classList.add('hidden');
        }
    }

    // Keep older name for compatibility
    function updateAuthLinks() { updateNavigation(); }

    function logout() {
        clearUserSession();
        // Redirect to home
        window.location.href = (location.pathname.endsWith('index.html') ? 'index.html' : (location.pathname.includes('/html/') ? '../index.html' : 'index.html'));
    }

    function requireAuth() {
        const s = getUserSession();
        if (!s || !s.isLoggedIn) {
            // Redirect to login and preserve current page for return
            const current = window.location.pathname + window.location.search + window.location.hash;
            const loginUrl = (location.pathname.includes('/html/') ? 'login.html' : 'html/login.html');
            const encoded = encodeURIComponent(current);
            window.location.href = `${loginUrl}?redirect=${encoded}`;
            return false;
        }
        return true;
    }

    // Expose to global
    window.auth = {
        getUserSession,
        setUserSession,
        clearUserSession,
        updateNavigation,
        updateAuthLinks,
        requireAuth,
        logout
    };

    // Also export the functions globally for pages that call them directly
    window.getUserSession = getUserSession;
    window.setUserSession = setUserSession;
    window.clearUserSession = clearUserSession;
    window.updateNavigation = updateNavigation;
    window.updateAuthLinks = updateAuthLinks;
    window.requireAuth = requireAuth;
    window.logout = logout;

    document.addEventListener('DOMContentLoaded', function(){
        try { updateNavigation(); } catch(e){}
    });
})();
