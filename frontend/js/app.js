import { api } from './api.js';
import { APP_CONFIG } from './config.js';
import { fallbackCategories, fallbackProducts } from './catalog-data.js';
import {
  addToCart,
  clearCart,
  getAuth,
  getCart,
  isAdmin,
  logout,
  removeCartItem,
  saveAuth,
  updateCartItem,
} from './store.js';

const state = {
  categories: [],
  products: [],
  catalogLoadedFromApi: false,
  currentProduct: null,
  catalogFilters: {
    q: '',
    category: '',
    sort: 'featured',
  },
  admin: {
    dashboard: null,
    products: [],
    orders: [],
    users: [],
  },
};

const viewIds = ['hero-view', 'catalog-view', 'product-view', 'cart-view', 'auth-view', 'account-view', 'admin-view', 'success-view'];

const els = {
  menuToggle: document.getElementById('menu-toggle'),
  siteNav: document.getElementById('site-nav'),
  cartButton: document.getElementById('cart-button'),
  cartCount: document.getElementById('cart-count'),
  userButton: document.getElementById('user-button'),
  userButtonText: document.getElementById('user-button-text'),
  navAdminLink: document.getElementById('nav-admin-link'),
  homeCategories: document.getElementById('home-categories'),
  featuredProducts: document.getElementById('featured-products'),
  catalogGrid: document.getElementById('catalog-grid'),
  catalogStatus: document.getElementById('catalog-status'),
  catalogSearch: document.getElementById('catalog-search'),
  catalogCategory: document.getElementById('catalog-category'),
  catalogSort: document.getElementById('catalog-sort'),
  catalogReset: document.getElementById('catalog-reset'),
  globalSearchForm: document.getElementById('global-search-form'),
  globalSearchInput: document.getElementById('global-search-input'),
  productContainer: document.getElementById('product-container'),
  cartItems: document.getElementById('cart-items'),
  cartSummary: document.getElementById('cart-summary'),
  toast: document.getElementById('toast'),
  logoutButton: document.getElementById('logout-button'),
  profileForm: document.getElementById('profile-form'),
  ordersList: document.getElementById('orders-list'),
  adminDashboard: document.getElementById('admin-dashboard'),
  adminProductsTable: document.getElementById('admin-products-table'),
  adminOrdersTable: document.getElementById('admin-orders-table'),
  adminUsersTable: document.getElementById('admin-users-table'),
  adminProductForm: document.getElementById('admin-product-form'),
  adminProductReset: document.getElementById('admin-product-reset'),
  adminProductCategory: document.getElementById('admin-product-category'),
};

function currency(amount) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: APP_CONFIG.CURRENCY }).format(Number(amount || 0));
}

