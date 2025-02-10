import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    readonly btnContinueShopping: Locator;
    readonly btnCheckout: Locator;

    constructor(page: Page) {
        super(page);
        this.btnContinueShopping = this.page.locator('[data-test=continue-shopping]');
        this.btnCheckout = this.page.locator('[data-test=checkout]');
    }

}