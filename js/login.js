// js/login.js
document.addEventListener('DOMContentLoaded', () => {

    // Get the form and input elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Make sure the form exists
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    // Listen for the form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop the page from reloading

        // Get the input values
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // --- Local Storage Logic ---

        // 1. Get the users array from Local Storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Find the user with the matching email
        // The .find() method returns the first user that matches, or undefined if none match
        const foundUser = users.find(user => user.email === email);

        // 3. Check if user exists AND password matches
        if (foundUser && foundUser.password === password) {
            // --- Login Successful ---
            alert('Login successful!');
            console.log('User logged in:', foundUser.email);

            // Store the logged-in user's email in sessionStorage
            // sessionStorage is like localStorage, but clears when the browser tab is closed
            sessionStorage.setItem('loggedInUser', foundUser.email);

            // Redirect to the homepage (or shop page, etc.)
            window.location.href = 'index.html'; // Change this to your desired page after login

        } else {
            // --- Login Failed ---
            alert('Invalid email or password. Please try again.');
            console.error('Login failed for email:', email);
        }
    });

});