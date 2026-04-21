import { test, expect } from '@playwright/test';

/**
 * NOTE: Because some tests required different cookie setups
 * than the test fixture, I decided to remove the evaluate all
 * to false function from them. This is because it's a bit
 * redundant to set them one way than immediately change them 
 * again. any tests that do not call for specific cookie values
 * still have the evaluate all to false component.
 */

test('TEST-1-RESET', async ({ page }) => {
    // preconditions, all cats are currently rented out
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });

    // reload to save updates
    await page.reload();

    await page.getByRole('link', { name: 'Reset' }).click();

    // make sure that all three items contain desired text
    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(0))
        .toContainText('ID 1. Jennyanydots');

    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(1))
        .toContainText('ID 2. Old Deuteronomy');

    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(2))
        .toContainText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Catalog' }).click();

    // make sure second item has an image with source specified in test
    await expect(page.locator('ol')
        .getByRole('listitem').nth(1)
        .getByRole('img')
    ).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Catalog' }).click();

    // check if there are 3 elements in the list
    await expect(
        page.locator('ul.list-group').getByRole('listitem')
    ).toHaveCount(3);

    // check if the third item says the specified string
    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(2))
        .toContainText("ID 3. Mistoffelees");
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    // check if there are buttons named "Rent" & "Return" on page
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();

});

test('TEST-5-RENT', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    // execution steps, attempt to rent out cat 1
    await page.getByTestId('rentID').click();
    await page.getByTestId('rentID').fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();

    // assert that cat one was rented and that items display postcondition text
    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(0))
        .toContainText('Rented out');

    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(1))
        .toContainText('ID 2. Old Deuteronomy');

    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(2))
        .toContainText('ID 3. Mistoffelees');
});

test('TEST-6-RETURN', async ({ page }) => {
    // set preconditions, cats 2 & 3 rented out
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });

    await page.reload();

    // execution steps, return cat number 2
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByTestId('returnID').click();
    await page.getByTestId('returnID').fill('2');
    await page.getByRole('button', { name: 'Return' }).click();

    //assert that all cats are listed and that returnResult is 'Success!'
    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(0))
        .toContainText('ID 1. Jennyanydots');

    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(1))
        .toContainText('ID 2. Old Deuteronomy');

    await expect(page.locator('ul.list-group')
        .getByRole('listitem').nth(2))
        .toContainText('Rented out');
        
    await expect(page.getByTestId('returnResult')).toContainText('Success!');
});


test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByTestId('catnips').click();
    await page.getByTestId('catnips').fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();

    await expect(page.getByTestId('feedResult')).toContainText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.locator('body')).toContainText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });

    await page.reload();

    await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');

    await expect(page.locator('body')).toContainText('Meow! from Jennyanydots.');
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    // preconditions, all cats are currently rented out
    await page.goto('http://localhost:8080');

    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });

    await page.reload();

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    await expect(page.locator('body')).toHaveScreenshot({ timeout: 30000 });
});