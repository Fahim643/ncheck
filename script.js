// Function to view product details
function viewProduct(name, price, description) {
    // Store the selected product details in localStorage
    const selectedProduct = { name, price, description };
    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));

    // Redirect to the product details page
    window.location.href = "product.html";
}

// Function to filter products based on search input
function filterProducts() {
    const searchValue = document.getElementById("search-box").value.toLowerCase();
    const products = document.querySelectorAll(".product");

    products.forEach((product) => {
        const productName = product.textContent.toLowerCase();
        if (productName.includes(searchValue)) {
            product.style.display = "block"; // Show product
        } else {
            product.style.display = "none"; // Hide product
        }
    });
}

// Function to update the cart count displayed on the page
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
}

// Function to view the cart
function viewCart() {
    window.location.href = "cart.html"; // Redirect to cart page
}

// Function to place an order (connects to the backend)
async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add products to your cart before placing an order.');
        return;
    }

    // Prepare order details
    const orderDetails = {
        products: cart,
        totalAmount: calculateTotalAmount(cart),
        user: { name: 'John Doe', email: 'john.doe@example.com' }, // Replace with actual user data if available
    };

    try {
        // Send order details to the backend
        const response = await fetch('https://server-snowy-kappa.vercel.app/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Order placed successfully:', data);
            alert('Order placed successfully!');
            localStorage.removeItem("cart"); // Clear cart after successful order
            updateCartCount(); // Update cart count display
        } else {
            console.error('Error placing order:', response.statusText);
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while placing the order.');
    }
}

// Helper function to calculate the total amount of the cart
function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.price, 0);
}

// Function to handle adding a product to the cart
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Update cart count after adding product
}

// Function to view the cart (on the cart page)
function viewCartPage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let cartHTML = "";
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Description: ${item.description}</p>
            </div>
        `;
    });
    cartHTML += `<button onclick="placeOrder()">Place Order</button>`;
    cartContainer.innerHTML = cartHTML;
}

// Call updateCartCount when the page loads to update the cart icon
updateCartCount();

