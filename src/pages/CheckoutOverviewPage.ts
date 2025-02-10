import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutOverviewPage extends BasePage {
    readonly subTotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;
    readonly btnFinish: Locator;

    constructor(page: Page) {
        super(page);
        this.subTotal = this.page.locator('[data-test=subtotal-label]');
        this.tax = this.page.locator('[data-test=tax-label]');
        this.total = this.page.locator('[data-test=total-label]');
        this.btnFinish = this.page.locator('#finish');
    }
}