# About project

Easy and fast woocommerce management stand alone application.\
If you have a slow woocommerce store or you need even faster management of your store, you just found a solution.\
Create/Update and manage your woocommerce store easy without delay's and overheads from your theme or plugins.\
Working with simple & variable products.

# Getting Started

From your Woocommerce site generate REST API keys with Read/Write permissions.\
[WooCommerce REST API Instructions](https://woocommerce.com/document/woocommerce-rest-api/)

Create an `.env` file in root directory providing the below values: \
`REACT_APP_WEBSITE = "https://your-site.com"` \
`REACT_APP_CONSUMER_KEY = "ck_consumerKey"` \
`REACT_APP_CONSUMER_SECRET = "cs_consumerSecret"` \
`REACT_APP_USERNAME = "login_username"` \
`REACT_APP_PASSWORD = "login_password"`

## Run the project

In the project directory, you can run: \
Run `npm install` \
Run `npm start` \
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Restrictions

For variable products, you can use only one attribute to be used as variations.\
For example if you have "size: S, M, L" and "color: Blue, Red, Black" as attributes you can create variations based on color's OR based on size's only.
