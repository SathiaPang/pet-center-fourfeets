// Get data from window.__DATA__
const allProducts = window.__DATA__.products || [];
const categories = window.__DATA__.categories || [];


let filteredProducts = [...allProducts];
let currentPage = 1;
const productsPerPage = 9;
let selectedCategory = null;
let selectedBrand = null;
let selectedTags = [];
let maxPrice = 100;
let sortBy = 'latest';

document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    renderProducts();
    setupEventListeners();
    updateCartCount();
    updateFavCount();
});

// filters
function initializeFilters() {
    renderCategories();
    renderBrands();
    renderTags();
    renderPopularProducts();
}

// categories
function renderCategories() {
    const catList = document.getElementById('catList');
    if (!catList) return;
    catList.innerHTML = categories.map(cat => `
        <li>
            <a href="#" class="category-filter" data-category="${cat.name}">
                ${cat.name} (${cat.count})
            </a>
        </li>
    `).join('');
}
// Render brands
function renderBrands() {
    const brandList = document.getElementById('brandList');
    if (!brandList) return;

    const brands = [...new Set(allProducts.map(p => p.brand))];
    brandList.innerHTML = brands.map(brand => `
        <li>
            <label class="label cursor-pointer justify-start gap-2">
                <input type="checkbox" class="checkbox checkbox-sm brand-filter" value="${brand}">
                <span class="label-text">${brand}</span>
            </label>
        </li>
    `).join('');
}

// Render tags
function renderTags() {
    const tagList = document.getElementById('tagList');
    if (!tagList) return;

    const allTags = [...new Set(allProducts.flatMap(p => p.tags))];
    tagList.innerHTML = allTags.map(tag => `
        <button class="badge badge-outline tag-filter" data-tag="${tag}">${tag}</button>
    `).join('');
}

// Render popular products
function renderPopularProducts() {
    const popularList = document.getElementById('popularList');
    if (!popularList) return;

    const popular = allProducts.slice(0, 5);
    popularList.innerHTML = popular.map(product => `
        <div class="flex gap-2 items-center">
            <img src="${product.image}" alt="${product.title}" class="w-12 h-12 rounded object-cover">
            <div class="flex-1">
                <div class="font-medium text-xs">${product.title}</div>
                <div class="text-xs opacity-70">$${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}
// Apply filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (selectedCategory && product.category !== selectedCategory) return false;

        // Brand filter
        if (selectedBrand && product.brand !== selectedBrand) return false;

        // Tags filter
        if (selectedTags.length > 0) {
            const hasTag = selectedTags.some(tag => product.tags.includes(tag));
            if (!hasTag) return false;
        }

        // Price filter
        if (product.price > maxPrice) return false;

        return true;
    });

    // Apply sorting
    sortProducts();

    // Reset to page 1
    currentPage = 1;
    renderProducts();
}

// Sort products
function sortProducts() {
    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    // 'latest' keeps the original order
}

// Render products
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    const resultLabel = document.getElementById('resultLabel');

    if (!productGrid) return;

    // Calculate pagination
    const startIdx = (currentPage - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const productsToShow = filteredProducts.slice(startIdx, endIdx);

    // Update result label
    if (resultLabel) {
        resultLabel.textContent = `Showing ${filteredProducts.length} results`;
    }

    // Render products
    if (productsToShow.length === 0) {
        productGrid.innerHTML = '<div class="col-span-full text-center py-12 opacity-70">No products found</div>';
        return;
    }

    productGrid.innerHTML = productsToShow.map(product => `
        <div class="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <a href="product.html?id=${product.id}">
                <figure class="aspect-square cursor-pointer">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" />
                </figure>
            </a>
            <div class="card-body">
                <a href="product.html?id=${product.id}" class="hover:underline">
                    <h2 class="card-title text-sm">${product.title}</h2>
                </a>
                <p class="font-bold text-primary">$${product.price.toFixed(2)}</p>
                <div class="card-actions justify-end mt-2">
                    <button class="btn btn-sm btn-ghost add-to-fav-btn" data-product-id="${product.id}">❤️</button>
                    <button class="btn btn-sm btn-outline add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    // Update pagination buttons
    updatePaginationButtons();
}

// Update pagination buttons
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.toggle('btn-disabled', currentPage === 1);
    }

    if (nextBtn) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.classList.toggle('btn-disabled', currentPage >= totalPages);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Category filters
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-filter')) {
            e.preventDefault();
            const category = e.target.dataset.category;
            selectedCategory = selectedCategory === category ? null : category;

            // Update active state
            document.querySelectorAll('.category-filter').forEach(el => {
                el.classList.toggle('active', el.dataset.category === selectedCategory);
            });

            applyFilters();
        }
    });

    // Brand filters
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('brand-filter')) {
            const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked'))
                .map(cb => cb.value);
            selectedBrand = checkedBrands.length > 0 ? checkedBrands[0] : null;
            applyFilters();
        }
    });

    // Tag filters
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-filter')) {
            const tag = e.target.dataset.tag;
            const index = selectedTags.indexOf(tag);

            if (index === -1) {
                selectedTags.push(tag);
                e.target.classList.add('badge-primary');
            } else {
                selectedTags.splice(index, 1);
                e.target.classList.remove('badge-primary');
            }

            applyFilters();
        }
    });

    // Price filter
    const priceRange = document.getElementById('priceRange');
    const priceLabel = document.getElementById('priceLabel');

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            maxPrice = parseFloat(e.target.value);
            if (priceLabel) {
                priceLabel.textContent = `$${maxPrice}`;
            }
            applyFilters();
        });
    }

    // Sort filter
    const sortSel = document.getElementById('sortSel');
    if (sortSel) {
        sortSel.addEventListener('change', (e) => {
            sortBy = e.target.value;
            sortProducts();
            renderProducts();
        });
    }

    // Pagination
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Cart and Favorites buttons
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            if (!targetButton) return;

            const productId = targetButton.dataset.productId;
            if (!productId) return;

            const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
            if (!loggedInUserEmail) {
                alert('Please log in to add items to your cart or favorites!');
                return;
            }

            if (targetButton.classList.contains('add-to-cart-btn')) {
                handleAddToCart(loggedInUserEmail, productId, targetButton);
            } else if (targetButton.classList.contains('add-to-fav-btn')) {
                handleAddToFavorites(loggedInUserEmail, productId, targetButton);
            }
        });
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

        buttonElement.textContent = 'Added';
        buttonElement.classList.add('btn-disabled');
        setTimeout(() => {
            buttonElement.textContent = 'Add to Cart';
            buttonElement.classList.remove('btn-disabled');
        }, 1500);
    } else {
        alert('Item already in cart!');
    }
    updateCartCount();
}

