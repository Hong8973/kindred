import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutCompletePage extends BasePage {
    readonly headerComplete: Locator;

    constructor(page: Page) {
        super(page);
        this.headerComplete = this.page.locator('[data-test=title]:text-is("Checkout: Complete!")');
    }
}