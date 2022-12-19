import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";

class productStore {
  productToBeUpdated: any | null = {};
  loading = false;
  isProductChanged = false;

  constructor() {
    makeAutoObservable(this);
  }

  createProduct(data: any) {
    this.loading = true;
    axios({
      method: "post",
      url: productsEndPoint,
      data: data,
      // headers: {
      //   Authorization: `Basic ${process.env.TOKEN}`,
      // },
    }).then((response) => {
      console.log("posted", response);
      this.loading = false;
    });
  }

  updateProduct() {
    this.loading = true;
    const productData = this.productToBeUpdated;
    axios({
      method: "post",
      url: productsEndPoint + productData.id + "?" + token,
      data: productData,
    }).then((response) => {
      console.log("posted", response);
      this.loading = false;
      this.isProductChanged = false;
    });
  }

  setSelectedUpdateProduct(data: any) {
    this.productToBeUpdated = data;
  }

  updateValueOfProduct(propertyToBeUpdated: string, value: any) {
    this.productToBeUpdated[propertyToBeUpdated] = value;
    this.isProductChanged = true;
  }

  // setIsProductChanged() {
  //   this.isProductChanged = true;
  // }
}

const ProductStore = new productStore();
export default ProductStore;
