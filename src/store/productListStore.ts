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
  hasSearchedValues = false;

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

  async searchProducts(value: string) {
    this.loading = true;
    let params: any = {};
    params["sku"] = value;

    axios({
      method: "get",
      url: productsEndPoint + "?" + token,
      params: params,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.hasSearchedValues = true;
        this.setProducts(response.data);
      } else {
        this.searchProductsByName(value);
      }
    });
  }

  async searchProductsByName(value: string) {
    this.loading = true;
    let params: any = {};
    params["search"] = value;

    axios({
      method: "get",
      url: productsEndPoint + "?" + token,
      params: params,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.hasSearchedValues = true;
        this.setProducts(response.data);
      } else {
        alert("No Searched Results");
      }
    });
  }

  deleteProducts(products: any[]) {
    this.loading = true;

    const data = {
      delete: products,
    };
    axios({
      method: "post",
      url: productsEndPoint + "batch/?" + token,
      data,
    }).then((response) => {
      if (
        response &&
        response.data &&
        response.data.delete &&
        response.data.delete.length > 0
      ) {
        this.setProducts(
          this.filterByReference(this.allProducts, response.data.delete)
        );
      }
      this.loading = false;
    });
  }

  setProducts = (products: []) => {
    this.allProducts = products;
  };

  setTotalProductsCount = (totalProductsCount: number) => {
    this.allProductsCount = totalProductsCount;
  };

  filterByReference = (arr1: any, arr2: any) => {
    let res = [];
    res = arr1.filter((el: { id: number }) => {
      return !arr2.find((element: { id: number }) => {
        return element.id === el.id;
      });
    });
    return res;
  };
}

const ProductListStore = new productListStore();
export default ProductListStore;
