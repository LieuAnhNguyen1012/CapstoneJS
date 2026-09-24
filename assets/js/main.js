import { getProducts } from "./services/productServices.js";
import { Cart } from "./models/Cart.js";
const cart = new Cart();
try {
  const savedItems = JSON.parse(
    localStorage.getItem("phoneStoreCart") ?? "[]"
  );

  if (Array.isArray(savedItems)) {
    cart.items = savedItems;
  }
} catch (error) {
  console.error("Không đọc được giỏ hàng đã lưu:", error);
}



let allProducts = [];

async function loadProducts() {
    try {
        const products = await getProducts();
        allProducts = products;
        console.log("Danh sách sản phẩm:", products);

        renderProducts(products);

    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
    }
}

function renderCart() {
    const cartItems = document.querySelector("#cart-items");
    cartItems.replaceChildren();

    cart.items.forEach((item) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = item.product.name;
        const priceCell = document.createElement("td");
        priceCell.textContent = new Intl.NumberFormat("vi-VN").format(item.product.price);

        const quantityCell = document.createElement("td");
        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "-";
        decreaseButton.setAttribute("aria-label", `Giảm số lượng ${item.product.name}`);
        decreaseButton.addEventListener("click", () => {
            cart.changeQuantity(item.product.id, -1);
            renderCart();
        });

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute("aria-label", `Tăng số lượng ${item.product.name}`);

        increaseButton.addEventListener("click", () => {
            cart.changeQuantity(item.product.id, 1);
            renderCart();
        });

        quantityCell.append(decreaseButton, String(item.quantity), increaseButton);

        const subtotalCell = document.createElement("td");
        const subtotal = item.product.price * item.quantity;
        subtotalCell.textContent = new Intl.NumberFormat("vi-VN").format(subtotal);

        const actionCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Xóa";
        removeButton.setAttribute("aria-label", `Xóa ${item.product.name} khỏi giỏ`);

        removeButton.addEventListener("click", () => {
            cart.removeProduct(item.product.id);
            renderCart();
        });

        actionCell.append(removeButton);

        row.append(nameCell, priceCell, quantityCell, subtotalCell, actionCell);
        cartItems.append(row);
    });

    const total = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    document.querySelector("#cart-total").textContent =
        new Intl.NumberFormat("vi-VN").format(total);

    localStorage.setItem("phoneStoreCart", JSON.stringify(cart.items));
}

function renderProducts(products) {
    const productList = document.querySelector("#product-list");
    productList.replaceChildren();

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        const image = document.createElement("img");
        image.src = product.img;
        image.alt = product.name;
        image.loading = "lazy";

        const title = document.createElement("h2");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `Giá: ${new Intl.NumberFormat("vi-VN").format(product.price)}`;

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-to-cart";
        addButton.textContent = "Thêm vào giỏ";
        addButton.addEventListener("click", () => {
            cart.addProduct(product);
            renderCart();
            console.log("Giỏ hàng:", cart.items);
        });

        card.append(image, title, price, addButton);
        productList.append(card);
    });
}

const productFilter = document.querySelector("#product-filter");

productFilter.addEventListener("change", (event) => {
    const selectedType = event.target.value;

    const filteredProducts = selectedType === "all"
        ? allProducts
        : allProducts.filter(
            (product) => product.type.trim().toLowerCase() === selectedType
        );

    renderProducts(filteredProducts);
});

const checkoutButton = document.querySelector("#checkout-button");

checkoutButton.addEventListener("click", () => {
    if (cart.items.length === 0) return;

    cart.clear();
    renderCart();
});




renderCart();

loadProducts();