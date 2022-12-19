export const logInCredentials = {
  email: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
};

export const rest_api_creds = {
  website: process.env.REACT_APP_WEBSITE, // WEBSITE URL
  consumer_key: process.env.REACT_APP_CONSUMER_KEY, // CONSUMER KEY
  consumer_secret: process.env.REACT_APP_CONSUMER_SECRET, // CONSUMER SECRET
};

const token =
  "consumer_key=" +
  rest_api_creds.consumer_key +
  "&consumer_secret=" +
  rest_api_creds.consumer_secret;

export const productsEndPoint =
  rest_api_creds.website + "/wp-json/wc/v3/products?" + token;
