import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint } from "../config/config";

class productStore {
  productToBeUpdated: any | null = {};
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  createProduct(data: any) {
    this.loading = true;
    axios
      .post(productsEndPoint, {
        data: data,
      })
      .then((res) => {
        console.log("posted");
      });
  }

  updateProduct(data: any) {
    // this.products = products;
    // this.loading = false;
    this.productToBeUpdated = data;
  }
}

const ProductStore = new productStore();
export default ProductStore;
