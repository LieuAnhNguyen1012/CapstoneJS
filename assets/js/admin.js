import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "./services/adminProductService.js";
import { setupCustomSelect } from "./components/customSelect.js";

let adminProducts = [];
let editingProductId = null;

async function loadAdminProducts() {
  try {
    const products = await getAdminProducts();
    adminProducts = products;
    console.log("Sản phẩm trang quản trị:", products);
    renderAdminProducts(products);
  } catch (error) {
    console.error("Không tải được sản phẩm quản trị:", error);
  }
}

function renderAdminProducts(products) {
  const productList = document.querySelector("#admin-product-list");
  productList.replaceChildren();

  products.forEach((product) => {
    const row = document.createElement("tr");

    const imageCell = document.createElement("td");
    const image = document.createElement("img");
    image.src = product.img;
    image.alt = product.name;
    image.className = "admin-product-image";
    imageCell.append(image);

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const typeCell = document.createElement("td");
    typeCell.textContent = product.type;

    const priceCell = document.createElement("td");
    priceCell.textContent = new Intl.NumberFormat("vi-VN").format(product.price);

    const actionCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Sửa";
    editButton.className = "admin-edit-button";
    editButton.addEventListener("click", () => {
      editingProductId = product.id;
      productForm.reset();

      for (const field of [
        "name",
        "price",
        "screen",
        "backCamera",
        "frontCamera",
        "img",
        "desc",
      ]) {
        productForm.elements.namedItem(field).value = product[field];
      }

      productForm.elements.namedItem("type").value =
        product.type.trim().toLowerCase();

      document.querySelector("#product-form-title").textContent = "Sửa sản phẩm";
      document.querySelector("#product-form-error").hidden = true;
      productFormSection.hidden = false;
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Xóa";
    deleteButton.className = "admin-delete-button";
    deleteButton.addEventListener("click", async () => {
      const confirmed = window.confirm(`Xóa sản phẩm "${product.name}"?`);
      if (!confirmed) return;

      try {
        await deleteAdminProduct(product.id);
        adminProducts = adminProducts.filter((item) => item.id !== product.id);
        updateAdminList();
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        window.alert("Không xóa được sản phẩm. Vui lòng thử lại.");
      }
    });

    actionCell.append(editButton, deleteButton);

    imageCell.dataset.label = "Ảnh";
    nameCell.dataset.label = "Tên";
    typeCell.dataset.label = "Loại";
    priceCell.dataset.label = "Giá";
    actionCell.dataset.label = "Thao tác";

    row.append(imageCell, nameCell, typeCell, priceCell, actionCell);
    productList.append(row);
  });
}

const searchInput = document.querySelector("#admin-search");
const sortSelect = document.querySelector("#admin-sort");

function updateAdminList() {
  const keyword = searchInput.value.trim().toLowerCase();

  const matchingProducts = adminProducts.filter((product) =>
    product.name.toLowerCase().includes(keyword)
  );

  if (sortSelect.value === "asc") {
    matchingProducts.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "desc") {
    matchingProducts.sort((a, b) => b.price - a.price);
  }

  renderAdminProducts(matchingProducts);
}

function readProductForm() {
  const formData = new FormData(productForm);
  return Object.fromEntries(formData.entries());
}

function validateProduct(values) {
  if (!values.name.trim()) {
    return "Vui lòng nhập tên sản phẩm.";
  }

  const price = Number(values.price);

  if (
    values.price.trim() === "" ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return "Giá phải là số lớn hơn 0.";
  }

  if (!["iphone", "samsung"].includes(values.type)) {
    return "Vui lòng chọn iPhone hoặc Samsung.";
  }

  const requiredFields = [
    ["screen", "màn hình"],
    ["backCamera", "camera sau"],
    ["frontCamera", "camera trước"],
    ["img", "đường dẫn ảnh"],
    ["desc", "mô tả"],
  ];

  for (const [field, label] of requiredFields) {
    if (!values[field].trim()) {
      return `Vui lòng nhập ${label}.`;
    }
  }

  try {
    const imageUrl = new URL(values.img.trim());

    if (!["http:", "https:"].includes(imageUrl.protocol)) {
      return "Ảnh phải có đường dẫn bắt đầu bằng http hoặc https.";
    }
  } catch {
    return "Đường dẫn ảnh không đúng định dạng URL.";
  }

  return "";
}

function buildProductData(values) {
  return {
    name: values.name.trim(),
    price: Number(values.price),
    type: values.type,
    screen: values.screen.trim(),
    backCamera: values.backCamera.trim(),
    frontCamera: values.frontCamera.trim(),
    img: values.img.trim(),
    desc: values.desc.trim(),
  };
}

searchInput.addEventListener("input", updateAdminList);
sortSelect.addEventListener("change", updateAdminList);

const addProductButton = document.querySelector("#add-product-button");
const productFormSection = document.querySelector("#product-form-section");
const productForm = document.querySelector("#product-form");

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formValues = readProductForm();
  const errorMessage = validateProduct(formValues);
  const errorElement = document.querySelector("#product-form-error");

  errorElement.textContent = errorMessage;
  errorElement.hidden = !errorMessage;

  if (errorMessage) return;

  try {
    const productData = buildProductData(formValues);

    if (editingProductId === null) {
      const createdProduct = await createAdminProduct(productData);
      adminProducts.push(createdProduct);
    } else {
      const updatedProduct = await updateAdminProduct(
        editingProductId,
        productData
      );

      adminProducts = adminProducts.map((item) =>
        item.id === editingProductId ? updatedProduct : item
      );
    }

    updateAdminList();
    editingProductId = null;
    productForm.reset();
    productFormSection.hidden = true;
  } catch (error) {
    errorElement.textContent = "Không lưu được sản phẩm. Vui lòng thử lại.";
    errorElement.hidden = false;
    console.error("Lỗi lưu sản phẩm:", error);
  }
});

addProductButton.addEventListener("click", () => {
  editingProductId = null;
  productForm.reset();
  productFormSection.hidden = false;
  document.querySelector("#product-form-title").textContent = "Thêm sản phẩm";
  document.querySelector("#product-form-error").hidden = true;
});

const cancelProductButton = document.querySelector("#cancel-product-button");

cancelProductButton.addEventListener("click", () => {
  editingProductId = null;
  productForm.reset();
  productFormSection.hidden = true;
  document.querySelector("#product-form-error").hidden = true;
});

setupCustomSelect("admin-sort");
loadAdminProducts();