import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";

class productStore {
  productToBeUpdated: any | null = {};
  loading = false;
  isProductChanged = false;
  selectedCategories: any = [];
  initialProduct: any | null = {};

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
      this.loading = false;
      this.isProductChanged = false;
    });
  }

  setSelectedUpdateProduct(data: {}) {
    this.productToBeUpdated = data;
  }

  resetToDefaultProduct() {
    for (var k in this.productToBeUpdated)
      this.productToBeUpdated[k] = this.initialProduct[k];

    // this.productToBeUpdated = this.initialProduct;
    this.isProductChanged = false;
  }

  setInitialProduct(data: {}) {
    this.initialProduct = data;
  }

  updateValueOfProduct(propertyToBeUpdated: string, value: any) {
    this.productToBeUpdated[propertyToBeUpdated] = value;
    this.isProductChanged = true;
  }

  updateCategories(isChecked: boolean, categories: any) {
    if (isChecked) {
      this.productToBeUpdated.categories = [
        ...this.productToBeUpdated.categories,
        categories,
      ];
    } else {
      const indexOfObject = this.productToBeUpdated.categories.findIndex(
        (object: any) => {
          return object.id === categories.id;
        }
      );
      this.productToBeUpdated.categories.splice(indexOfObject, 1);
    }

    this.isProductChanged = true;
  }
}

const ProductStore = new productStore();
export default ProductStore;
