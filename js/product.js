// js/product.js

// Get products from window.__DATA__ (loaded from data.js)
const allProducts = window.__DATA__.products || [];

document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        // No product ID provided, redirect to shop
        alert('No product selected!');
        window.location.href = 'shop.html';
        return;
    }

    // Find the product
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        // Product not found
        alert('Product not found!');
        window.location.href = 'shop.html';
        return;
    }

    // Display product details
    displayProductDetails(product);

    // Setup event listeners for buttons
    setupProductButtons(product);

    // Update navbar counts
    updateCartCount();
    updateFavCount();
});

// Display product details
function displayProductDetails(product) {
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.title;
    document.getElementById('product-name').textContent = product.title;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-category').textContent = product.category || 'N/A';
    document.getElementById('product-brand').textContent = product.brand || 'N/A';
    
    // Generate a description based on product data
    const description = `
        This ${product.title.toLowerCase()} is perfect for your pet! 
        Made by ${product.brand}, this quality ${product.category.toLowerCase()} item 
        features ${product.tags ? product.tags.join(', ') : 'premium materials'}.
    `;
    document.getElementById('product-description').textContent = description;

    // Update page title
    document.title = `${product.title} - 4Feets`;
}

// Setup button event listeners
function setupProductButtons(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn-detail');
    const addToFavBtn = document.getElementById('add-to-fav-btn-detail');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
            if (!loggedInUserEmail) {
                alert('Please log in to add items to your cart!');
                window.location.href = 'login.html';
                return;
            }
            handleAddToCart(loggedInUserEmail, product.id, addToCartBtn);
        });
    }

    if (addToFavBtn) {
        addToFavBtn.addEventListener('click', () => {
            const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
            if (!loggedInUserEmail) {
                alert('Please log in to add items to your favorites!');
                window.location.href = 'login.html';
                return;
            }
            handleAddToFavorites(loggedInUserEmail, product.id, addToFavBtn);
        });

        // Check if already in favorites and update button appearance
        updateFavoriteButtonState(product.id, addToFavBtn);
    }
}

// Update favorite button state
function updateFavoriteButtonState(productId, buttonElement) {
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const favKey = `favorites_${loggedInUserEmail}`;
    const userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];

    if (userFavorites.includes(productId)) {
        buttonElement.classList.remove('btn-outline');
        buttonElement.classList.add('btn-error');
        buttonElement.querySelector('span').textContent = 'Remove from Favorites';
    } else {
        buttonElement.classList.add('btn-outline');
        buttonElement.classList.remove('btn-error');
        buttonElement.querySelector('span').textContent = 'Add to Favorites';
    }
}

// Handle add to cart
function handleAddToCart(userEmail, productId, buttonElement) {
    const cartKey = `cart_${userEmail}`;
    let userCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (!userCart.includes(productId)) {
        userCart.push(productId);
        localStorage.setItem(cartKey, JSON.stringify(userCart));
        console.log(`Product ${productId} added to cart for ${userEmail}`);

        // Update button
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Added to Cart!';
        buttonElement.classList.add('btn-disabled');
        
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.classList.remove('btn-disabled');
        }, 2000);

        // Update navbar count
        updateCartCount();
    } else {
        alert('This item is already in your cart!');
    }
}

// Handle add to favorites
function handleAddToFavorites(userEmail, productId, buttonElement) {
    const favKey = `favorites_${userEmail}`;
    let userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];

    if (!userFavorites.includes(productId)) {
        // Add to favorites
        userFavorites.push(productId);
        localStorage.setItem(favKey, JSON.stringify(userFavorites));
        console.log(`Product ${productId} added to favorites for ${userEmail}`);
        
        buttonElement.classList.remove('btn-outline');
        buttonElement.classList.add('btn-error');
        buttonElement.querySelector('span').textContent = 'Remove from Favorites';
    } else {
        // Remove from favorites
        userFavorites = userFavorites.filter(id => id !== productId);
        localStorage.setItem(favKey, JSON.stringify(userFavorites));
        console.log(`Product ${productId} removed from favorites for ${userEmail}`);
        
        buttonElement.classList.add('btn-outline');
        buttonElement.classList.remove('btn-error');
        buttonElement.querySelector('span').textContent = 'Add to Favorites';
    }

    // Update navbar count
    updateFavCount();
}

// Update cart count in navbar
function updateCartCount() {
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const cartKey = `cart_${loggedInUserEmail}`;
    const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartCount = userCart.length;

    const cartButtonSpan = document.querySelector('.navbar-end a[href="cart.html"] span');
    if (cartButtonSpan && cartCount > 0) {
        cartButtonSpan.innerHTML = `🛒 <span class="badge badge-sm badge-primary">${cartCount}</span>`;
    } else if (cartButtonSpan) {
        cartButtonSpan.innerHTML = '🛒';
    }
}

// Update favorites count in navbar
function updateFavCount() {
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const favKey = `favorites_${loggedInUserEmail}`;
    const userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
    const favCount = userFavorites.length;

    const favButtonSpan = document.querySelector('.navbar-end a[href="favorites.html"] span');
    if (favButtonSpan && favCount > 0) {
        favButtonSpan.innerHTML = `❤️ <span class="badge badge-sm badge-secondary">${favCount}</span>`;
    } else if (favButtonSpan) {
        favButtonSpan.innerHTML = '❤️';
    }
}
