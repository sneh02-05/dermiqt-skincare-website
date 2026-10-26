
let cart = JSON.parse(localStorage.getItem("dermiqt-cart")) || [];

const cartCountDisplay = document.getElementById("cart-count");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Add products to the cart
document.querySelectorAll(".add-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        const card = button.closest(".product-card");
        const name = card.querySelector("h3").textContent;
        const price = Number(
            card.querySelector(".product-price").textContent.replace(/[₹,]/g, "")
        );

        const existingItem = cart.find(function(item) {
            return item.name === name;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        button.textContent = "Added!";
        setTimeout(function() {
            button.textContent = "Add to Bag";
        }, 1000);
    });
});

// Display cart items and calculate total
function updateCart() {
    const totalQuantity = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);

    cartCountDisplay.textContent = totalQuantity;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your bag is empty.</p>";
    } else {
        cartItems.innerHTML = cart.map(function(item, index) {
            return `
                <div class="cart-item">
                    <img
                        class="cart-product-image"
                        src="${item.name === "Daily Glow Serum"
                            ? "images/serum.png"
                            : "images/cream.png"}"
                        alt="${item.name}"
                    >

                    <div class="cart-product-details">
                        <p><strong>${item.name}</strong></p>
                        <p>₹${item.price} each</p>

                        <div class="quantity-controls">
                            <button onclick="changeQuantity(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                        </div>

                        <button onclick="removeItem(${index})">Remove</button>
                        <p class="item-subtotal">
                            Subtotal: ₹${item.price * item.quantity}
                        </p>
                    </div>
                </div>
            `;
        }).join("");
    }

    const total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    cartTotal.textContent = total;
    localStorage.setItem("dermiqt-cart", JSON.stringify(cart));
}

// Increase or decrease quantity
function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

// Remove a product completely
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Open cart
document.getElementById("open-cart").addEventListener("click", function() {
    cartOverlay.style.display = "block";
});

// Close cart
document.getElementById("close-cart").addEventListener("click", function() {
    cartOverlay.style.display = "none";
});

// Close cart when clicking outside the panel
cartOverlay.addEventListener("click", function(event) {
    if (event.target === cartOverlay) {
        cartOverlay.style.display = "none";
    }
});

updateCart();
document.getElementById("continue-shopping").addEventListener("click", function() {
    cartOverlay.style.display = "none";
});