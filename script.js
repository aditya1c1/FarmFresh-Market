// --- Product Data (with tags & ratings) ---
const products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        price: 29.00,
        img: "basket-full-tomatoes.jpg",
        tags: ["Vegetable", "Organic"],
        rating: 4.5
    },
    {
        id: 2,
        name: "Organic Carrots",
        price: 19.00,
        img: "fresh-carrots-old-wooden-surface.jpg",
        tags: ["Vegetable", "Organic"],
        rating: 4.2
    },
    {
        id: 3,
        name: "Green Broccoli",
        price: 25.00,
        img: "white-plate-healthy-fresh-broccoli-stone-background.jpg",
        tags: ["Vegetable", "Fresh"],
        rating: 4.7
    },
    {
        id: 4,
        name: "Sweet Corn",
        price: 20.00,
        img: "seeds-sweet-corn-wooden-table.jpg",
        tags: ["Grain", "Seasonal"],
        rating: 4.6
    },
    {
        id: 5,
        name: "Golden Potatoes",
        price: 18.00,
        img: "natural-potatoes-table.jpg",
        tags: ["Vegetable"],
        rating: 4.3
    },
    {
        id: 6,
        name: "Red Apples",
        price: 35.00,
        img: "delicious-red-apples-isolated-white-table.jpg",
        tags: ["Fruit", "Organic"],
        rating: 4.8
    },
    {
        id: 7,
        name: "Juicy Oranges",
        price: 30.00,
        img: "oranges-market-stall.jpg",
        tags: ["Fruit", "Fresh"],
        rating: 4.4
    },
    {
        id: 8,
        name: "Fresh Spinach",
        price: 22.00,
        img: "fresh-green-baby-spinach-leaves-natural-background.jpg",
        tags: ["Vegetable", "Leafy"],
        rating: 4.1
    },
    {
        id: 9,
        name: "Farm Eggs (Dozen)",
        price: 40.00,
        img: "front-view-white-chicken-eggs-inside-basket-with-towel-dark-surface.jpg",
        tags: ["Eggs", "Farm Fresh"],
        rating: 4.9
    },
    {
        id: 10,
        name: "Raw Honey",
        price: 59.00,
        img: "front-view-honey-dipper-dripping-honey-honeycomb.jpg",
        tags: ["Honey", "Organic"],
        rating: 5.0
    }
];

// --- User Data ---
function getUser() {
    return JSON.parse(localStorage.getItem('user')) || { name: "Guest", email: "" };
}
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// --- Cart Functions ---
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(productId) {
    let cart = getCart();
    let found = cart.find(item => item.id === productId);
    if (found) {
        found.qty++;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    saveCart(cart);
    updateCartCount();
}
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartItems();
    updateCartCount();
}
function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        let cart = getCart();
        let total = cart.reduce((sum, item) => sum + item.qty, 0);
        countSpan.textContent = total;
    }
}

// --- Render Navigation Bar (dynamic user greet) ---
function renderNav() {
    const navUser = document.getElementById('nav-user-greet');
    if (navUser) {
        const user = getUser();
        navUser.textContent = user.name && user.name !== "Guest"
            ? `Hi, ${user.name}!`
            : '';
    }
}

