import { Locator } from "@playwright/test";

export interface ProductValues {
    title: string,
    description: string,
    price: string,
}

export interface Product {
    productValues: ProductValues,
    btnAddToCart: Locator,
    btnRemove: Locator,
    imgProduct: Locator,
}

/**
 * @param addProduct The name of the product to add to the cart. If it's already added, it will remain added.
 * @param removeProduct The name of the product. If it's already removed, it will remain removed.
 */
export interface ProductToAddOrRemove {
    addProduct?: string,
    removeProduct?: string,
}