function assetPath(imageName) {
  return `./public/images/categories/${imageName || 'papeleria.svg'}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showToast(message, timeout = 2800) {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => els.toast.classList.add('hidden'), timeout);
}

function setActiveView(viewId) {
  viewIds.forEach(id => document.getElementById(id).classList.toggle('hidden', id !== viewId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function currentAuth() {
  return getAuth();
}

function updateHeaderUI() {
  const auth = currentAuth();
  els.cartCount.textContent = String(getCart().reduce((sum, item) => sum + item.quantity, 0));
  els.userButtonText.textContent = auth?.user ? auth.user.first_name : 'Ingresar';
  els.navAdminLink.classList.toggle('hidden', !isAdmin());
}

function renderHome() {
  els.homeCategories.innerHTML = state.categories.map(category => `
    <a class="category-card" href="#catalog?category=${encodeURIComponent(category.slug)}" aria-label="Ver ${escapeHtml(category.name)}">
      <img src="${assetPath(category.slug === 'agendas' ? 'agenda.svg' : category.slug === 'planners' ? 'planner.svg' : category.slug === 'libretas' ? 'libreta.svg' : category.slug === 'stickers' ? 'stickers.svg' : category.slug === 'papeleria' ? 'papeleria.svg' : category.slug === 'accesorios' ? 'accesorio.svg' : 'regalo.svg')}" alt="" />
      <h3>${escapeHtml(category.name)}</h3>
      <p>${escapeHtml(category.description || '')}</p>
    </a>
  `).join('');

  const featured = [...state.products]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 4);

  els.featuredProducts.innerHTML = featured.map(productCard).join('');
}

function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-card-image" href="#product/${encodeURIComponent(product.slug)}">
        <img src="${assetPath(product.image_name)}" alt="${escapeHtml(product.name)}" />
      </a>
      <div class="product-card-body">
        <span class="product-category">${escapeHtml(product.category_name)}</span>
        <h3><a href="#product/${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a></h3>
        <p>${escapeHtml(product.short_description)}</p>
        <div class="product-meta-row">
          <span class="rating">★ ${Number(product.rating || 0).toFixed(1)} · ${product.reviews_count || 0} reseñas</span>
        </div>
        <div class="price-row">
          <div>
            <div class="price">${currency(product.price)}</div>
            <div class="compare-price">${currency(product.compare_at_price)}</div>
          </div>
          <button class="btn btn-primary" data-action="add-to-cart" data-id="${product.id}">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

function applyCatalogFilters() {
  const q = state.catalogFilters.q.trim().toLowerCase();
  let list = [...state.products];

  if (q) {
    list = list.filter(product =>
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.short_description.toLowerCase().includes(q)
    );
  }

  if (state.catalogFilters.category) {
    list = list.filter(product => product.category_slug === state.catalogFilters.category);
  }

  switch (state.catalogFilters.sort) {
    case 'price-asc':
      list.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      list.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      break;
    default:
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
  }

  return list;
}

function renderCatalog() {
  const filtered = applyCatalogFilters();

  els.catalogStatus.innerHTML = `
    <strong>${filtered.length}</strong> producto(s) · 
    ${state.catalogLoadedFromApi ? 'datos conectados al backend' : 'modo catálogo local'}
  `;

  els.catalogGrid.innerHTML = filtered.length
    ? filtered.map(productCard).join('')
    : `<div class="empty-state">No encontramos productos con esos filtros.</div>`;
}

async function renderProduct(slug) {
  const fallback = state.products.find(product => product.slug === slug);
  let product = fallback;

  try {
    const response = await api.getProduct(slug);
    product = response.product;
  } catch {
    // fallback local
  }

  if (!product) {
    els.productContainer.innerHTML = `<div class="empty-state">Ese producto no existe.</div>`;
    return;
  }

  state.currentProduct = product;
  const auth = currentAuth();
  const reviews = product.reviews || [];

  els.productContainer.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-media">
        <img src="${assetPath(product.image_name)}" alt="${escapeHtml(product.name)}" />
      </div>

      <div class="product-detail-content">
        <div>
          <span class="product-category">${escapeHtml(product.category_name)}</span>
          <h2>${escapeHtml(product.name)}</h2>
          <p>${escapeHtml(product.description)}</p>
        </div>

        <div class="price-row">
          <div>
            <div class="price">${currency(product.price)}</div>
            <div class="compare-price">${currency(product.compare_at_price)}</div>
          </div>
          <span class="rating">★ ${Number(product.rating || 0).toFixed(1)} · ${product.reviews_count || 0} reseñas</span>
        </div>

        <div class="product-info-list">
          <div class="info-badge">
            <span>SKU</span>
            <strong>${escapeHtml(product.sku || 'XIJ-000')}</strong>
          </div>
          <div class="info-badge">
            <span>Stock</span>
            <strong>${product.stock ?? 0} disponibles</strong>
          </div>
          <div class="info-badge">
            <span>Categoría</span>
            <strong>${escapeHtml(product.category_name)}</strong>
          </div>
        </div>

        <div class="product-actions">
          <label class="field-group qty-input">
            <span>Cantidad</span>
            <input id="product-qty" type="number" min="1" max="${product.stock || 99}" value="1" />
          </label>
          <button class="btn btn-primary" id="product-add-cart">Agregar al carrito</button>
          <a class="btn btn-secondary" href="#catalog">Seguir comprando</a>
        </div>

        <div class="card">
          <h3>Reseñas</h3>
          <div class="reviews-stack">
            ${reviews.length ? reviews.map(review => `
              <article class="review-card">
                <strong>${escapeHtml(review.title)}</strong>
                <div class="rating">★ ${Number(review.rating).toFixed(1)}</div>
                <p>${escapeHtml(review.comment)}</p>
                <small>${escapeHtml(review.first_name || '')} ${escapeHtml(review.last_name || '')}</small>
              </article>
            `).join('') : '<div class="empty-state">Aún no hay reseñas para este producto.</div>'}
          </div>
        </div>

        ${auth.user ? `
          <form id="review-form" class="card">
            <h3>Deja tu reseña</h3>
            <div class="form-grid">
              <div class="field-group">
                <label for="review-rating">Calificación</label>
                <select id="review-rating" required>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </div>
              <div class="field-group">
                <label for="review-title">Título</label>
                <input id="review-title" required />
              </div>
            </div>
            <div class="field-group">
              <label for="review-comment">Comentario</label>
              <textarea id="review-comment" rows="4" required></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Enviar reseña</button>
          </form>
        ` : `
          <div class="card">
            <p>Inicia sesión para dejar una reseña.</p>
            <a href="#login" class="btn btn-secondary">Ingresar</a>
          </div>
        `}
      </div>
    </div>
  `;

  document.getElementById('product-add-cart')?.addEventListener('click', () => {
    const quantity = Number(document.getElementById('product-qty').value || 1);
    addToCart(product, quantity);
    showToast(`${product.name} se agregó al carrito.`);
  });

  document.getElementById('review-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      await api.createReview(product.id, {
        rating: Number(document.getElementById('review-rating').value),
        title: document.getElementById('review-title').value.trim(),
        comment: document.getElementById('review-comment').value.trim(),
      });
      showToast('Gracias por tu reseña.');
      await renderProduct(slug);
    } catch (error) {
      showToast(error.message);
    }
  });
}

