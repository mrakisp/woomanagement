var CryptoJS = require("crypto-js");

export const setLocalStorageUtil = (
  key: string,
  value: string,
  encrypted?: boolean
) => {
  if (encrypted) {
    localStorage.setItem(
      key,
      CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value))
    );
  } else {
    localStorage.setItem(key, value);
  }
};

export const getLocalStorageUtil = (key: string, encrypted?: boolean) => {
  if (localStorage.getItem(key)) {
    if (encrypted) {
      return CryptoJS.enc.Base64.parse(localStorage.getItem(key)).toString(
        CryptoJS.enc.Utf8
      );
    } else {
      return localStorage.getItem(key);
    }
  }
};

//CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
