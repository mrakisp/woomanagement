import { makeAutoObservable } from "mobx";
import axios from "axios";
import {
  productsEndPoint,
  productsCountEndPoint,
  token,
} from "../config/config";

class productListStore {
  allProductsCount: number = 0;
  allProducts: [] = [];
  loading = false;
  variationChanged = false;
  initialProductVariations: any[] = [];
  loadingSave = false;

  constructor() {
    makeAutoObservable(this);
  }

  getAllProductsCount() {
    axios({
      method: "get",
      url: productsCountEndPoint + "?" + token,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        let totalProductsInStore = 0;
        response.data.forEach((element: any) => {
          totalProductsInStore = totalProductsInStore + element.total;
        });
        this.setTotalProductsCount(totalProductsInStore);
      }
      this.loading = false;
    });
  }
  //fetch products
  async getProducts(page: number, perpage: number) {
    this.loading = true;
    axios({
      method: "get",
      url:
        productsEndPoint +
        "?" +
        token +
        "&page=" +
        page +
        "&per_page=" +
        perpage,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.setProducts(response.data);
      }
      this.loading = false;
    });
  }

  async getProductVariations(productId: string | number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios({
        method: "get",
        url: productsEndPoint + productId + "/variations/?" + token,
      })
        .then((response) => resolve(response.data))
        .catch((error) => {
          alert(error.response.data.message);
          this.loading = false;
          return Promise.reject(error);
        });
    });
  }

  setProducts = (products: []) => {
    this.allProducts = products;
  };

  setTotalProductsCount = (totalProductsCount: number) => {
    this.allProductsCount = totalProductsCount;
  };
}

const ProductListStore = new productListStore();
export default ProductListStore;
