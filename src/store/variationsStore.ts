import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";

class productVariationsStore {
  productVariations: any[] = [];
  loading = false;
  variationChanged = false;

  constructor() {
    makeAutoObservable(this);
  }

  //fetch variations
  async getProductVariations(productId: number) {
    this.loading = true;
    axios({
      method: "get",
      url: productsEndPoint + productId + "/variations/?" + token,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        response.data.forEach((element: any) => {
          element.sku = element.sku + "-" + element.attributes[0]?.option;
        });
      }
      this.setProductVariation(response.data);
      this.loading = false;
    });
  }

  setProductVariation(data: any) {
    data.sort(function (a: any, b: any) {
      return a.id - b.id || a.name.localeCompare(b.name);
    });
    this.productVariations = data;
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
  }

  saveVariations(productId: number) {
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
    }).then((response) => {
      this.variationChanged = false;
      // this.setProductVariation(response.data);
      // variationsStore.loading = false;
    });
  }
}

const ProductVariationsStore = new productVariationsStore();
export default ProductVariationsStore;
