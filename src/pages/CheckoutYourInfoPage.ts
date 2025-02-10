import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutYourInfoPage extends BasePage {
    readonly inputFirstName: Locator;
    readonly inputLastName: Locator;
    readonly inputZipPostalCode: Locator;
    readonly btnContinue: Locator;
    readonly errorMsg: Locator;

    constructor(page: Page) {
        super(page);
        this.inputFirstName = this.page.locator('[data-test=firstName]');
        this.inputLastName = this.page.locator('[data-test=lastName]');
        this.inputZipPostalCode = this.page.locator('[data-test=postalCode]');
        this.btnContinue = this.page.locator('#continue');
        this.errorMsg = this.page.locator('[data-test=error]');
    }


}