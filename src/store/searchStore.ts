import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import productStore from "./productStore";
// import productListStore from "./productListStore";

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
        this.setInitalRetrievedProduct(response.data);
      } else {
        // this.resetLoading();
        this.getProductsByName(value);
      }
    });
  }

  async getProductsByName(value: string) {
    this.products = [];
    this.loading = true;
    let params: any = {};
    params["search"] = value;

    axios({
      method: "get",
      url: productsEndPoint + "?" + token,
      params: params,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.setSearchProductResults(response.data);
        this.setInitalRetrievedProduct(response.data);
      } else {
        this.resetLoading();
      }
    });
  }

  setSearchProductResults(results: []) {
    this.products = results;
    this.resetLoading();
  }

  setSelectedProduct(selectedProduct: any) {
    if (this.products.length > 0) {
      this.selectedProduct = selectedProduct;
      productStore.setSelectedUpdateProduct(selectedProduct);
      productStore.isProductChanged = false;
    } else {
      console.log("Not Selected Product");
    }
  }

  setInitalRetrievedProduct(data: any[]) {
    productStore.setInitialProduct(data[0]);
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
