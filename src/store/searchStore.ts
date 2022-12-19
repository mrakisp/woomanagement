import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint } from "../config/config";
import ProductStore from "./productStore";

class searchStore {
  products: any = [];
  selectedProduct: any = {};
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  /* PRODUCTS */
  async getProducts(searchBy: string | null | undefined, value: any) {
    this.products = [];
    this.loading = true;

    axios({
      method: "get",
      url: productsEndPoint,
      params: {
        searchBy: value,
      },
      // headers: {
      //   Authorization: `Basic ${process.env.TOKEN}`,
      // },
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.setSearchProductResults(response.data);
      } else {
        this.resetLoading();
      }
    });
  }

  setSearchProductResults(results: any) {
    this.products = results;
    this.resetLoading();
  }

  setSelectedProduct() {
    this.selectedProduct = this.products[0];
    ProductStore.updateProduct(this.products[0]);
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
