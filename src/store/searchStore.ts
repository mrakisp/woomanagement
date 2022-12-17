import { makeAutoObservable } from "mobx";
import axios from "axios";
import { productsEndPoint } from "../config/config";

interface SelectedProduct {
  name: string | undefined | null;
  id: number | undefined | null;
}

class searchStore {
  products: any = [];
  selectedProduct: any = {};
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  /* PRODUCTS */
  async getProducts(searchBy?: string | null | undefined, value?: any) {
    this.products = [];
    this.loading = true;

    const finalEndPoint = searchBy
      ? productsEndPoint + searchBy + "=" + value
      : productsEndPoint;

    axios.get(finalEndPoint).then((res) => {
      if (res && res.data && res.data.length > 0) {
        this.setSearchProductResults(res.data);
      } else {
        this.resetLoading();
      }
    });
  }

  setSearchProductResults(results: any) {
    results.forEach((product: any) => {
      this.products.push({
        name: product.name,
        id: product.id,
        sku: product.sku,
        image:
          product.images[0] && product.images[0].src
            ? product.images[0].src
            : null,
      });
    });
    this.resetLoading();
  }

  setSelectedProduct(selectedValue: SelectedProduct) {
    this.selectedProduct = {
      name: selectedValue.name,
      id: selectedValue.id,
    };
  }

  /* END PRODUCTS */

  resetLoading() {
    this.loading = false;
  }
}

const store = new searchStore();
export default store;
