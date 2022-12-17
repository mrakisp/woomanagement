import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint } from "../config/config";

class productsStore {
  products = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  getProducts() {
    this.loading = true;
    axios.get(productsEndPoint).then((res) => {
      if (res.data && res.data.length > 0) {
        this.setProducts(res.data);
      }
    });
  }

  setProducts(products: any) {
    this.products = products;
    this.loading = false;
  }
}

const store = new productsStore();
export default store;
