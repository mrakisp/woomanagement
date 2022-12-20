import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import productStore from "./productStore";

class searchStore {
  products: any = [];
  selectedProduct: {} = {};
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  /* PRODUCTS */
  async getProducts(searchBy: string, value: string) {
    this.products = [];
    this.loading = true;
    let params: any = {};
    params[searchBy] = value;

    axios({
      method: "get",
      url: productsEndPoint + "?" + token,
      params: params,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.setSearchProductResults(response.data);
      } else {
        this.resetLoading();
      }
    });
  }

  setSearchProductResults(results: []) {
    this.products = results;
    this.resetLoading();
  }

  setSelectedProduct() {
    if (this.products.length > 0) {
      this.selectedProduct = this.products[0];
      productStore.setSelectedUpdateProduct(this.products[0]);
    } else {
      console.log("Not Selected Product");
    }
  }

  /* END PRODUCTS */

  resetLoading() {
    this.loading = false;
  }

  resetAll() {
    this.loading = false;
    this.products = [];
    this.selectedProduct = {};
  }
}

const Searchstore = new searchStore();
export default Searchstore;
