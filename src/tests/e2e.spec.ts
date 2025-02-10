import { test } from '@playwright/test';
import { LoginSteps } from '../steps/loginSteps';
import { ProductsSteps } from '../steps/ProductsSteps';
import { CheckoutSteps } from '../steps/CheckoutSteps';
import { APPCONSTANTS } from '../app.constants';
import * as data from './testdata/data.json';

test.beforeEach(async ({ page }) => {
    await page.goto(APPCONSTANTS.SWAG_LABS_URL);
});

test.describe("End to End Purchase", async () => {
    test.setTimeout(1 * 60 * 1000);
    let loginSteps: LoginSteps;
    let productsSteps: ProductsSteps;
    let checkoutSteps: CheckoutSteps;

    test('Purchase products, @e2e-01', async ({ page }) => {
        /**
         * Objective:
         * Develop an end-to-end test scenario for the successful purchase of any one of the listed products.
         * 
         * Document Test Scenario:
         * 
         * Log into Swag Labs and verify Inventory list appears
         * Add a product via the Product Item Page
         * Verify the Title, Description and Price on both Item page and Product Inventory page
         * Add or Remove products from an array. And verify updates to the cart badge and cart contents
         * Go to Cart and click Checkout
         * Verify field validations, and proceed to Cart Overview
         * Verify the Cart Overview has correct items
         * Verify Cart Overview totals
         * 
         * Assumptions:
         * Assumed that the cart contents should be checked with each add/remove
         * The tax is 11% of the subtotal
         * The cart badge displays the number of items currently in the cart
         * 
         * Approach:
         * I am open to using whichever style is use in any framework that I add to.
         * However, my approach with this test scenario was make the steps modular and scalable.
         * I also used interfaces to make it easier to pass data to other methods.
         * 
         * Scalability: addOrRemoveProductsAndVerifyUpdates shows scalability.
         * It can be used for unlimited combinations.
         * Which has been useful in my current role with complex contracts, 
         * where specific products are added or removed all the time.
         * 
         */
        const user = APPCONSTANTS.SWAG_LABS_USER;
        const password = APPCONSTANTS.SWAG_LABS_PW;
        const testData = data['e2e-01'];

        loginSteps = new LoginSteps(page);
        productsSteps = new ProductsSteps(page);
        checkoutSteps = new CheckoutSteps(page);

        await loginSteps.logIntoSwagLabs(user, password);
        const compareValues = await productsSteps.addProductViaProductItemPage(testData.addViaItemPage);
        await productsSteps.verifyItemValuesMatchProduct(compareValues);
        await productsSteps.addOrRemoveProductsAndVerifyUpdates(testData.addRemoveProducts);
        const { cartProducts, checkoutProducts } = await checkoutSteps.verifyYourInfoAndCheckout();
        await productsSteps.verifyCartContents({
            actualProducts: checkoutProducts,
            expectedCartProducts: cartProducts
        });
        await checkoutSteps.verifyOverviewTotalsAndFinish(checkoutProducts);
        await checkoutSteps.verifyCheckoutComplete();
    })
});

