import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    readonly inputUsername: Locator;
    readonly inputPassword: Locator;
    readonly btnLogin: Locator;

    constructor(page: Page) {
        super(page);
        this.inputUsername = this.page.locator('#user-name');
        this.inputPassword = this.page.locator('#password');
        this.btnLogin = this.page.locator('#login-button');
    }
}