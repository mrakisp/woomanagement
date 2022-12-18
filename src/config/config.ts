export const logInCredentials = {
  email: "akis",
  password: "123",
};

const rest_api_creds = {
  website: "https://test.solidcube.gr", // WEBSITE URL
  consumer_key: "ck_c48e3451655ea97691d58a7f1aa62c1826b4596d", // CONSUMER KEY
  consumer_secret: "cs_6a8a533069477d0f3968f83343e8d3cd74e809dc", // CONSUMER SECRET
};

const token =
  "consumer_key=" +
  rest_api_creds.consumer_key +
  "&consumer_secret=" +
  rest_api_creds.consumer_secret;
export const productsEndPoint =
  rest_api_creds.website + "/wp-json/wc/v3/products?" + token + "&";
