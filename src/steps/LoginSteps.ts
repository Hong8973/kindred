import { Page, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ProductsPage } from "../pages/ProductsPage";

export class LoginSteps {
    readonly page: Page;
    loginPage: LoginPage;
    productsPage: ProductsPage;

    constructor(page: Page){
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
    }

    async logIntoSwagLabs(username: string, password: string){
        await this.loginPage.inputUsername.fill(username);
        await this.loginPage.inputPassword.fill(password);
        await this.loginPage.btnLogin.click();
        await this.page.waitForLoadState();
        await expect(this.productsPage.inventoryList).toBeVisible();
    }
}