import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint, token } from "../config/config";

class productListStore {
  productVariations: any[] = [];
  loading = false;
  variationChanged = false;
  initialProductVariations: any[] = [];
  loadingSave = false;

  constructor() {
    makeAutoObservable(this);
  }

  //fetch variations
  // async getProductVariations(productId: number) {
  //   this.loading = true;
  //   axios({
  //     method: "get",
  //     url: productsEndPoint + productId + "/variations/?" + token,
  //   }).then((response) => {
  //     if (response && response.data && response.data.length > 0) {
  //       response.data.forEach((element: any) => {
  //         element.sku = element.sku + "-" + element.attributes[0]?.option;
  //       });
  //     }

  //     this.setProductVariation(response.data);
  //     this.loading = false;
  //   });
  // }
}

const ProductListStore = new productListStore();
export default ProductListStore;