// --- Render Products (Home) ---
function renderProducts() {
    const grid = document.getElementById('product-list');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.tabIndex = 0;

        // Tags
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'tags';
        product.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tag;
            tagsDiv.appendChild(tagEl);
        });

        // Image
        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.name;

        // Name
        const name = document.createElement('h3');
        name.textContent = product.name;

        // Rating
        const rating = document.createElement('div');
        rating.className = 'rating';
        rating.innerHTML = '★'.repeat(Math.floor(product.rating)) +
            (product.rating % 1 ? '½' : '');

        // Price (Rupee formatting)
        const price = document.createElement('p');
        price.textContent = product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

        // Add to Cart button
        const btn = document.createElement('button');
        btn.textContent = 'Add to Cart';
        btn.setAttribute('aria-label', `Add ${product.name} to cart`);
        btn.addEventListener('click', () => {
            addToCart(product.id);
            btn.textContent = "Added!";
            setTimeout(() => btn.textContent = "Add to Cart", 1000);
        });

        // Key-based event: Add to cart on Enter key
        card.addEventListener('keydown', function(e) {
            if (e.key === "Enter") {
                addToCart(product.id);
                btn.textContent = "Added!";
                setTimeout(() => btn.textContent = "Add to Cart", 1000);
            }
        });

        // Mouseover/mouseout events to highlight card
        card.addEventListener('mouseover', () => card.classList.add('highlight'));
        card.addEventListener('mouseout', () => card.classList.remove('highlight'));

        // Append elements
        card.appendChild(tagsDiv);
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(rating);
        card.appendChild(price);
        card.appendChild(btn);

        grid.appendChild(card);
    });
}

// --- Render Cart Items (Cart Page) ---
function renderCartItems() {
    const cartItemsSection = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItemsSection || !cartTotal) return;

    let cart = getCart();
    cartItemsSection.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const div = document.createElement('div');
        div.className = 'cart-item';

        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.name;

        const details = document.createElement('div');
        details.className = 'cart-item-details';
        details.innerHTML = `<strong>${product.name}</strong><br>
            ${product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} x ${item.qty} = ${(product.price * item.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.setAttribute('aria-label', `Remove ${product.name} from cart`);
        removeBtn.addEventListener('click', () => removeFromCart(product.id));

        // Mouseover/mouseout to highlight remove button
        removeBtn.addEventListener('mouseover', function() {
            this.classList.add('highlight-remove');
        });
        removeBtn.addEventListener('mouseout', function() {
            this.classList.remove('highlight-remove');
        });

        // DOM navigation: parentElement
        removeBtn.addEventListener('focus', function() {
            this.parentElement.classList.add('highlight');
        });
        removeBtn.addEventListener('blur', function() {
            this.parentElement.classList.remove('highlight');
        });

        div.appendChild(img);
        div.appendChild(details);
        div.appendChild(removeBtn);

        cartItemsSection.appendChild(div);

        total += product.price * item.qty;
    });

    cartTotal.textContent = total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    if (cart.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = "Your cart is empty. Go back to the shop!";
        cartItemsSection.appendChild(msg);
    }
}

// --- Checkout Function (Custom function with callback) ---
function checkout(callback) {
    let cart = getCart();
    if (cart.length === 0) {
        callback(false, "Cart is empty!");
        return;
    }
    localStorage.removeItem('cart');
    callback(true, "Thank you for your purchase! Your farm-fresh goods are on the way.");
}

// --- Render Profile Page ---
function renderProfile() {
    const user = getUser();
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    if (nameInput) nameInput.value = user.name !== "Guest" ? user.name : "";
    if (emailInput) emailInput.value = user.email || "";

    // Save button event
    const saveBtn = document.getElementById('profile-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const newName = nameInput.value.trim() || "Guest";
            const newEmail = emailInput.value.trim();
            saveUser({ name: newName, email: newEmail });
            renderNav();
            document.getElementById('profile-msg').textContent = "Profile updated!";
            setTimeout(() => document.getElementById('profile-msg').textContent = "", 1500);
        });
    }
}

// --- On Page Load ---
document.addEventListener('DOMContentLoaded', function() {
    renderNav();
    updateCartCount();

    // Home page
    if (document.getElementById('product-list')) {
        renderProducts();
    }
    // Cart page
    if (document.getElementById('cart-items')) {
        renderCartItems();
        // Checkout button event
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutMsg = document.getElementById('checkout-message');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                checkout(function(success, message) {
                    checkoutMsg.textContent = message;
                    checkoutMsg.classList.remove('hidden');
                    checkoutMsg.focus();
                    if (success) {
                        renderCartItems();
                        updateCartCount();
                    }
                });
            });
        }
    }
    // Profile page
    if (document.getElementById('profile-card')) {
        renderProfile();
    }
});
