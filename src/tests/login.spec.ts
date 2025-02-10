import { test} from '@playwright/test';
import { LoginSteps } from '../steps/loginSteps';
import { APPCONSTANTS } from '../app.constants';

test.beforeEach(async ({ page }) => {
    await page.goto(APPCONSTANTS.SWAG_LABS_URL);
});

test.describe("Login smoke test", async () => {
    test.setTimeout(1 * 60 * 1000);
    let loginSteps: LoginSteps;

    test('Log into Swag Labs, @login-01', async ({ page }) => {
        loginSteps = new LoginSteps(page);
        await loginSteps.logIntoSwagLabs(APPCONSTANTS.SWAG_LABS_USER, APPCONSTANTS.SWAG_LABS_PW);
    })
});

