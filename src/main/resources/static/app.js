const API = 'http://localhost:8080/api';
let cartItems = [];

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function showSection(name) {
    ['products', 'cart', 'checkout', 'orders', 'admin'].forEach(s => {
        const el = document.getElementById(`${s}-section`);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(`${name}-section`);
    if (target) target.style.display = 'block';

    if (name === 'products') loadProducts();
    if (name === 'cart')     loadCart();
    if (name === 'orders')   loadOrders();
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
async function loadProducts() {
    try {
        const res = await fetch(`${API}/products`);
        const products = await res.json();
        const grid = document.getElementById('product-list');

        if (products.length === 0) {
            grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1">
                <div class="empty-icon">📦</div>
                <p>No products yet. Go to <strong>Admin</strong> to add products.</p>
            </div>`;
            return;
        }

        grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:160px;object-fit:cover;">` : '🛒'}</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.description || 'No description'}</p>
                <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
                <div class="product-stock">In Stock: ${p.quantity}</div>
                <button class="btn-primary btn-sm" onclick="addToCart(${p.id}, '${p.name.replace(/'/g,"\\'")}', ${p.price})">
                    Add to Cart
                </button>
            </div>
        </div>`).join('');
    } catch (e) {
        document.getElementById('product-list').innerHTML =
            '<p style="color:red">Could not load products. Is the server running?</p>';
    }
}

async function addProduct() {
    const name  = document.getElementById('prod-name').value.trim();
    const desc  = document.getElementById('prod-desc').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const qty   = parseInt(document.getElementById('prod-qty').value);
    const img   = document.getElementById('prod-img').value.trim();
    const msg   = document.getElementById('admin-msg');

    if (!name || !price || !qty) {
        msg.innerHTML = '<span class="error-msg">Please fill Name, Price and Quantity.</span>';
        return;
    }

    try {
        const res = await fetch(`${API}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description: desc, price, quantity: qty, imageUrl: img })
        });
        const product = await res.json();
        msg.innerHTML = `<span class="success-msg">✅ "${product.name}" added successfully!</span>`;
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-desc').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-qty').value = '';
        document.getElementById('prod-img').value = '';
        showToast(`Product "${product.name}" added!`);
    } catch (e) {
        msg.innerHTML = '<span class="error-msg">❌ Failed to add product.</span>';
    }
}

// ─── CART ─────────────────────────────────────────────────────────────────────
async function addToCart(productId, productName, price) {
    try {
        await fetch(`${API}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, productName, price, quantity: 1 })
        });
        await refreshCartCount();
        showToast(`"${productName}" added to cart!`);
    } catch (e) {
        showToast('Failed to add to cart.');
    }
}

async function loadCart() {
    try {
        const res = await fetch(`${API}/cart`);
        cartItems = await res.json();
        renderCart();
    } catch (e) {
        document.getElementById('cart-list').innerHTML = '<p style="color:red">Could not load cart.</p>';
    }
}

function renderCart() {
    const list    = document.getElementById('cart-list');
    const summary = document.getElementById('cart-summary');
    const actions = document.getElementById('cart-actions');
    updateCartBadge(cartItems.length);

    if (cartItems.length === 0) {
        list.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🛒</div>
            <p>Your cart is empty. <a href="#" onclick="showSection('products')">Browse products</a></p>
        </div>`;
        summary.innerHTML = '';
        actions.innerHTML = '';
        return;
    }

    list.innerHTML = cartItems.map(item => `
    <div class="cart-item">
        <div class="cart-item-info">
            <h4>${item.productName}</h4>
            <span>Qty: ${item.quantity}</span>
        </div>
        <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
        <button class="btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
    </div>`).join('');

    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    summary.innerHTML = `
    <div class="cart-summary">
        <div class="cart-total-text">Total: ₹${total.toLocaleString('en-IN')}</div>
        <div class="cart-actions">
            <button class="btn-danger" onclick="clearCart()">Clear Cart</button>
            <button class="btn-primary" onclick="goToCheckout()">Checkout →</button>
        </div>
    </div>`;
    actions.innerHTML = '';
}

async function removeFromCart(id) {
    await fetch(`${API}/cart/remove/${id}`, { method: 'DELETE' });
    await loadCart();
    showToast('Item removed from cart.');
}

async function clearCart() {
    await fetch(`${API}/cart/clear`, { method: 'DELETE' });
    await loadCart();
    showToast('Cart cleared.');
}

async function refreshCartCount() {
    const res = await fetch(`${API}/cart`);
    cartItems = await res.json();
    updateCartBadge(cartItems.length);
}

function updateCartBadge(count) {
    document.getElementById('cart-count').textContent = count;
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────
function goToCheckout() {
    if (cartItems.length === 0) { showToast('Cart is empty!'); return; }
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    document.getElementById('order-total-display').innerHTML =
        `<div class="order-total-box">Order Total: ₹${total.toLocaleString('en-IN')}</div>`;
    showSection('checkout');
}

async function placeOrder() {
    const name    = document.getElementById('cust-name').value.trim();
    const email   = document.getElementById('cust-email').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !email || !address) {
        showToast('Please fill all fields!');
        return;
    }

    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    try {
        const res = await fetch(`${API}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerName: name, customerEmail: email, address, totalAmount: total })
        });
        const order = await res.json();
        await fetch(`${API}/cart/clear`, { method: 'DELETE' });
        cartItems = [];
        updateCartBadge(0);
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-email').value = '';
        document.getElementById('cust-address').value = '';
        showToast(`Order #${order.id} placed successfully!`);
        showSection('orders');
    } catch (e) {
        showToast('Failed to place order.');
    }
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
async function loadOrders() {
    try {
        const res = await fetch(`${API}/orders`);
        const orders = await res.json();
        const list = document.getElementById('order-list');

        if (orders.length === 0) {
            list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No orders yet.</p>
            </div>`;
            return;
        }

        list.innerHTML = orders.slice().reverse().map(o => `
        <div class="order-card">
            <h4>Order #${o.id} — ${o.customerName}</h4>
            <p>📧 ${o.customerEmail}</p>
            <p>📍 ${o.address}</p>
            <p>🕐 ${new Date(o.orderDate).toLocaleString('en-IN')}</p>
            <div class="order-amount">₹${o.totalAmount.toLocaleString('en-IN')}</div>
            <span class="status-badge">${o.status}</span>
        </div>`).join('');
    } catch (e) {
        document.getElementById('order-list').innerHTML = '<p style="color:red">Could not load orders.</p>';
    }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.onload = () => {
    loadProducts();
    refreshCartCount();
};
