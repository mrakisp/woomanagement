export const logInCredentials = {
  email: "akis",
  password: "123",
};

const rest_api_creds = {
  website: "", // WEBSITE URL
  consumer_key: "", // CONSUMER KEY
  consumer_secret: "", // CONSUMER SECRET
};

const token =
  "consumer_key=" +
  rest_api_creds.consumer_key +
  "&consumer_secret=" +
  rest_api_creds.consumer_secret;
export const productsEndPoint =
  rest_api_creds.website + "/wp-json/wc/v3/products?" + token + "&";
