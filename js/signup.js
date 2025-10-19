// js/signup.js

// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Make sure the form exists before adding listener
    if (!signupForm) {
        console.error('Sign up form not found!');
        return;
    }

    // Listen for the form submission
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submit (which reloads the page)

        // Get the values from the input fields
        const email = emailInput.value.trim(); // .trim() removes whitespace
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // --- Validation ---
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // --- Local Storage Logic ---

        // 1. Get existing users (or initialize an empty array if none exist)
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Check if the email already exists
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert('An account with this email already exists. Please log in.');
            // Maybe redirect to login page? window.location.href = 'login.html';
            return;
        }

        // 3. If email is new, add the new user object to the array
        const newUser = {
            email: email,
            password: password // In a real app, you MUST hash the password
        };
        users.push(newUser);

        // 4. Save the updated users array back to Local Storage
        localStorage.setItem('users', JSON.stringify(users));

        // --- Success ---
        alert('Account created successfully! You can now log in.');
        console.log('User registered:', newUser);

        // Optional: Redirect to login page after successful signup
        window.location.href = 'login.html';

        // Optional: Clear the form fields
        // signupForm.reset(); 
    });

});