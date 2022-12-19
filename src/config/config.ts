export const logInCredentials = {
  email: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
};

export const token =
  "consumer_key=" +
  process.env.REACT_APP_CONSUMER_KEY +
  "&consumer_secret=" +
  process.env.REACT_APP_CONSUMER_SECRET;

export const productsEndPoint =
  process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/products/";
// export const productsEndPoint =
//   process.env.REACT_APP_WEBSITE + "/wp-json/wc/v3/products?" + token;
