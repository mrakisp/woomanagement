import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import { filter, uniq, isEqual } from "lodash";
import variationsStore from "./variationsStore";

// interface Product {
//   name: string;
//   slug: string;
//   permalink: string;
//   date_created: Date;
//   date_created_gmt: Date;
//   date_modified: Date;
//   date_modified_gmt: Date;
//   type: string;
//   status: string;
//   featured: false;
//   catalog_visibility: string;
//   description: string;
//   short_description: string;
//   sku: string;
//   price: string | number;
//   regular_price: string | number;
//   sale_price: string | number;
//   on_sale: false;
//   purchasable: true;
//   total_sales: 0;
//   virtual: false;
//   downloadable: false;
//   downloads: [];
//   tax_status: string;
//   tax_class: "";
//   manage_stock: boolean;
//   stock_quantity: number;
//   stock_status: string;
//   backorders: string;
//   backorders_allowed: false;
//   backordered: false;
//   sold_individually: false;
//   weight: string;
//   dimensions: {
//     length: string;
//     width: string;
//     height: string;
//   };
//   shipping_required: true;
//   shipping_taxable: true;
//   shipping_class: string;
//   shipping_class_id: 0;
//   reviews_allowed: true;
//   upsell_ids: [];
//   cross_sell_ids: [];
//   parent_id: 0;
//   categories: any;
//   tags: [];
//   images: [];
//   attributes: [];
//   default_attributes: [];
//   variations: [];
//   meta_data: [];
// }

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

  constructor() {
    makeAutoObservable(this);
  }

  createProduct(createView?: boolean) {
    //if is create product view and variations applied
    if (
      createView &&
      this.productToBeUpdated.attributes.find(
        (element: any) => element.variation
      )
    ) {
      this.productToBeUpdated.type = "variable"; //set variable automaticaly
      this.productToBeUpdated.manage_stock = false; //set general manage_stock automaticaly
      this.productToBeUpdated.status = "draft"; //set to draft until final save by user
    }

    axios({
      method: "post",
      url: productsEndPoint + "?" + token,
      data: this.productToBeUpdated,
    }).then((response) => {
      this.loading = false;

      if (
        createView &&
        this.productToBeUpdated.attributes.find(
          (element: any) => element.variation
        )
      ) {
        this.productToBeUpdated.attributes = response.data.attributes;

        this.productToBeUpdated.id = response.data.id; //set product id - automatic created
        this.updateAttributesWithVariations(createView);
      } else {
        this.resetCreateProduct();
      }
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
        if (viewState === "create") {
          this.resetCreateProduct();
        }
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

  resetCreateProduct(fromCancelButton?: boolean) {
    this.setCreateProductModel();
    this.initialProduct = {};
    this.userStatusSelection = "publish";
    this.loading = false;
    this.isProductChanged = false;
    this.selectedCategories = [];
    this.dataToBeUpdated = [];
    this.attributesToBeUpdated = {};
    this.attributesWarning = false;
    this.autoCreateVariations = false;
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
      manage_stock: true,
      stock_quantity: 0,
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
    }).then((response) => {
      this.productToBeUpdated.attributes = response.data.attributes;
      this.dataToBeUpdated.attributes = response.data.attributes;
      this.initialProduct.attributes = response.data.attributes;

      this.createUpdateProductVariations(createView);
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
      delete: this.productToBeUpdated.variations,
    };

    axios({
      method: "post",
      url: productsEndPoint + productData.id + "/variations/batch?" + token,
      data,
    }).then((response) => {
      if (response && response.data && response.data.create?.length > 0) {
        if (createView) {
          response.data.create.forEach((element: { id: any }) => {
            this.productToBeUpdated.variations.push(element.id);
          });
          this.autoCreateVariations = false;
        }
        variationsStore.setProductVariation(response.data.create, createView);
      } else {
        variationsStore.setProductVariation([]);
      }
      variationsStore.variationChanged = true;
      variationsStore.loading = false;
    });
  }

  resetLoading() {
    this.loading = false;
    this.isProductChanged = false;
  }
}

const ProductStore = new productStore();
export default ProductStore;
