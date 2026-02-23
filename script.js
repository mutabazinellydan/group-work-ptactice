function register(event) {
    event.preventDefault();
    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const msg = document.getElementById("regMessage");
    msg.textContent = "";
    if (!username || !email || !password || !confirmPassword) { msg.textContent = "Please fill all fields."; return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { msg.textContent = "Please enter a valid email."; return; }
    if (password !== confirmPassword) { msg.textContent = "Passwords do not match."; return; }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) { msg.textContent = "Password must be at least 8 characters and include uppercase, lowercase, and number."; return; }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.email === email)) { msg.textContent = "Email already registered."; return; }
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    window.location.href = "login.html";
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById("email2").value.trim();
    const password = document.getElementById("password2").value.trim();
    const msg = document.getElementById("loginMessage");
    msg.textContent = "";
    if (!email || !password) { msg.textContent = "Please fill all fields."; return; }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);
    if (!user) { msg.textContent = "Email not registered."; return; }
    if (user.password !== password) { msg.textContent = "Incorrect password."; return; }
    localStorage.setItem("loggedInUser", email);
    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const table = document.getElementById("productTable");
    const emptyState = document.getElementById("emptyState");
    table.innerHTML = "";
    if (products.length === 0) { emptyState.style.display = "block"; } 
    else {
        emptyState.style.display = "none";
        products.forEach((p, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>PRD-${String(i+1).padStart(3,'0')}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.quantity}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td><span class="status ${p.status === "In Stock" ? "in-stock" : "out-stock"}">${p.status}</span></td>
                <td><button class="deleteBtn" onclick="deleteProduct(${i})">Delete</button></td>
            `;
            table.appendChild(tr);
        });
    }
    updateCards();
}

function updateCards() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const total = products.length;
    const inStock = products.filter(p => p.status === "In Stock").length;
    const outStock = total - inStock;
    document.getElementById("totalProducts").textContent = total;
    document.getElementById("inStock").textContent = inStock;
    document.getElementById("outStock").textContent = outStock;
}

function showAddProductForm() { document.getElementById("addProductForm").style.display = "block"; }
function hideAddProductForm() { document.getElementById("addProductForm").style.display = "none"; document.getElementById("productMessage").textContent = ""; }

function addProduct() {
    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const quantity = Number(document.getElementById("productQuantity").value);
    const price = Number(document.getElementById("productPrice").value);
    const msg = document.getElementById("productMessage");
    msg.textContent = "";
    if (!name || !category || isNaN(quantity) || isNaN(price)) { msg.textContent = "Please fill all fields correctly."; return; }
    if (quantity < 0 || price < 0) { msg.textContent = "Quantity and price cannot be negative."; return; }
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const status = quantity > 0 ? "In Stock" : "Out of Stock";
    products.push({ name, category, quantity, price, status });
    localStorage.setItem("products", JSON.stringify(products));
    hideAddProductForm();
    loadProducts();
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    if (confirm(`Are you sure you want to delete ${products[index].name}?`)) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
    }
}

function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("productTable");
    const rows = table.getElementsByTagName("tr");
    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName("td");
        const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(input));
        row.style.display = match ? "" : "none";
    });
}

const sections = {
    navDashboard: "dashboardSection",
    navProducts: "productsSection",
    navReports: "reportsSection",
    navSettings: "settingsSection"
};

Object.keys(sections).forEach(navId => {
    document.getElementById(navId).addEventListener("click", () => {
        Object.values(sections).forEach(sec => { document.getElementById(sec).style.display = "none"; });
        document.getElementById(sections[navId]).style.display = "block";
        Object.keys(sections).forEach(n => document.getElementById(n).classList.remove("active"));
        document.getElementById(navId).classList.add("active");
    });
});
