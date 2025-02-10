import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
    readonly inventoryList: Locator;

    constructor(page: Page) {
        super(page);
        this.inventoryList = this.page.locator('.inventory_container');
    }
}