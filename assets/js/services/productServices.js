import { Products } from "../models/Products.js";

const PRODUCT_API_URL = "https://6ab377bb217e436588310572.mockapi.io/Products";

export async function getProducts() {
  const response = await fetch(PRODUCT_API_URL);

  if (!response.ok) {
    throw new Error("Không tải được danh sách sản phẩm.");
  }

  const data = await response.json();
  return data.map((item) => new Products(item));
}