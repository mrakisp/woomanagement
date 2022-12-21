import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import { filter } from "lodash";

class productStore {
  productToBeUpdated: any | null = {};
  loading = false;
  isProductChanged = false;
  selectedCategories: any = [];
  initialProduct: any | null = {};
  dataToBeUpdated: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  createProduct(data: any) {
    this.loading = true;
    axios({
      method: "post",
      url: productsEndPoint,
      data: data,
    }).then((response) => {
      this.loading = false;
    });
  }

  updateProduct() {
    this.loading = true;
    const productData = this.productToBeUpdated;

    axios({
      method: "put",
      url: productsEndPoint + productData.id + "?" + token,
      data: this.dataToBeUpdated,
    }).then((response) => {
      this.resetLoading();
      this.initialProduct = response.data;
    });
  }

  setSelectedUpdateProduct(data: {} | any) {
    this.productToBeUpdated = data;
    this.dataToBeUpdated.categories = data.categories;
  }

  resetToDefaultProduct() {
    for (var k in this.productToBeUpdated)
      this.productToBeUpdated[k] = this.initialProduct[k];

    this.isProductChanged = false;
  }

  setInitialProduct(data: {}) {
    this.initialProduct = data;
  }

  updateValueOfProduct(propertyToBeUpdated: string, value: any) {
    this.productToBeUpdated[propertyToBeUpdated] = value;
    this.dataToBeUpdated[propertyToBeUpdated] = value;
    this.isProductChanged = true;
  }

  updateCategories(isChecked: boolean, categories: any) {
    if (isChecked) {
      this.productToBeUpdated.categories = [
        ...this.productToBeUpdated.categories,
        categories,
      ];
      this.dataToBeUpdated.categories = [
        ...this.dataToBeUpdated.categories,
        categories,
      ];
    } else {
      this.productToBeUpdated.categories = filter(
        this.productToBeUpdated.categories,
        function (x) {
          return x.id !== categories.id;
        }
      );
      this.dataToBeUpdated.categories = filter(
        this.productToBeUpdated.categories,
        function (x) {
          return x.id !== categories.id;
        }
      );
    }

    this.isProductChanged = true;
  }

  resetLoading() {
    this.loading = false;
    this.isProductChanged = false;
  }
}

const ProductStore = new productStore();
export default ProductStore;
