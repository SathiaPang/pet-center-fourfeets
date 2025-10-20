// js/favorites.js

// Get products from window.__DATA__ (loaded from data.js)
const allProducts = window.__DATA__.products || [];

document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-items-container');
    const emptyFavoritesMessage = document.getElementById('empty-favorites-message');

    // --- Check Login Status ---
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');

    if (!loggedInUserEmail) {
        // Redirect if not logged in
        alert('Please log in to view your favorites.');
        window.location.href = 'login.html';
        return; // Stop script
    }

    // --- Load and Display Favorites ---
    loadFavoriteItems();

    // --- Event Listener for Buttons (Remove Fav, Add to Cart) ---
    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button');
            if (!targetButton) return;

            const productId = targetButton.dataset.productId;
            if (!productId) return;

            if (targetButton.classList.contains('remove-fav-btn')) {
                removeItemFromFavorites(productId);
            } else if (targetButton.classList.contains('add-to-cart-btn-fav')) {
                // We can reuse the cart logic from shop.js or copy/adapt it here
                handleAddToCartFromFavorites(productId, targetButton);
            }
        });
    }

    // --- Function to load and display favorite items ---
    function loadFavoriteItems() {
        if (!favoritesContainer || !emptyFavoritesMessage) {
            console.error('Favorites HTML elements not found!');
            return;
        }

        const favKey = `favorites_${loggedInUserEmail}`;
        const favoriteItemIds = JSON.parse(localStorage.getItem(favKey)) || [];

        // Clear previous items
        favoritesContainer.innerHTML = '';

        if (favoriteItemIds.length === 0) {
            // Show empty message
            emptyFavoritesMessage.classList.remove('hidden');
            favoritesContainer.classList.add('hidden'); // Hide the grid container
        } else {
            // Hide empty message and ensure grid is visible
            emptyFavoritesMessage.classList.add('hidden');
            favoritesContainer.classList.remove('hidden');

            favoriteItemIds.forEach(itemId => {
                const product = allProducts.find(p => p.id === itemId);

                if (product) {
                    const itemElement = createFavoriteItemElement(product);
                    favoritesContainer.appendChild(itemElement);
                } else {
                    console.warn(`Favorite product with ID ${itemId} not found in data.js`);
                    // Optionally remove invalid ID from favorites here
                }
            });
        }
        updateFavCountNavbar(); // Update navbar count
    }

    // --- Function to create HTML for a single favorite item card ---
    function createFavoriteItemElement(product) {
        const div = document.createElement('div');
        div.className = 'card bg-base-200 shadow-sm border border-base-300'; // Added border
        div.innerHTML = `
            <figure class="aspect-square p-4 bg-white rounded-t-box"> 
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-contain "/>
            </figure>
            <div class="card-body p-4 items-center text-center">
                <h2 class="card-title text-base font-semibold">${product.title}</h2> 
                <p class="text-primary font-medium mt-1">$${product.price.toFixed(2)}</p> 
                <div class="card-actions justify-center mt-3 w-full gap-2"> 
                    <button class="btn btn-sm btn-outline btn-error remove-fav-btn flex-1" data-product-id="${product.id}">Remove</button>
                    <button class="btn btn-sm btn-primary add-to-cart-btn-fav flex-1" data-product-id="${product.id}">Add Cart</button> 
                </div>
            </div>
        `;
        return div;
    }

    // --- Function to remove an item from favorites ---
    function removeItemFromFavorites(productIdToRemove) {
        const favKey = `favorites_${loggedInUserEmail}`;
        let favoriteItemIds = JSON.parse(localStorage.getItem(favKey)) || [];

        // Filter out the item to remove
        const updatedFavIds = favoriteItemIds.filter(id => id !== productIdToRemove);

        // Save back to Local Storage
        localStorage.setItem(favKey, JSON.stringify(updatedFavIds));

        console.log(`Product ${productIdToRemove} removed from favorites for ${loggedInUserEmail}`);

        // Refresh the display
        loadFavoriteItems();
    }

    // --- Function to add item to cart (adapted from shop.js) ---
    function handleAddToCartFromFavorites(productId, buttonElement) {
        const cartKey = `cart_${loggedInUserEmail}`;
        let userCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        if (!userCart.includes(productId)) {
            userCart.push(productId);
            localStorage.setItem(cartKey, JSON.stringify(userCart));
            console.log(`Product ${productId} added to cart from favorites for ${loggedInUserEmail}`);
            alert('Item added to cart!'); // Simple feedback
            updateCartCountNavbar(); // Update cart count in navbar
            // Optional: Change button state
            buttonElement.textContent = 'In Cart';
            buttonElement.classList.add('btn-disabled');
            setTimeout(() => {
                buttonElement.textContent = 'Add Cart';
                buttonElement.classList.remove('btn-disabled');
            }, 1500);

        } else {
            alert('Item already in cart!');
        }
    }

    // --- Functions to update Navbar Counts ---
    function updateFavCountNavbar() {
        if (!loggedInUserEmail) return;

        const favKey = `favorites_${loggedInUserEmail}`;
        const userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
        const favCount = userFavorites.length;

        const favButtonSpan = document.querySelector('.navbar-end a[href="favorites.html"] span');

        if (favButtonSpan) {
            if (favCount > 0) {
                favButtonSpan.innerHTML = `❤️ <span class="badge badge-sm badge-secondary">${favCount}</span>`;
            } else {
                favButtonSpan.innerHTML = '❤️';
            }
        }
    }

    function updateCartCountNavbar() {
        if (!loggedInUserEmail) return;

        const cartKey = `cart_${loggedInUserEmail}`;
        const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const cartCount = userCart.length;

        const cartButtonSpan = document.querySelector('.navbar-end a[href="cart.html"] span');

        if (cartButtonSpan) {
            if (cartCount > 0) {
                cartButtonSpan.innerHTML = `🛒 <span class="badge badge-sm badge-primary">${cartCount}</span>`;
            } else {
                cartButtonSpan.innerHTML = '🛒';
            }
        }
    }


}); // End DOMContentLoaded