import { PRODUCT_API_URL } from "./productServices.js";
import { Products } from "../models/Products.js";

export async function getAdminProducts() {
  const response = await axios.get(PRODUCT_API_URL);
  return response.data.map((item) => new Products(item));
}

export async function createAdminProduct(productData) {
  const response = await axios.post(PRODUCT_API_URL, productData);
  return new Products(response.data);
}

export async function deleteAdminProduct(id) {
  await axios.delete(`${PRODUCT_API_URL}/${encodeURIComponent(id)}`);
}

export async function updateAdminProduct(id, productData) {
  const response = await axios.put(
    `${PRODUCT_API_URL}/${encodeURIComponent(id)}`,
    productData
  );

  return new Products(response.data);
}