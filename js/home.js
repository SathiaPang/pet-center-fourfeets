import { USE_FIREBASE, initFirebase, fetchCollection } from './firebase.js';

function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }
function productCard(p){ return el(`<div class="card bg-base-100 border border-base-200 hover:shadow-md transition">
  <figure class="aspect-square bg-base-200"><img src="${p.image}" alt="${p.title}" class="object-cover w-full h-full"/></figure>
  <div class="card-body p-4"><h3 class="card-title text-base">${p.title}</h3>
  <div class="flex items-center justify-between"><span class="font-semibold">$${Number(p.price).toFixed(2)}</span><button class="btn btn-sm">Add</button></div></div></div>`); }
function categoryCard(c){ return el(`<div class="carousel-item"><a class="card w-60 sm:w-64 bg-base-100 border border-base-200 hover:shadow-md transition"><figure class="aspect-[4/3]"><img class="object-cover w-full h-full" src="${c.image}"></figure><div class="card-body p-4"><h3 class="font-semibold">${c.name}</h3><p class="text-sm opacity-60">${c.count} products</p></div></a></div>`); }
function petPill(p){ return el(`<div class="carousel-item"><div class="btn btn-ghost gap-3 border border-base-200 rounded-full px-4"><div class="avatar"><div class="w-10 rounded-full"><img src="${p.image}"/></div></div><span class="font-medium">${p.name}</span></div></div>`); }
function blogCard(n){ return el(`<article class="card bg-base-100 border border-base-200 hover:shadow-md transition"><figure class="aspect-video"><img src="${n.image}" class="object-cover w-full h-full"></figure><div class="card-body p-4"><span class="badge badge-outline w-fit mb-1">${n.date}</span><h3 class="card-title text-base">${n.title}</h3><p class="opacity-70 text-sm">Short description placeholder.</p><div class="card-actions"><a href="#" class="link">Read more →</a></div></div></article>`); }

async function mount(){
  if (USE_FIREBASE) await initFirebase();
  const categories = await fetchCollection('categories'); categories.forEach(c => document.getElementById('catRow').appendChild(categoryCard(c)));
  const featured = await fetchCollection('featured'); featured.forEach(p => document.getElementById('featuredGrid').appendChild(productCard(p)));
  const best = await fetchCollection('bestSelling'); best.forEach(p => document.getElementById('bestGrid').appendChild(productCard(p)));
  const pets = await fetchCollection('pets'); pets.forEach(p => document.getElementById('petRow').appendChild(petPill(p)));
  const blog = await fetchCollection('blog'); blog.forEach(n => document.getElementById('blogGrid').appendChild(blogCard(n)));
}
window.scrollRow = (id, dir) => document.getElementById(id).scrollBy({ left: dir * 320, behavior: 'smooth' });
mount();
