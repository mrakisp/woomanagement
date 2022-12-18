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
  async getProducts(searchBy?: string | null | undefined, value?: any) {
    this.products = [];
    this.loading = true;

    const finalEndPoint = searchBy
      ? productsEndPoint + searchBy + "=" + value
      : productsEndPoint;

    axios.get(finalEndPoint).then((res) => {
      if (res && res.data && res.data.length > 0) {
        this.setSearchProductResults(res.data);
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
