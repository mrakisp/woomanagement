import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";
import productStore from "./productStore";

class productVariationsStore {
  productVariations: any[] = [];
  loading = false;
  variationChanged = false;
  initialProductVariations: any[] = [];
  loadingSave = false;

  constructor() {
    makeAutoObservable(this);
  }

  //fetch variations
  async getProductVariations(productId: number) {
    if (!productStore.isSavedAndClone && !productStore.autoCreateVariations) {
      this.loading = true;
      axios({
        method: "get",
        url: productsEndPoint + productId + "/variations/?" + token,
      })
        .then((response) => {
          this.setProductVariation(response.data);
          this.loading = false;
        })
        .catch((error) => {
          alert(error.response.data.message);
          this.loading = false;
          return Promise.reject(error);
        });
    } else {
      productStore.autoCreateVariations = false;
    }
  }

  setProductVariation(data: any, createView?: boolean) {
    data.sort(function (a: any, b: any) {
      return a.id - b.id || a.name.localeCompare(b.name);
    });

    this.productVariations = data;
    this.initialProductVariations = data;
  }

  updateValueOfProduct(
    variationIndex: number,
    propertyToBeUpdated: string,
    value: string | number | boolean
  ) {
    this.productVariations[variationIndex][propertyToBeUpdated] = value;
    if (propertyToBeUpdated === "stock_quantity") {
      this.productVariations[variationIndex].manage_stock = true;
    }
    this.variationChanged = true;
    productStore.isProductChanged = true;
  }

  saveVariations(productId: number) {
    this.loadingSave = true;
    let updateVariationTerms: any = [];

    this.productVariations.forEach((element: any, index: number) => {
      updateVariationTerms.push({
        id: element.id,
        regular_price: element.regular_price,
        sale_price: element.sale_price,
        sku: element.sku,
        weight: element.weight,
        stock_quantity: element.stock_quantity,
        manage_stock: true,
        // manage_stock: element.manage_stock,
      });
    });

    const data = {
      update: updateVariationTerms,
    };

    axios({
      method: "post",
      url: productsEndPoint + productId + "/variations/batch?" + token,
      data,
    })
      .then((response) => {
        this.variationChanged = false;

        response.data.update.sort(function (a: any, b: any) {
          return a.id - b.id || a.name.localeCompare(b.name);
        });
        this.loadingSave = false;
      })
      .catch((error) => {
        alert(error.response.data.message + " Please change SKU in variations");
        this.loading = false;
        return Promise.reject(error);
      });
  }

  copyValues(property: string) {
    const valueToBePaste = this.productVariations[0][property];
    this.productVariations.forEach((element: any, index: number) => {
      element[property] = valueToBePaste;
    });
    this.variationChanged = true;
  }
}

const ProductVariationsStore = new productVariationsStore();
export default ProductVariationsStore;