function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= APP_CONFIG.FREE_SHIPPING_FROM ? 0 : 99;
  const tax = Number((subtotal * 0.16).toFixed(2));
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

function renderCart() {
  const cart = getCart();
  const totals = cartTotals();
  if (!cart.length) {
    els.cartItems.innerHTML = `<div class="empty-state">Tu carrito está vacío.</div>`;
    els.cartSummary.innerHTML = `<div class="empty-state">Agrega un producto para empezar tu pedido.</div>`;
    return;
  }

  els.cartItems.innerHTML = cart.map(item => `
    <article class="cart-line">
      <img src="${assetPath(item.imageName)}" alt="${escapeHtml(item.name)}" />
      <div>
        <strong><a href="#product/${encodeURIComponent(item.slug)}">${escapeHtml(item.name)}</a></strong>
        <div>${currency(item.price)}</div>
        <div class="cart-line-actions">
          <label>
            <span class="sr-only">Cantidad para ${escapeHtml(item.name)}</span>
            <input type="number" min="1" value="${item.quantity}" data-action="update-cart" data-id="${item.productId}" />
          </label>
          <button class="small-button" data-action="remove-cart" data-id="${item.productId}">Eliminar</button>
        </div>
      </div>
      <strong>${currency(item.price * item.quantity)}</strong>
    </article>
  `).join('');

  els.cartSummary.innerHTML = `
    <div class="summary-block">
      <h3>Resumen</h3>
      <div class="summary-row"><span>Subtotal</span><strong>${currency(totals.subtotal)}</strong></div>
      <div class="summary-row"><span>Envío</span><strong>${currency(totals.shipping)}</strong></div>
      <div class="summary-row"><span>Impuestos</span><strong>${currency(totals.tax)}</strong></div>
      <div class="summary-row"><span>Total</span><strong>${currency(totals.total)}</strong></div>
    </div>

    <form id="checkout-form" class="stack-gap">
      <div class="summary-block">
        <h3>Datos de envío</h3>
        <div class="field-group">
          <label for="shipping-full-name">Nombre completo</label>
          <input id="shipping-full-name" required />
        </div>
        <div class="field-group">
          <label for="shipping-address1">Dirección</label>
          <input id="shipping-address1" required />
        </div>
        <div class="form-grid">
          <div class="field-group">
            <label for="shipping-city">Ciudad</label>
            <input id="shipping-city" required />
          </div>
          <div class="field-group">
            <label for="shipping-state">Estado</label>
            <input id="shipping-state" required />
          </div>
        </div>
        <div class="field-group">
          <label for="shipping-zip">Código postal</label>
          <input id="shipping-zip" required />
        </div>
      </div>

      <div class="summary-block">
        <h3>Facturación</h3>
        <div class="field-group">
          <label for="billing-full-name">Nombre completo</label>
          <input id="billing-full-name" required />
        </div>
      </div>

      <button class="btn btn-primary" type="submit">Pagar con Stripe</button>
      <button class="btn btn-secondary" type="button" id="clear-cart-button">Vaciar carrito</button>
      ${currentAuth().user ? '' : '<p>Para pagar debes iniciar sesión primero.</p>'}
    </form>
  `;

  document.getElementById('clear-cart-button')?.addEventListener('click', () => {
    clearCart();
    renderCart();
    updateHeaderUI();
  });

  document.getElementById('checkout-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!currentAuth().user) {
      showToast('Primero inicia sesión para completar la compra.');
      location.hash = '#login';
      return;
    }

    try {
      const payload = {
        items: getCart().map(item => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress: {
          fullName: document.getElementById('shipping-full-name').value.trim(),
          address1: document.getElementById('shipping-address1').value.trim(),
          city: document.getElementById('shipping-city').value.trim(),
          state: document.getElementById('shipping-state').value.trim(),
          zip: document.getElementById('shipping-zip').value.trim(),
        },
        billingAddress: {
          fullName: document.getElementById('billing-full-name').value.trim(),
        },
      };

      const response = await api.createCheckoutSession(payload);
      showToast('Redirigiendo a Stripe...');
      window.location.href = response.checkoutUrl;
    } catch (error) {
      showToast(error.message);
    }
  });
}

