import { Page, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutYourInfoPage } from "../pages/CheckoutYourInfoPage";
import { CheckoutOverviewPage } from "../pages/CheckoutOverviewPage";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage";
import { ProductsSteps } from "./ProductsSteps";
import { faker } from "@faker-js/faker";
import { Product, ProductValues } from "../../interfaces/interfaces";

export class CheckoutSteps {
    readonly page: Page;
    expectedCartContents: ProductValues[];
    productsPage: ProductsPage;
    cartPage: CartPage;
    yourInfoPage: CheckoutYourInfoPage;
    overviewPage: CheckoutOverviewPage;
    checkoutCompletePage: CheckoutCompletePage;
    productSteps: ProductsSteps;

    constructor(page: Page) {
        this.page = page;
        this.expectedCartContents = [];
        this.productsPage = new ProductsPage(page);
        this.cartPage = new CartPage(page);
        this.yourInfoPage = new CheckoutYourInfoPage(page);
        this.overviewPage = new CheckoutOverviewPage(page);
        this.checkoutCompletePage = new CheckoutCompletePage(page);
        this.productSteps = new ProductsSteps(page);
    }

    /**
     * Proceeds with the checkout process
     * Entire cart contents was already verified with each add/remove.
     */
    async verifyYourInfoAndCheckout() {
        await this.productsPage.btnCart.click();
        const cartProducts = await this.productSteps.retrieveProductsDataAndLocators();
        await this.cartPage.btnCheckout.click();
        await this.verifyFieldsAndFillOutYourInfo();
        const checkoutProducts = await this.productSteps.retrieveProductsDataAndLocators();
        return { cartProducts, checkoutProducts }
    }

    async verifyFieldsAndFillOutYourInfo({
        firstName = faker.person.firstName(),
        lastName = faker.person.lastName(),
        postCode = "2000" // not randomised, because in most systems not all 4 digit numbers are valid Post Codes
    }: {
        firstName?: string;
        lastName?: string;
        postCode?: string;
    } = {}
    ) {
        await this.yourInfoPage.btnContinue.click();
        let error = await this.retrieveError();
        expect.soft(error, "First Name validation error should appear").toBe("Error: First Name is required");
        await this.handleFirstNameError(firstName);
        error = await this.retrieveError();
        expect.soft(error, "Last Name validation error should appear").toBe("Error: Last Name is required");
        await this.handleLastNameError(lastName);
        error = await this.retrieveError();
        expect.soft(error, "Postal Code validation error should appear").toBe("Error: Postal Code is required");
        await this.handlePostalCodeError(postCode);
        error = await this.retrieveError();
        expect.soft(error, "Unexpected error").toBeFalsy();
    }

    async verifyOverviewTotalsAndFinish(products: Product[]) {
        const subtotal = await this.retrieveAmountAsNumber(await this.overviewPage.subTotal.innerText());
        const tax = await this.retrieveAmountAsNumber(await this.overviewPage.tax.innerText());
        const total = await this.retrieveAmountAsNumber(await this.overviewPage.total.innerText());
        expect.soft(subtotal).toBe(await this.calculateSubTotal(products));
        expect.soft(tax).toBe(await this.calculateTax(subtotal));
        expect.soft(total).toBe(Number((subtotal + tax).toFixed(2)));
    }

    async verifyCheckoutComplete() {
        await this.overviewPage.btnFinish.click();
        await expect(this.checkoutCompletePage.headerComplete).toBeVisible();
    }

    async retrieveAmountAsNumber(text: string) {
        return Number(text.split("$")[1]);
    }

    async calculateSubTotal(products: Product[]) {
        let subtotal = 0;
        products.forEach(element => {
            subtotal += Number(element.productValues.price.replace("$", ""));
        });
        return subtotal;
    }

    async calculateTax(subTotal: number) {
        return Number((subTotal * 0.08).toFixed(2));
    }

    async retrieveError() {
        if (await this.yourInfoPage.errorMsg.isVisible()) {
            return await this.yourInfoPage.errorMsg.innerText();
        }
        else {
            return "";
        }
    }

    async handleFirstNameError(firstName: string) {
        await this.yourInfoPage.inputFirstName.fill(firstName);
        await this.yourInfoPage.btnContinue.click();
    }

    async handleLastNameError(lastName: string) {
        await this.yourInfoPage.inputLastName.fill(lastName);
        await this.yourInfoPage.btnContinue.click();
    }

    async handlePostalCodeError(postCode: string) {
        await this.yourInfoPage.inputZipPostalCode.fill(postCode);
        await this.yourInfoPage.btnContinue.click();
    }

}