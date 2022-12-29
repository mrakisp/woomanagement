import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import { filter, uniq, isEqual } from "lodash";
import variationsStore from "./variationsStore";

class productStore {
  productToBeUpdated: any | null = {};
  loading = false;
  isProductChanged = false;
  selectedCategories: any = [];
  initialProduct: any | null = {};
  dataToBeUpdated: any = {};
  attributesToBeUpdated: any;
  attributesWarning = false;

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
    this.attributesWarning = false;
    this.loading = true;
    const productData = this.productToBeUpdated;

    if (
      this.productToBeUpdated.type === "variable" &&
      !isEqual(
        this.productToBeUpdated.attributes,
        this.initialProduct.attributes
      )
    ) {
      this.attributesWarning = true;
      this.loading = false;
    } else {
      axios({
        method: "put",
        url: productsEndPoint + productData.id + "?" + token,
        data: this.dataToBeUpdated,
      }).then((response) => {
        this.resetLoading();
        this.initialProduct = response.data;
      });
    }
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

  //called when user select product from search
  setSelectedUpdateProduct(data: {} | any) {
    this.productToBeUpdated = data;
    this.dataToBeUpdated.categories = data.categories;
    this.dataToBeUpdated.attributes = data.attributes;
  }

  //reset
  resetToDefaultProduct() {
    for (var k in this.productToBeUpdated)
      this.productToBeUpdated[k] = this.initialProduct[k];

    this.isProductChanged = false;
  }

  setInitialProduct(data: {}) {
    this.initialProduct = data;
  }

  //update values in product object on user selection
  updateValueOfProduct(
    propertyToBeUpdated: string,
    value: string | number | boolean
  ) {
    this.productToBeUpdated[propertyToBeUpdated] = value;
    this.dataToBeUpdated[propertyToBeUpdated] = value;
    this.isProductChanged = true;
  }

  //update selected categories on user selection
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

  //update attributes on user selection
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
    if (
      this.dataToBeUpdated.attributes[attrindex] &&
      this.dataToBeUpdated.attributes[attrindex].options
    )
      this.dataToBeUpdated.attributes[attrindex].options = uniq(
        this.dataToBeUpdated.attributes[attrindex]?.options
      );

    if (this.productToBeUpdated.type !== "variable") {
      this.isProductChanged = true;
    }
  }

  //update attribute visibility
  updateAttributeVisibility(isChecked: boolean, id: string | number) {
    let attrindex = this.productToBeUpdated.attributes.findIndex(
      (attr: { id: any }) => attr.id === id
    );
    this.productToBeUpdated.attributes[attrindex].visible = isChecked;
    this.dataToBeUpdated.attributes[attrindex].visible = isChecked;
    this.isProductChanged = true;
  }

  // Used for variations in variations panel
  updateAttributeVariation(isChecked: boolean, id: string | number) {
    let attrindex = this.productToBeUpdated.attributes.findIndex(
      (attr: { id: any }) => attr.id === id
    );

    if (attrindex >= 0) {
      this.productToBeUpdated.attributes.forEach(
        (attr: { id: string | number; variation: boolean }) => {
          if (attr.id === id) {
            attr.variation = true;
          } else {
            attr.variation = false;
          }
        }
      );
      //this.isProductChanged = true;
      this.attributesToBeUpdated = this.productToBeUpdated.attributes;
    }

    // this.productToBeUpdated.attributes.find(
    //   (element: any) => element.id === id
    // ).variation = true;
    // this.dataToBeUpdated.attributes.find(
    //   (element: any) => element.id === id
    // ).variation = true;

    //if (attrindex > -1) {
    // this.productToBeUpdated.attributes[attrindex].variation = isChecked;
    // this.dataToBeUpdated.attributes[attrindex].variation = isChecked;
    //}

    // this.isProductChanged = true;
    // this.attributesToBeUpdated = this.productToBeUpdated.attributes;

    // this.updateVariationsFromAttributes();
  }

  // save button in attributes panel
  saveAttributeVariation() {
    this.attributesToBeUpdated = this.productToBeUpdated.attributes;

    if (
      this.productToBeUpdated.attributes.find(
        (element: any) => element.variation
      )
    ) {
      this.updateAttributesWithVariations();
    }
  }

  // invoke service - save attributes used for variations internally
  updateAttributesWithVariations() {
    variationsStore.loading = true;
    const productData = this.productToBeUpdated;

    axios({
      method: "put",
      url: productsEndPoint + productData.id + "?" + token,
      data: { attributes: this.attributesToBeUpdated },
    }).then((response) => {
      this.productToBeUpdated.attributes = response.data.attributes;
      // this.productToBeUpdated.variations = response.data.variations;
      this.dataToBeUpdated.attributes = response.data.attributes;
      // this.dataToBeUpdated.variations = response.data.variations;
      this.initialProduct.attributes = response.data.attributes;
      // this.initialProduct.variations = response.data.variations;

      this.createUpdateProductVariations();
    });
  }

  // invoke service - create and save variations based on selected attributes
  createUpdateProductVariations() {
    const index = this.productToBeUpdated.attributes.findIndex(
      (attr: { variation: boolean }) => attr.variation === true
    );

    const productData = this.productToBeUpdated;
    const createVariations = this.productToBeUpdated.attributes[index]
      ? this.productToBeUpdated.attributes[index].options
      : [];
    const selectedAttributeId = this.productToBeUpdated.attributes[index]?.id;

    let createVariTerms: any = [];

    createVariations.forEach((element: any, index: number) => {
      createVariTerms.push({
        attributes: [{ id: selectedAttributeId, option: element }],
      });
    });

    const data = {
      create: createVariTerms,
      delete: this.productToBeUpdated.variations,
    };

    axios({
      method: "post",
      url: productsEndPoint + productData.id + "/variations/batch?" + token,
      data,
    }).then((response) => {
      if (response && response.data && response.data.create?.length > 0) {
        response.data.create.forEach((element: any) => {
          element.sku = element.sku + "-" + element.attributes[0]?.option;
        });
        variationsStore.setProductVariation(response.data.create);
      } else {
        variationsStore.setProductVariation([]);
      }
      variationsStore.variationChanged = true;
      variationsStore.loading = false;
      // variationsStore.getProductVariations(productData.id);
      // variationsStore.loading = false;
    });
  }

  resetLoading() {
    this.loading = false;
    this.isProductChanged = false;
  }
}

const ProductStore = new productStore();
export default ProductStore;