function setAuthTab(tabName) {
  document.querySelectorAll('.auth-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.authTab === tabName);
  });
  document.getElementById('login-form').classList.toggle('hidden', tabName !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tabName !== 'register');
  document.getElementById('forgot-form').classList.toggle('hidden', tabName !== 'forgot');
  document.getElementById('reset-form').classList.toggle('hidden', tabName !== 'reset');
}

function populateProfileForm(user) {
  document.getElementById('profile-first-name').value = user.first_name || '';
  document.getElementById('profile-last-name').value = user.last_name || '';
  document.getElementById('profile-email').value = user.email || '';
  document.getElementById('profile-phone').value = user.phone || '';
}

async function renderAccount() {
  const auth = currentAuth();
  if (!auth.user) {
    location.hash = '#login';
    return;
  }

  populateProfileForm(auth.user);

  try {
    const response = await api.getMyOrders();
    const orders = response.orders || [];
    els.ordersList.innerHTML = orders.length ? orders.map(order => `
      <article class="order-card">
        <div class="price-row">
          <div>
            <strong>${escapeHtml(order.order_number)}</strong>
            <div class="order-meta">
              <span>${new Date(order.created_at).toLocaleDateString('es-MX')}</span>
              <span>${currency(order.total)}</span>
              <span class="order-status ${order.status}">${escapeHtml(order.status)}</span>
            </div>
          </div>
        </div>
        <ul>
          ${order.items.map(item => `<li>${escapeHtml(item.product_name)} · ${item.quantity} × ${currency(item.unit_price)}</li>`).join('')}
        </ul>
      </article>
    `).join('') : '<div class="empty-state">Aún no tienes pedidos.</div>';
  } catch (error) {
    els.ordersList.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

function renderAdminMetrics(metrics) {
  els.adminDashboard.innerHTML = `
    <article class="metric-card"><span>Pedidos</span><strong>${metrics.orders ?? 0}</strong></article>
    <article class="metric-card"><span>Ingresos</span><strong>${currency(metrics.revenue ?? 0)}</strong></article>
    <article class="metric-card"><span>Usuarios</span><strong>${metrics.users ?? 0}</strong></article>
    <article class="metric-card"><span>Productos activos</span><strong>${metrics.activeProducts ?? 0}</strong></article>
  `;
}

function renderAdminTables() {
  els.adminProductsTable.innerHTML = `
    <table>
      <thead>
        <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${state.admin.products.map(product => `
          <tr>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.category_slug)}</td>
            <td>${currency(product.price)}</td>
            <td>${product.stock}</td>
            <td>${product.is_active ? 'Sí' : 'No'}</td>
            <td>
              <button class="small-button" data-admin-action="edit-product" data-id="${product.id}">Editar</button>
              <button class="small-button" data-admin-action="delete-product" data-id="${product.id}">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  els.adminOrdersTable.innerHTML = `
    <table>
      <thead>
        <tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th>Guardar</th></tr>
      </thead>
      <tbody>
        ${state.admin.orders.map(order => `
          <tr>
            <td>${escapeHtml(order.order_number)}</td>
            <td>${escapeHtml(order.first_name)} ${escapeHtml(order.last_name)}<br><small>${escapeHtml(order.email)}</small></td>
            <td>${currency(order.total)}</td>
            <td>${escapeHtml(order.payment_status)}</td>
            <td>
              <select data-order-status-id="${order.id}">
                ${['pending', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => `
                  <option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>
                `).join('')}
              </select>
            </td>
            <td>
              <button class="small-button" data-admin-action="save-order-status" data-id="${order.id}">Guardar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  els.adminUsersTable.innerHTML = `
    <table>
      <thead>
        <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Guardar</th></tr>
      </thead>
      <tbody>
        ${state.admin.users.map(user => `
          <tr>
            <td>${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
              <select data-user-role-id="${user.id}">
                <option value="customer" ${user.role === 'customer' ? 'selected' : ''}>customer</option>
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
              </select>
            </td>
            <td><button class="small-button" data-admin-action="save-user-role" data-id="${user.id}">Guardar</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function fillAdminProductForm(product = null) {
  document.getElementById('admin-product-id').value = product?.id || '';
  document.getElementById('admin-product-name').value = product?.name || '';
  document.getElementById('admin-product-slug').value = product?.slug || '';
  document.getElementById('admin-product-sku').value = product?.sku || '';
  document.getElementById('admin-product-category').value = product?.category_slug || state.categories[0]?.slug || '';
  document.getElementById('admin-product-price').value = product?.price || '';
  document.getElementById('admin-product-stock').value = product?.stock || '';
  document.getElementById('admin-product-image').value = product?.image_name || 'papeleria.svg';
  document.getElementById('admin-product-short').value = product?.short_description || '';
  document.getElementById('admin-product-description').value = product?.description || '';
  document.getElementById('admin-product-active').checked = product?.is_active ?? true;
}

async function renderAdmin() {
  if (!isAdmin()) {
    els.adminDashboard.innerHTML = '<div class="empty-state">No tienes permisos para ver esta sección.</div>';
    els.adminProductsTable.innerHTML = '';
    els.adminOrdersTable.innerHTML = '';
    els.adminUsersTable.innerHTML = '';
    return;
  }

  try {
    const [dashboard, products, orders, users] = await Promise.all([
      api.adminDashboard(),
      api.adminProducts(),
      api.adminOrders(),
      api.adminUsers(),
    ]);

    state.admin.dashboard = dashboard.metrics;
    state.admin.products = products.products || [];
    state.admin.orders = orders.orders || [];
    state.admin.users = users.users || [];

    renderAdminMetrics(state.admin.dashboard);
    renderAdminTables();
    fillAdminProductForm();
  } catch (error) {
    els.adminDashboard.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

async function syncAuthFromApi() {
  const auth = currentAuth();
  if (!auth.token) return;
  try {
    const response = await api.me();
    saveAuth({ ...auth, user: response.user });
  } catch {
    logout();
  }
}

async function loadCatalog() {
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      api.getCategories(),
      api.getProducts(),
    ]);
    state.categories = categoriesResponse.categories;
    state.products = productsResponse.products;
    state.catalogLoadedFromApi = true;
  } catch {
    state.categories = fallbackCategories;
    state.products = fallbackProducts;
    state.catalogLoadedFromApi = false;
  }

  els.catalogCategory.innerHTML = `<option value="">Todas</option>` + state.categories.map(category => `
    <option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>
  `).join('');
  els.adminProductCategory.innerHTML = state.categories.map(category => `
    <option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>
  `).join('');
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || 'home';
  const [route, queryString = ''] = raw.split('?');
  const segments = route.split('/');
  const params = new URLSearchParams(queryString);
  return { route: segments[0] || 'home', slug: segments[1], params };
}

async function router() {
  updateHeaderUI();

  const { route, slug, params } = parseHash();

  if (route === 'catalog') {
    if (params.get('q') !== null) state.catalogFilters.q = params.get('q') || '';
    if (params.get('category') !== null) state.catalogFilters.category = params.get('category') || '';
    if (params.get('sort') !== null) state.catalogFilters.sort = params.get('sort') || 'featured';
    els.catalogSearch.value = state.catalogFilters.q;
    els.catalogCategory.value = state.catalogFilters.category;
    els.catalogSort.value = state.catalogFilters.sort;
    renderCatalog();
    setActiveView('catalog-view');
    return;
  }

  if (route === 'product' && slug) {
    setActiveView('product-view');
    await renderProduct(decodeURIComponent(slug));
    return;
  }

  if (route === 'cart') {
    renderCart();
    setActiveView('cart-view');
    return;
  }

  if (route === 'login') {
    setAuthTab('login');
    setActiveView('auth-view');
    return;
  }

  if (route === 'register') {
    setAuthTab('register');
    setActiveView('auth-view');
    return;
  }

  if (route === 'forgot-password') {
    setAuthTab('forgot');
    setActiveView('auth-view');
    return;
  }

  if (route === 'reset-password' && slug) {
    setAuthTab('reset');
    document.getElementById('reset-form').dataset.token = decodeURIComponent(slug);
    setActiveView('auth-view');
    return;
  }

  if (route === 'account') {
    setActiveView('account-view');
    await renderAccount();
    return;
  }

  if (route === 'admin') {
    setActiveView('admin-view');
    await renderAdmin();
    return;
  }

  if (route === 'checkout-success') {
    clearCart();
    updateHeaderUI();
    setActiveView('success-view');
    return;
  }

  renderHome();
  setActiveView('hero-view');
}

function bindStaticEvents() {
  els.menuToggle.addEventListener('click', () => {
    const isOpen = els.siteNav.classList.toggle('open');
    els.menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  els.cartButton.addEventListener('click', () => {
    location.hash = '#cart';
  });

  els.userButton.addEventListener('click', () => {
    location.hash = currentAuth().user ? '#account' : '#login';
  });

  els.catalogSearch.addEventListener('input', event => {
    state.catalogFilters.q = event.target.value;
    renderCatalog();
  });

  els.catalogCategory.addEventListener('change', event => {
    state.catalogFilters.category = event.target.value;
    renderCatalog();
  });

  els.catalogSort.addEventListener('change', event => {
    state.catalogFilters.sort = event.target.value;
    renderCatalog();
  });

  els.catalogReset.addEventListener('click', () => {
    state.catalogFilters = { q: '', category: '', sort: 'featured' };
    els.catalogSearch.value = '';
    els.catalogCategory.value = '';
    els.catalogSort.value = 'featured';
    renderCatalog();
  });

  els.globalSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = els.globalSearchInput.value.trim();
    location.hash = `#catalog?q=${encodeURIComponent(value)}`;
  });

  document.body.addEventListener('click', event => {
    const addButton = event.target.closest('[data-action="add-to-cart"]');
    if (addButton) {
      const product = state.products.find(item => Number(item.id) === Number(addButton.dataset.id));
      if (product) {
        addToCart(product, 1);
        updateHeaderUI();
        showToast(`${product.name} se agregó al carrito.`);
      }
      return;
    }

    const removeButton = event.target.closest('[data-action="remove-cart"]');
    if (removeButton) {
      removeCartItem(removeButton.dataset.id);
      updateHeaderUI();
      renderCart();
      return;
    }

    const adminButton = event.target.closest('[data-admin-action]');
    if (adminButton) {
      handleAdminAction(adminButton.dataset.adminAction, adminButton.dataset.id);
    }
  });

  document.body.addEventListener('change', event => {
    if (event.target.matches('[data-action="update-cart"]')) {
      updateCartItem(event.target.dataset.id, event.target.value);
      updateHeaderUI();
      renderCart();
    }
  });

  document.querySelectorAll('.auth-tab').forEach(button => {
    button.addEventListener('click', () => setAuthTab(button.dataset.authTab));
  });

  document.getElementById('login-form').addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await api.login(Object.fromEntries(formData.entries()));
      saveAuth({ token: response.token, user: response.user });
      updateHeaderUI();
      showToast('Sesión iniciada correctamente.');
      location.hash = '#account';
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('register-form').addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await api.register(Object.fromEntries(formData.entries()));
      saveAuth({ token: response.token, user: response.user });
      updateHeaderUI();
      showToast('Cuenta creada correctamente.');
      location.hash = '#account';
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('forgot-form').addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await api.forgotPassword(Object.fromEntries(formData.entries()));
      showToast(response.message);
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('reset-form').addEventListener('submit', async event => {
    event.preventDefault();
    const password = document.getElementById('reset-password').value;
    const token = event.currentTarget.dataset.token;
    try {
      const response = await api.resetPassword({ token, password });
      showToast(response.message);
      location.hash = '#login';
    } catch (error) {
      showToast(error.message);
    }
  });

  els.logoutButton.addEventListener('click', () => {
    logout();
    updateHeaderUI();
    showToast('Sesión cerrada.');
    location.hash = '#home';
  });

  els.profileForm.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const payload = {
        firstName: document.getElementById('profile-first-name').value.trim(),
        lastName: document.getElementById('profile-last-name').value.trim(),
        phone: document.getElementById('profile-phone').value.trim(),
      };
      const response = await api.updateProfile(payload);
      saveAuth({ ...currentAuth(), user: response.user });
      updateHeaderUI();
      showToast('Perfil actualizado.');
    } catch (error) {
      showToast(error.message);
    }
  });

  els.adminProductReset.addEventListener('click', () => fillAdminProductForm());

  els.adminProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const id = document.getElementById('admin-product-id').value;
      const payload = {
        categorySlug: document.getElementById('admin-product-category').value,
        name: document.getElementById('admin-product-name').value.trim(),
        slug: document.getElementById('admin-product-slug').value.trim(),
        sku: document.getElementById('admin-product-sku').value.trim(),
        price: Number(document.getElementById('admin-product-price').value),
        stock: Number(document.getElementById('admin-product-stock').value),
        imageName: document.getElementById('admin-product-image').value,
        shortDescription: document.getElementById('admin-product-short').value.trim(),
        description: document.getElementById('admin-product-description').value.trim(),
        isActive: document.getElementById('admin-product-active').checked,
      };

      if (id) {
        await api.adminUpdateProduct(id, payload);
        showToast('Producto actualizado.');
      } else {
        await api.adminCreateProduct(payload);
        showToast('Producto creado.');
      }

      await refreshAdmin();
      fillAdminProductForm();
    } catch (error) {
      showToast(error.message);
    }
  });

  window.addEventListener('hashchange', router);
  window.addEventListener('cart:updated', () => {
    updateHeaderUI();
    if (location.hash === '#cart') renderCart();
  });
  window.addEventListener('auth:updated', () => {
    updateHeaderUI();
  });
}

async function handleAdminAction(action, id) {
  try {
    if (action === 'edit-product') {
      const product = state.admin.products.find(item => Number(item.id) === Number(id));
      fillAdminProductForm(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (action === 'delete-product') {
      if (!confirm('¿Eliminar este producto?')) return;
      await api.adminDeleteProduct(id);
      showToast('Producto eliminado.');
      await refreshAdmin();
      return;
    }

    if (action === 'save-order-status') {
      const select = document.querySelector(`[data-order-status-id="${id}"]`);
      await api.adminUpdateOrderStatus(id, select.value);
      showToast('Estado del pedido actualizado.');
      await refreshAdmin();
      return;
    }

    if (action === 'save-user-role') {
      const select = document.querySelector(`[data-user-role-id="${id}"]`);
      await api.adminUpdateUserRole(id, select.value);
      showToast('Rol del usuario actualizado.');
      await refreshAdmin();
    }
  } catch (error) {
    showToast(error.message);
  }
}

async function refreshAdmin() {
  await loadCatalog();
  await renderAdmin();
}

async function init() {
  bindStaticEvents();
  await syncAuthFromApi();
  await loadCatalog();
  renderHome();
  renderCatalog();
  updateHeaderUI();
  await router();
}

init();
