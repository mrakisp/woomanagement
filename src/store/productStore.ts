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

  deleteProduct() {
    this.loading = true;
    const productData = this.productToBeUpdated;

    axios({
      method: "delete",
      url: productsEndPoint + productData.id + "?" + token,
      data: { force: true },
    }).then((response) => {
      this.resetLoading();
      this.initialProduct = {};
      this.productToBeUpdated = {};
    });
  }

  setSelectedUpdateProduct(data: {} | any) {
    this.productToBeUpdated = data;
    this.dataToBeUpdated.categories = data.categories;
    this.dataToBeUpdated.attributes = data.attributes;
  }

  resetToDefaultProduct() {
    for (var k in this.productToBeUpdated)
      this.productToBeUpdated[k] = this.initialProduct[k];

    this.isProductChanged = false;
  }

  setInitialProduct(data: {}) {
    this.initialProduct = data;
  }

  updateValueOfProduct(
    propertyToBeUpdated: string,
    value: string | number | boolean
  ) {
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

  updateAttributes(isChecked: boolean, attributes: any) {
    let attrindex = this.productToBeUpdated.attributes.findIndex(
      (attr: { id: any }) => attr.id === attributes.attributeId
    );
    if (isChecked) {
      if (attrindex > -1) {
        this.productToBeUpdated.attributes[attrindex].options = [
          ...this.productToBeUpdated.attributes[attrindex].options,
          attributes.option,
        ];
        this.dataToBeUpdated.attributes[attrindex].options = [
          ...this.dataToBeUpdated.attributes[attrindex].options,
          attributes.option,
        ];
      } else {
        this.productToBeUpdated.attributes.push({
          id: attributes.attributeId,
          options: [attributes.option],
        });
      }
    } else {
      this.productToBeUpdated.attributes[attrindex].options = filter(
        this.productToBeUpdated.attributes[attrindex].options,
        function (x) {
          return x !== attributes.option;
        }
      );
      this.dataToBeUpdated.attributes[attrindex].options = filter(
        this.productToBeUpdated.attributes[attrindex].options,
        function (x) {
          return x !== attributes.option;
        }
      );
    }
    this.isProductChanged = true;
  }

  updateAttributeVisibility(isChecked: boolean, id: string | number) {
    let attrindex = this.productToBeUpdated.attributes.findIndex(
      (attr: { id: any }) => attr.id === id
    );
    this.productToBeUpdated.attributes[attrindex].visible = isChecked;
    this.dataToBeUpdated.attributes[attrindex].visible = isChecked;
    this.isProductChanged = true;
  }

  resetLoading() {
    this.loading = false;
    this.isProductChanged = false;
  }
}

const ProductStore = new productStore();
export default ProductStore;
