# About project

Easy and fast woocommerce management stand alone application.\
If you have a slow woocommerce store or you need even faster and easier management of your store, you just found a solution.\
Create/Update and manage your woocommerce store easy without delay's and overheads from your theme or plugins.\
!! Working with simple & variable products. !!

# Getting Started

From your Woocommerce site generate REST API keys with Read/Write permissions.\
[WooCommerce REST API Instructions](https://woocommerce.com/document/woocommerce-rest-api/)

Rename `.env-sample` to `.env` file in root directory providing the below values: \
`REACT_APP_WEBSITE = "https://your-site.com"` (your store domain)\
`REACT_APP_CONSUMER_KEY = "ck_consumerKey"` (consumer key from woocommerce)\
`REACT_APP_CONSUMER_SECRET = "cs_consumerSecret"` (consumer secret from woocommerce)\
`REACT_APP_USERNAME = "login_username"` (woomanagement application login username)\
`REACT_APP_PASSWORD = "login_password"` (woomanagement application login password)

## Run the project

In the project directory, you can run: \
Run `npm install` \
Run `npm start` \
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Restrictions

For variable products, you can select only one attribute and its values to be used as variations.\
For example if you have "size: S, M, L" and "color: Blue, Red, Black" as attributes you can create variations based on color values OR based on size values.
