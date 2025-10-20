// js/cart.js

// Get products from window.__DATA__ (loaded from data.js)
const allProducts = window.__DATA__.products || [];

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- Check Login Status ---
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');

    if (!loggedInUserEmail) {
        // If not logged in, redirect to login page
        alert('Please log in to view your cart.');
        window.location.href = 'login.html';
        return; // Stop script execution
    }

    // --- Load and Display Cart ---
    loadCartItems();

    // --- Add Event Listener for Remove Buttons (using delegation) ---
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const targetButton = event.target.closest('button.remove-item-btn');
            if (targetButton) {
                const productId = targetButton.dataset.productId;
                if (productId) {
                    removeItemFromCart(productId);
                }
            }
        });
    }

    // --- Add Event Listener for Checkout Button ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // For now, checkout just clears the cart and gives a message
            handleCheckout();
        });
    }

    // --- Function to load and display items ---
    function loadCartItems() {
        if (!cartItemsContainer || !emptyCartMessage || !cartSummary) {
            console.error('Cart HTML elements not found!');
            return;
        }

        const cartKey = `cart_${loggedInUserEmail}`;
        const cartItemIds = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Clear previous items
        cartItemsContainer.innerHTML = '';

        if (cartItemIds.length === 0) {
            // Show empty cart message and hide summary
            emptyCartMessage.classList.remove('hidden');
            cartSummary.classList.add('hidden');
        } else {
            // Hide empty cart message and show summary
            emptyCartMessage.classList.add('hidden');
            cartSummary.classList.remove('hidden');

            let total = 0;

            cartItemIds.forEach(itemId => {
                // Find product details from the global allProducts array
                const product = allProducts.find(p => p.id === itemId);

                if (product) {
                    total += product.price; // Add product price to total
                    const itemElement = createCartItemElement(product);
                    cartItemsContainer.appendChild(itemElement);
                } else {
                    console.warn(`Product with ID ${itemId} not found in data.js`);
                    // Optionally remove invalid ID from cart here
                }
            });

            // Update total price display
            if (cartTotalElement) {
                cartTotalElement.textContent = `$${total.toFixed(2)}`;
            }
        }
        updateCartCountNavbar(); // Update navbar count when cart page loads/refreshes
    }

    // --- Function to create HTML for a single cart item ---
    function createCartItemElement(product) {
        const div = document.createElement('div');
        // Using DaisyUI card-side for layout
        div.className = 'card card-side bg-base-200 shadow-sm flex-col sm:flex-row';
        div.innerHTML = `
            <figure class="p-4 sm:p-0 sm:w-32 flex-shrink-0 flex items-center justify-center">
              <img src="${product.image}" alt="${product.title}" class="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md"/>
            </figure>
            <div class="card-body py-4 px-6 flex-grow">
              <h2 class="card-title text-lg">${product.title}</h2>
              <p class="text-primary font-semibold">$${product.price.toFixed(2)}</p>
              <div class="card-actions justify-between items-center mt-2">
                 <div>
                    <span class="text-sm">Quantity: 1</span> 
                 </div>
                 <button class="btn btn-sm btn-outline btn-error remove-item-btn" data-product-id="${product.id}">Remove</button>
              </div>
            </div>
        `;
        return div;
    }

    // --- Function to remove an item from the cart ---
    function removeItemFromCart(productIdToRemove) {
        const cartKey = `cart_${loggedInUserEmail}`;
        let cartItemIds = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Filter out the item to remove
        const updatedCartIds = cartItemIds.filter(id => id !== productIdToRemove);

        // Save the updated array back to Local Storage
        localStorage.setItem(cartKey, JSON.stringify(updatedCartIds));

        console.log(`Product ${productIdToRemove} removed from cart for ${loggedInUserEmail}`);

        // Refresh the cart display
        loadCartItems();
    }

    // --- Function to handle checkout (Placeholder) ---
    function handleCheckout() {
        const cartKey = `cart_${loggedInUserEmail}`;
        const cartItemIds = JSON.parse(localStorage.getItem(cartKey)) || [];

        if (cartItemIds.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // In a real app, you'd process payment here

        // For now, just clear the cart and show a success message
        localStorage.removeItem(cartKey);
        alert('Thank you for your purchase! Your order is "on the way".');
        console.log('Checkout completed, cart cleared for:', loggedInUserEmail);

        // Refresh the cart display (which will now be empty)
        loadCartItems();
    }

    // --- Function to update Cart Count in Navbar ---
    function updateCartCountNavbar() {
        if (!loggedInUserEmail) return;

        const cartKey = `cart_${loggedInUserEmail}`;
        const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const cartCount = userCart.length;

        // Find the cart button link
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