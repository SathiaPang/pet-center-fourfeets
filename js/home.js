// Get data from window.__DATA__ (loaded from data.js)
const getData = () => window.__DATA__ || {};

// Helper function to create elements from HTML string
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function productCard(p) {
  return el(`
    <div class="card bg-base-100 border border-base-200 hover:shadow-md transition">
      <a href="product.html?id=${p.id}">
        <figure class="aspect-square bg-base-200 cursor-pointer">
          <img src="${p.image}" alt="${p.title}" class="object-cover w-full h-full"/>
        </figure>
      </a>
      <div class="card-body p-4">
        <a href="product.html?id=${p.id}" class="hover:underline">
          <h3 class="card-title text-base">${p.title}</h3>
        </a>
        <div class="flex items-center justify-between">
          <span class="font-semibold">$${Number(p.price).toFixed(2)}</span>
          <a href="product.html?id=${p.id}" class="btn btn-sm btn-outline">View</a>
        </div>
      </div>
    </div>
  `);
}
function categoryCard(c) {
  return el(`
    <div class="carousel-item">
      <a href="shop.html" class="card w-60 sm:w-64 bg-base-100 border border-base-200 hover:shadow-md transition">
        <figure class="aspect-[4/3]">
          <img class="object-cover w-full h-full" src="${c.image}" alt="${c.name}">
        </figure>
        <div class="card-body p-4">
          <h3 class="font-semibold">${c.name}</h3>
          <p class="text-sm opacity-60">${c.count} products</p>
        </div>
      </a>
    </div>
  `);
}
function petPill(p) {
  return el(`
    <div class="carousel-item">
      <a href="shop.html" class="btn btn-ghost gap-3 border border-base-200 rounded-full px-4">
        <div class="avatar">
          <div class="w-10 rounded-full">
            <img src="${p.image}" alt="${p.name}"/>
          </div>
        </div>
        <span class="font-medium">${p.name}</span>
      </a>
    </div>
  `);
}
function blogCard(n) {
  return el(`
    <article class="card bg-base-100 border border-base-200 hover:shadow-md transition">
      <figure class="aspect-video">
        <img src="${n.image}" class="object-cover w-full h-full" alt="${n.title}">
      </figure>
      <div class="card-body p-4">
        <span class="badge badge-outline w-fit mb-1">${n.date}</span>
        <h3 class="card-title text-base">${n.title}</h3>
        <p class="opacity-70 text-sm">Discover helpful tips and insights for your beloved pets.</p>
        <div class="card-actions">
          <a href="https://wsava.org/wp-content/uploads/2021/04/Selecting-a-pet-food-for-your-pet-updated-2021_WSAVA-Global-Nutrition-Toolkit.pdf" class="link">Read more →</a>
        </div>
      </div>
    </article>
  `);
}
function mount() {
  const data = getData();

  // Render categories
  const categories = data.categories || [];
  const catRow = document.getElementById('catRow');
  if (catRow) {
    categories.forEach(c => catRow.appendChild(categoryCard(c)));
  }

  // Render featured products
  const featured = data.featured || [];
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    featured.forEach(p => featuredGrid.appendChild(productCard(p)));
  }

  // Render best selling products
  const best = data.bestSelling || [];
  const bestGrid = document.getElementById('bestGrid');
  if (bestGrid) {
    best.forEach(p => bestGrid.appendChild(productCard(p)));
  }

  // Render pets
  const pets = data.pets || [];
  const petRow = document.getElementById('petRow');
  if (petRow) {
    pets.forEach(p => petRow.appendChild(petPill(p)));
  }

  // Render blog
  const blog = data.blog || [];
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid) {
    blog.forEach(n => blogGrid.appendChild(blogCard(n)));
  }
}
window.scrollRow = (id, dir) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
