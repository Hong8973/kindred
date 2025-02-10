Kindred coding assessment

Objective: Develop an end-to-end test scenario for the successful purchase of any one of the listed products.

Document Test Scenario:

Log into Swag Labs and verify Inventory list appears 
Add a product via the Product Item Page 
Verify the Title, Description and Price on both Item page and Product Inventory page 
Add or Remove products from an array. And verify updates to the cart badge and cart contents 
Go to Cart and click Checkout 
Verify field validations, and proceed to Cart Overview 
Verify the Cart Overview has correct items 
Verify Cart Overview totals
Verify Checkout Complete

Assumptions: 
Assumed that the cart contents should be checked with each add/remove 
The tax is 8% of the subtotal 
The cart badge displays the number of items currently in the cart

Approach: 
I am open to using whichever style is use in any framework that I add to. 
However, my approach with this test scenario was make the steps modular and scalable. 
I also used interfaces to make it easier to pass data to other methods.

Scalability: 
addOrRemoveProductsAndVerifyUpdates shows scalability. It can be used for unlimited combinations. 
Which has been useful in my current role with complex contracts, 
where specific products are added or removed all the time.
