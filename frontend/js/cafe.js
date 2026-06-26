// --- UI Helpers ---
function showToast(message, type = 'error') {
    const toastEl = document.getElementById('appToast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set message
    toastMessage.innerText = message;
    
    // Style as error (red) or success (green)
    if (type === 'error') {
        toastEl.className = 'toast align-items-center border-0 shadow text-bg-danger';
    } else {
        toastEl.className = 'toast align-items-center border-0 shadow text-bg-success';
    }
    
    // Show using Bootstrap's JS API
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

const menuItems = [
    { name: "Cappuccino", price: 120, category: "Coffee", img: "https://www.honeywhatscooking.com/wp-content/uploads/2010/03/UNADJUSTEDNONRAW_thumb_5bbe-e1678861667981.jpg" },
    { name: "Latte", price: 140, category: "Coffee", img: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=500&q=80" },
    { name: "Burger", price: 180, category: "Food", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
    { name: "Pizza", price: 250, category: "Food", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" }
];

let cart = [];
let currentCategory = 'All';

// --- UI Enhanced Rendering Functions ---

function loadMenu(itemsToRender = menuItems) {
    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = "";

    if(itemsToRender.length === 0) {
        menuDiv.innerHTML = `
            <div class="col-12 text-center text-muted mt-5 fade-in">
                <div style="font-size: 4rem; margin-bottom: 15px;">🔍</div>
                <h5 class="fw-bold">No items found</h5>
                <p>Try searching for something else!</p>
            </div>
        `;
        return;
    }

    itemsToRender.forEach(item => {
        menuDiv.innerHTML += `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${item.img}" class="card-img-top" alt="${item.name}">
                    <div class="card-body d-flex flex-column text-center">
                        <h4 class="card-title fw-bold mb-1">${item.name}</h4>
                        <p class="card-text text-muted mb-3 fs-5">₹${item.price}</p>
                        <button class="btn btn-cafe mt-auto w-100" onclick="addToCart('${item.name}')">
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Handles the search and category UI interactions
function filterMenu(category) {
    if (category) currentCategory = category;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredItems = menuItems.filter(item => {
        const matchCategory = currentCategory === 'All' || item.category === currentCategory;
        const matchSearch = item.name.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });

    loadMenu(filteredItems);
}

// Bootstrapped cart rendering
function renderCart() {
    const cartDiv = document.getElementById("cart");
    const cartCountBadge = document.getElementById("cartCount");
    cartDiv.innerHTML = "";
    
    let total = 0;
    let totalItems = 0;

    if(cart.length === 0) {
        cartDiv.innerHTML = "<div class='text-center text-muted mt-5'>Your cart is empty</div>";
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
    
        cartDiv.innerHTML += `
            <div class="cart-item-anim d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm border">
                <div>
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">₹${item.price} each</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary rounded-circle px-2" onclick="decreaseQuantity('${item.name}')">-</button>
                    <span class="mx-3 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary rounded-circle px-2" onclick="increaseQuantity('${item.name}')">+</button>
                </div>
                <div class="fw-bold ms-3">
                    ₹${itemTotal}
                </div>
            </div>
        `;
    });

    console.log("Cart:", cart);
console.log("Total Items:", totalItems);
    
    // Update sticky cart badge count
    cartCountBadge.innerText = totalItems;
}


// --- Original Core Logic (Unchanged in Behavior) ---

function addToCart(name) {
    const menuItem = menuItems.find(item => item.name === name);
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: name,
            price: menuItem.price,
            quantity: 1
        });
    }
    renderCart();
}

function increaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if(item) {
        item.quantity++;
    }
    renderCart();
} 

function decreaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if(!item) return;

    item.quantity--;

    if(item.quantity <= 0) {
        cart = cart.filter(item => item.name !== name);
    }
    renderCart();
}

async function placeOrder() {
    if (cart.length === 0) {
        showToast("Your cart is empty! Add some items first.", "error");
        return;
    }

    const tableNumber = document.getElementById("tableNumber").value;

    if (!tableNumber) {
      showToast("Please enter your table number above.");
        return;
    }

    try {
        const response = await fetch("https://YOUR-RENDER-URL.onrender.com/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                table: tableNumber,
                items: cart
            })
        });

        const data = await response.json();
        console.log(data);
        alert("Order Sent!");
        
        // Clear cart on success
        cart = [];
        renderCart();
    } catch (error) {
        console.error("Order failed to send. Check if localhost:3000 is running.", error);
        alert("Error sending order. Please try again.");
    }
}

// Initialize App
loadMenu();
renderCart();