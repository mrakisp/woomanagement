import { makeAutoObservable, configure } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import { filter, uniq, isEqual } from "lodash";
import variationsStore from "./variationsStore";

configure({
  enforceActions: "never",
});

class productStore {
  productToBeCreated: any | null = {};
  productToBeUpdated: any | null = {};
  loading = false;
  isProductChanged = false;
  selectedCategories: any = [];
  initialProduct: any | null = {};
  dataToBeUpdated: any = {};
  attributesToBeUpdated: any;
  attributesWarning = false;
  productsaved = false;
  autoCreateVariations = false; // for new product
  userStatusSelection: string = "publish";
  notValidFields = [{}];
  notValidVariations = [{}];
  isSavedAndClone = false;
  numberPressedForSku = 0;

  constructor() {
    makeAutoObservable(this);
  }

  createProduct(createView?: boolean) {
    this.loading = true;
    //if is create product view and variations applied
    if (
      createView &&
      this.productToBeUpdated.attributes.find(
        (element: any) => element.variation
      )
    ) {
      this.productToBeUpdated.type = "variable"; //set variable automaticaly
      this.productToBeUpdated.manage_stock = false; //set general manage_stock automaticaly
      if (this.autoCreateVariations) {
        this.productToBeUpdated.status = "draft";
      } //set to draft until final save by user
    }
    if (
      this.productToBeUpdated.type === "simple" &&
      this.productToBeUpdated.stock_quantity !== ""
    ) {
      this.productToBeUpdated.manage_stock = true;
    } else if (
      this.productToBeUpdated.type === "simple" &&
      !this.productToBeUpdated.stock_quantity
    ) {
      this.productToBeUpdated.stock_quantity = 0;
    }
    if (this.productToBeUpdated.type === "variable") {
      this.productToBeUpdated.stock_quantity = 0;
    }

    axios({
      method: "post",
      url: productsEndPoint + "?" + token,
      data: this.productToBeUpdated,
    })
      .then((response) => {
        this.loading = false;

        if (
          createView &&
          this.productToBeUpdated.attributes.find(
            (element: any) => element.variation
          )
        ) {
          this.productToBeUpdated.attributes = response.data.attributes;
          this.isSavedAndClone = true;
          this.productToBeUpdated.id = response.data.id; //set product id - automatic created
          this.updateAttributesWithVariations(createView);
        } else {
          if (this.isSavedAndClone) {
            this.productToBeUpdated.id = null;
            this.productToBeUpdated.sku = "";
            this.productToBeUpdated.name =
              this.productToBeUpdated.name + " Copy";
            this.loading = false;
            this.isProductChanged = false;
            this.productsaved = true;
          } else {
            this.resetCreateProduct();
          }
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.loading = false;
        return Promise.reject(error);
      });
  }

  updateProduct(viewState?: string) {
    this.attributesWarning = false;
    this.loading = true;
    const productData = this.productToBeUpdated;
    this.productToBeUpdated.status = this.userStatusSelection;
    this.dataToBeUpdated.status = this.userStatusSelection;

    if (
      this.productToBeUpdated.type === "variable" &&
      this.productToBeUpdated.variations.length > 0
    ) {
      variationsStore.productVariations.forEach((element) => {
        if (element.sku === this.productToBeUpdated.sku) {
          // alert(
          //   "Invalid or Duplicate sku in  variations. Please Change SKU's in Variations"
          // );
          element.sku = "";
        }
      });
      variationsStore.saveVariations(this.productToBeUpdated.id);
    }

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
      })
        .then((response) => {
          this.resetLoading();
          this.initialProduct = response.data;
          if (viewState === "create") {
            if (this.isSavedAndClone) {
              /*const preferences = getLocalStorageUtil("preferences");

              //JSON.parse(JSON.stringify(preferences)).autoGenSku
              let tempsku = this.productToBeUpdated.sku;
              if (this.numberPressedForSku > 0) {
                tempsku = this.productToBeUpdated.sku.slice(0, -1);
              }
              this.productToBeUpdated.sku = tempsku + this.numberPressedForSku;
              this.numberPressedForSku++;*/
              this.productToBeUpdated.sku = "";
              this.dataToBeUpdated.sku = "";

              this.productToBeUpdated.id = null;
              this.productToBeUpdated.name =
                this.productToBeUpdated.name + " Copy";
              this.loading = false;
              this.isProductChanged = false;
              this.productsaved = true;
              this.createTempProduct();
            } else {
              this.numberPressedForSku = 0;
              this.resetCreateProduct();
            }
          }
        })
        .catch((error) => {
          alert(
            error.response.data.message + " Please Change SKU's in Variations"
          );
          this.loading = false;
          return Promise.reject(error);
        });
    }
  }

  deleteProduct(viewState?: string) {
    this.loading = true;
    const productData = this.productToBeUpdated;

    axios({
      method: "delete",
      url: productsEndPoint + productData.id + "?" + token,
      data: { force: true },
    }).then((response) => {
      this.resetLoading();
      if (viewState && viewState === "create") {
        this.resetCreateProduct(true);
      } else {
        this.initialProduct = {};
        this.productToBeUpdated = {};
      }
    });
  }

  validateFields() {
    this.notValidFields = [];
    this.notValidVariations = [];
    if (!this.productToBeUpdated.sku) {
      this.notValidFields.push({ field: "sku" });
    }
    if (!this.productToBeUpdated.name) {
      this.notValidFields.push({ field: "name" });
    }

    if (this.productToBeUpdated.type !== "variable") {
      if (!this.productToBeUpdated.regular_price) {
        this.notValidFields.push({ field: "regular_price" });
      }
    } else {
      variationsStore.productVariations.forEach((element, index): void => {
        // if (!element.sku) {
        //   this.notValidVariations.push({ field: "sku", index: index });
        // }
        if (!element.regular_price) {
          this.notValidVariations.push({
            field: "regular_price",
            index: index,
          });
        }
      });
    }
    if (
      this.notValidFields.length <= 0 &&
      this.notValidVariations.length <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  resetCreateProduct(fromCancelButton?: boolean) {
    this.setCreateProductModel();
    this.initialProduct = {};
    this.userStatusSelection = "publish";
    this.loading = false;
    this.isProductChanged = false;
    this.selectedCategories = [];
    this.dataToBeUpdated = {};
    this.attributesToBeUpdated = {};
    this.attributesWarning = false;
    this.autoCreateVariations = false;
    this.notValidFields = [{}];
    this.notValidVariations = [{}];
    if (!fromCancelButton) this.productsaved = true;
  }

  //called when user select product from search
  setSelectedUpdateProduct(data: {} | any) {
    this.productToBeUpdated = data;
    this.dataToBeUpdated.categories = data.categories;
    this.dataToBeUpdated.attributes = data.attributes;
  }

  //reset
  resetToDefaultProduct(viewState: string) {
    if (viewState === "update") {
      for (var k in this.productToBeUpdated)
        this.productToBeUpdated[k] = this.initialProduct[k];

      this.isProductChanged = false;
    } else {
      if (this.productToBeUpdated.id) {
        this.deleteProduct(viewState);
      } else {
        this.resetCreateProduct(true);
      }
    }
  }

  setInitialProduct(data: {}) {
    this.initialProduct = data;
  }

  //set create product model for init
  setCreateProductModel() {
    this.productToBeUpdated = {
      name: "",
      slug: "",
      permalink: "",
      type: "simple",
      status: "publish",
      featured: false,
      description: "",
      short_description: "",
      sku: "",
      price: "",
      regular_price: "",
      sale_price: "",
      total_sales: 0,
      manage_stock: false,
      stock_quantity: "",
      backorders_allowed: false,
      backordered: false,
      sold_individually: false,
      weight: "",
      categories: [],
      tags: [],
      images: [],
      attributes: [],
      default_attributes: [],
      variations: [],
      meta_data: [],
    };
  }

  //update values in product object on user selection
  updateValueOfProduct(
    propertyToBeUpdated: string,
    value: string | number | boolean
  ) {
    this.productToBeUpdated[propertyToBeUpdated] = value;
    if (propertyToBeUpdated === "status") {
      this.userStatusSelection = String(value);
    }
    if (this.productToBeUpdated.id) {
      //is existing product
      this.dataToBeUpdated[propertyToBeUpdated] = value;
    }

    this.isProductChanged = true;
  }

  //update selected categories on user selection
  updateCategories(isChecked: boolean, categories: any) {
    if (isChecked) {
      this.productToBeUpdated.categories = [
        ...this.productToBeUpdated.categories,
        categories,
      ];
      if (this.productToBeUpdated.id) {
        //is not in create view
        this.dataToBeUpdated.categories = [
          ...this.dataToBeUpdated.categories,
          categories,
        ];
      }
    } else {
      this.productToBeUpdated.categories = filter(
        this.productToBeUpdated.categories,
        function (x) {
          return x.id !== categories.id;
        }
      );
      if (this.productToBeUpdated.id) {
        //is not in create view
        this.dataToBeUpdated.categories = filter(
          this.productToBeUpdated.categories,
          function (x) {
            return x.id !== categories.id;
          }
        );
      }
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
        //is not in create view
        if (this.productToBeUpdated.id) {
          this.dataToBeUpdated.attributes[attrindex].options = [
            ...this.dataToBeUpdated.attributes[attrindex].options,
            attributes.option,
          ];
        }
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
      if (this.productToBeUpdated.id) {
        //is not in create view
        this.dataToBeUpdated.attributes[attrindex].options = filter(
          this.productToBeUpdated.attributes[attrindex].options,
          function (x) {
            return x !== attributes.option;
          }
        );
      }
    }
    if (
      this.productToBeUpdated.id &&
      attrindex > -1 &&
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
    if (attrindex > -1) {
      this.productToBeUpdated.attributes[attrindex].visible = isChecked;
      if (this.productToBeUpdated.id) {
        //is not in create view
        this.dataToBeUpdated.attributes[attrindex].visible = isChecked;
      }

      this.isProductChanged = true;
    }
  }

  // Used for variations in variations panel
  updateAttributeVariation(
    isChecked: boolean,
    id: string | number,
    viewState?: string
  ) {
    let attrindex = this.productToBeUpdated.attributes.findIndex(
      (attr: { id: any }) => attr.id === id
    );

    if (attrindex >= 0) {
      this.productToBeUpdated.attributes.forEach(
        (attr: { id: string | number; variation: boolean }) => {
          if (
            viewState === "create" &&
            attr.id === id &&
            this.productToBeUpdated.variations.length <= 0
          ) {
            attr.variation = isChecked;
          } else if (
            viewState === "create" &&
            attr.id === id &&
            this.productToBeUpdated.variations.length > 0
          ) {
            attr.variation = true;
          } else if (viewState === "update" && attr.id === id) {
            attr.variation = true;
          } else {
            attr.variation = false;
          }
        }
      );
      this.attributesToBeUpdated = this.productToBeUpdated.attributes;
    }
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

  createTempProduct() {
    if (this.isSavedAndClone) {
      this.isSavedAndClone = false;
    }
    this.autoCreateVariations = true;
    this.createProduct(true);
  }

  // invoke service - save attributes used for variations internally
  updateAttributesWithVariations(createView?: boolean) {
    variationsStore.loading = true;
    const productData = this.productToBeUpdated;

    axios({
      method: "put",
      url: productsEndPoint + productData.id + "?" + token,
      data: { attributes: this.attributesToBeUpdated },
    })
      .then((response) => {
        this.productToBeUpdated.attributes = response.data.attributes;
        this.dataToBeUpdated.attributes = response.data.attributes;
        this.initialProduct.attributes = response.data.attributes;

        this.createUpdateProductVariations(createView);
      })
      .catch(function (error) {
        alert(error.response.data.message);
        return Promise.reject(error);
      });
  }

  // invoke service - create and save variations based on selected attributes
  createUpdateProductVariations(createView?: boolean) {
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
      delete:
        this.isSavedAndClone && createView
          ? []
          : this.productToBeUpdated.variations,
    };

    axios({
      method: "post",
      url: productsEndPoint + productData.id + "/variations/batch?" + token,
      data,
    })
      .then((response) => {
        if (response && response.data && response.data.create?.length > 0) {
          response.data.create.forEach((element: any) => {
            this.productToBeUpdated.variations.push(element.id);
            element.sku = ""; //element.sku + "-" + element.attributes[0]?.option;
          });
          if (createView) {
            //this.autoCreateVariations = false;
            this.isSavedAndClone = false;
          }
          variationsStore.setProductVariation(response.data.create, createView);
          // if (createView) {
          //   this.autoCreateVariations = false;
          // }
        } else {
          variationsStore.setProductVariation([]);
        }
        variationsStore.variationChanged = true;
        variationsStore.loading = false;
        // this.isProductChanged = false;
        this.loading = false;
      })
      .catch(function (error) {
        alert(error.response.data.message);
        return Promise.reject(error);
      });
  }

  async getProduct(productId: string) {
    axios({
      method: "get",
      url: productsEndPoint + productId + "?" + token,
    }).then((response) => {
      if (response && response.data) {
        this.setSelectedUpdateProduct(response.data);
      }
    });
  }

  resetLoading() {
    this.loading = false;
    this.isProductChanged = false;
  }
}

const ProductStore = new productStore();
export default ProductStore;