// Handle add to favorites
function handleAddToFavorites(userEmail, productId, buttonElement) {
    const favKey = `favorites_${userEmail}`;
    let userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];

    if (!userFavorites.includes(productId)) {
        userFavorites.push(productId);
        localStorage.setItem(favKey, JSON.stringify(userFavorites));
        console.log(`Product ${productId} added to favorites for ${userEmail}`);
        buttonElement.classList.add('text-red-500');
    } else {
        userFavorites = userFavorites.filter(id => id !== productId);
        localStorage.setItem(favKey, JSON.stringify(userFavorites));
        console.log(`Product ${productId} removed from favorites for ${userEmail}`);
        buttonElement.classList.remove('text-red-500');
    }
    updateFavCount();
}
// Update cart count
function updateCartCount() {
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;
    const cartKey = `cart_${loggedInUserEmail}`;
    const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartCount = userCart.length;
    // Find the cart button link (now it's an <a> tag)
    const cartButtonSpan = document.querySelector('.navbar-end a[href="cart.html"] span');
    if (cartButtonSpan && cartCount > 0) {
        cartButtonSpan.innerHTML = `🛒 <span class="badge badge-sm badge-primary">${cartCount}</span>`;
    } else if (cartButtonSpan) {
        cartButtonSpan.innerHTML = '🛒';
    }
}
// Update favorites count
function updateFavCount() {
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const favKey = `favorites_${loggedInUserEmail}`;
    const userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
    const favCount = userFavorites.length;

    // Find the favorites button link (now it's an <a> tag)
    const favButtonSpan = document.querySelector('.navbar-end a[href="favorites.html"] span');
    if (favButtonSpan && favCount > 0) {
        favButtonSpan.innerHTML = `❤️ <span class="badge badge-sm badge-secondary">${favCount}</span>`;
    } else if (favButtonSpan) {
        favButtonSpan.innerHTML = '❤️';
    }
}