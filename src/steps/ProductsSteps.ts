import { Page, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { SIDEBAR_LABELS } from "../../enums/swagLabs";
import { Product, ProductValues, ProductToAddOrRemove } from "../../interfaces/interfaces";

export class ProductsSteps {
    readonly page: Page;
    expectedCartContents: ProductValues[];
    productsPage: ProductsPage;
    cartPage: CartPage;

    constructor(page: Page) {
        this.page = page;
        this.expectedCartContents = [];
        this.productsPage = new ProductsPage(page);
        this.cartPage = new CartPage(page);
    }

    /**
     * Adds and/or Removes products from the cart. 
     * Verifies that the cart badge updates as each product is added/removed
     * If the product has already been added/removed, then it will remain that way.
     * Verifies that the entire cart contents updates correctly
     * @param productsAddRemoveList an array of ProductToAddOrRemove
     */
    async addOrRemoveProductsAndVerifyUpdates(productsAddRemoveList: ProductToAddOrRemove[]) {
        const productLocators = await this.retrieveProductsDataAndLocators();
        for (let i = 0; i < productsAddRemoveList.length; i++) {
            const addProductName = productsAddRemoveList[i].addProduct;
            const removeProductName = productsAddRemoveList[i].removeProduct;
            if (addProductName) {
                await this.addToCart(productLocators, addProductName);
            }
            if (removeProductName) {
                await this.removeFromCart(productLocators, removeProductName);
            }
        }
    }

    /**
     * From any page with the Burger Menu, go to Products and click on the item image
     * Verify the values are the same
     * Add the item to the cart from the Product Item page
     * Verifies that the entire cart contents updates correctly
     * @param productName 
     */
    async addProductViaProductItemPage(productName: string) {
        await this.productsPage.clickSideBarLink(SIDEBAR_LABELS.ALL_ITEMS);
        const productLocators = await this.retrieveProductsDataAndLocators();
        const i = await this.getProductIndex(productLocators, productName);
        await productLocators[i].imgProduct.click();
        const itemLocators = await this.retrieveProductsDataAndLocators();
        await this.addToCart(itemLocators, productName);
        return {
            productValues: productLocators[i].productValues,
            itemValues: itemLocators[0].productValues
        }
    }

    async verifyItemValuesMatchProduct({
        productValues,
        itemValues
    }: {
        productValues: ProductValues;
        itemValues: ProductValues;
    }) {
        expect(productValues, "Product Values on Item page should match Products Page")
            .toEqual(itemValues);
    }

    /**
     * Gets the Products from the current screen
     * @returns an array of Products with values and locators
     */
    async retrieveProductsDataAndLocators() {
        const productLocators = await this.productsPage.retrieveProductsLocators();
        const products = await Promise.all(
            productLocators.map(async (item) => {
                const product: Product = {
                    productValues: {
                        title: await item.locator(this.productsPage.title).innerText(),
                        description: await item.locator(this.productsPage.description).innerText(),
                        price: await item.locator(this.productsPage.price).innerText()
                    },
                    btnAddToCart: item.locator(this.productsPage.btnAddToCart),
                    btnRemove: item.locator(this.productsPage.btnRemove),
                    imgProduct: item.locator(this.productsPage.imgProduct),
                }
                return product;
            }),
        );
        return products;
    }

    async addToCart(products: Product[], productName: string) {
        const i = await this.getProductIndex(products, productName);
        const btnAdd = products[i].btnAddToCart;
        const btnRemove = products[i].btnRemove;
        if (await btnAdd.isVisible()) {
            const badgeTotal = await this.retrieveBadgeTotal();
            await btnAdd.click();
            await expect(btnAdd, "Add To Cart button should not be visible").not.toBeVisible();
            await expect(btnRemove, "Remove button should be visible").toBeVisible();
            expect(await this.retrieveBadgeTotal(), "Badge total should have increased").toBe(badgeTotal + 1);
            await this.productsPage.btnCart.click();
            // add the product to the expected cart contents
            this.expectedCartContents.push(products[i].productValues);
            await this.verifyCartContents({ actualProducts: await this.retrieveProductsDataAndLocators() });
            await this.cartPage.btnContinueShopping.click();
        }
    }

    async removeFromCart(products: Product[], productName: string) {
        const i = await this.getProductIndex(products, productName);
        const btnAdd = products[i].btnAddToCart;
        const btnRemove = products[i].btnRemove;
        if (await btnRemove.isVisible()) {
            const badgeTotal = await this.retrieveBadgeTotal();
            await btnRemove.click();
            await expect(btnAdd, "Add To Cart button should be visible").toBeVisible();
            await expect(btnRemove, "Remove button should not be visible").not.toBeVisible();
            expect(await this.retrieveBadgeTotal(), "Badge total should have decreased").toBe(badgeTotal - 1);
            await this.productsPage.btnCart.click();
            // remove the product from the expected cart contents
            const contentsIndex = this.expectedCartContents.findIndex((r: ProductValues) => r.title == productName);
            expect(contentsIndex, "Product should be in expected Cart Content").toBeGreaterThan(-1);
            this.expectedCartContents.splice(contentsIndex, 1);
            await this.verifyCartContents({ actualProducts: await this.retrieveProductsDataAndLocators() });
            await this.cartPage.btnContinueShopping.click();
        }
    }

    async retrieveBadgeTotal() {
        if (await this.productsPage.badgeCart.isVisible()) {
            return Number(await this.productsPage.badgeCart.innerText());
        }
        else {
            return 0;
        }
    }

    async getProductIndex(products: Product[], productName: string) {
        const i = products.findIndex((r: Product) => r.productValues.title == productName);
        expect(i, "Product should exist on current screen").toBeGreaterThan(-1);
        return i;
    }

    /**
     * To be called on the Cart Page or Checkout Overview
     * @param actualProducts array of Products from the current screen
     * @param expectedCartProducts array of Products from Checkout Overview. Leave undefined when using within ProductSteps
     */
    async verifyCartContents({
        actualProducts,
        expectedCartProducts,
    }: {
        actualProducts?: Product[],
        expectedCartProducts?: Product[]
    } = {}
    ) {
        if (!actualProducts) {
            actualProducts = await this.retrieveProductsDataAndLocators();
        }
        const addedProducts: ProductValues[] = [];
        actualProducts.forEach(element => {
            addedProducts.push(element.productValues);
        });
        let valuesOfCartContents: ProductValues[] = [];
        if (expectedCartProducts) {
            expectedCartProducts.forEach(element => {
                valuesOfCartContents.push(element.productValues);
            });
        }
        else {
            valuesOfCartContents = this.expectedCartContents;
        }
        expect(valuesOfCartContents, "Cart contents should update correctly").toEqual(addedProducts);
    }
}