// js/authStatus.js

document.addEventListener('DOMContentLoaded', () => {
    const loggedOutNav = `
    <a href="login.html" class="btn btn-outline btn-sm">Log In</a>
    <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
  `;

    const loggedInNav = (userEmail) => `
    <span class="text-sm hidden sm:inline">Welcome, ${userEmail}!</span>
    <button id="logout-button" class="btn btn-ghost btn-sm">Logout</button>
  `;

    // --- Find the placeholder in the navbar ---
    // We'll add an element with id="auth-status" to the HTML later
    const authStatusContainer = document.getElementById('auth-status');

    if (!authStatusContainer) {
        console.error('Navbar placeholder element with id "auth-status" not found!');
        return; // Stop if the placeholder isn't there
    }

    // --- Check sessionStorage for the logged-in user ---
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');

    if (loggedInUserEmail) {
        // --- User IS logged in ---
        authStatusContainer.innerHTML = loggedInNav(loggedInUserEmail);

        // Find the logout button *after* it's added to the page
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                // Clear the session storage
                sessionStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                // Redirect to the login page (or homepage)
                window.location.href = 'login.html';
            });
        }
    } else {
        // --- User IS NOT logged in ---
        authStatusContainer.innerHTML = loggedOutNav;
    }
});