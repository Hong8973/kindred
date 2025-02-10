import { Locator, Page, expect } from "@playwright/test";

export class BasePage {
    protected page: Page;
    readonly btnCart: Locator;
    readonly badgeCart: Locator;
    readonly btnBurgerMenu: Locator;
    readonly btnBurgerCross: Locator;

    // locators within the inventory list
    readonly title: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly btnAddToCart: Locator;
    readonly btnRemove: Locator;
    readonly imgProduct: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnCart = this.page.locator('.shopping_cart_link');
        this.badgeCart = this.page.locator('[data-test=shopping-cart-badge]');
        this.btnBurgerMenu = this.page.locator('#react-burger-menu-btn');
        this.btnBurgerCross = this.page.locator('#react-burger-cross-btn');
        
        // locators within each card inside the inventory list
        this.title = this.page.locator('[data-test=inventory-item-name]');
        this.description = this.page.locator('[data-test=inventory-item-desc]');
        this.price = this.page.locator('[data-test=inventory-item-price]');
        this.btnAddToCart = this.page.locator('button[id*=add-to-cart]');
        this.btnRemove = this.page.locator('button[id*=remove]');
        this.imgProduct = this.page.locator('.inventory_item_img a');
    }

    async clickSideBarLink(menuName: string){
        await this.btnBurgerMenu.click();
        const menu = this.page.locator(`[id*=sidebar_link]:text-is("${menuName}")`);
        await expect(menu).toBeVisible();
        await menu.click();
        if(await this.btnBurgerCross.isVisible()){
            await this.btnBurgerCross.click();
        }
    }

    async retrieveProductsLocators(){
        return await this.page.locator('[data-test=inventory-item]').all();
    }

}
