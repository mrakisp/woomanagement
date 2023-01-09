export const logInCredentials = {
  email: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
};

export const amountSymbol = "€";

export const token =
  "consumer_key=" +
  process.env.REACT_APP_CONSUMER_KEY +
  "&consumer_secret=" +
  process.env.REACT_APP_CONSUMER_SECRET;

export const productsEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/products/";
export const productsCountEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/reports/products/totals";
export const categoriesEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/products/categories/";
export const attributesEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/products/attributes/";
export const reportSalesEndPoint =
  process.env.REACT_APP_WEBSITE + "//wp-json/wc/v3/reports/sales/";
export const reportTopSellersEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/reports/top_sellers/";
export const reportOrdersEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/reports/orders/totals/";
