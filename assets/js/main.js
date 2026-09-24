import { getProducts } from "./services/productServices.js";

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

loadProducts();