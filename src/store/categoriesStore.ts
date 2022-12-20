import { makeAutoObservable } from "mobx";
import axios from "axios";
import { categoriesEndPoint, token } from "../config/config";
import { setLocalStorageUtil } from "../common/utils/updateLocalStorage";

interface Categories {
  name: string;
  parent: number | string;
  id: number | string;
  slug: string;
}

class productCategoriesStore {
  productCategories: any = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getProductCategories() {
    this.loading = true;
    const categoriesData: Categories[] = [];
    axios({
      method: "get",
      url: categoriesEndPoint + "?" + token,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.loading = false;
        response.data.forEach(function (category: Categories) {
          categoriesData.push({
            name: category.name,
            parent: category.parent,
            id: category.id,
            slug: category.slug,
          });
        });
        setLocalStorageUtil("categories", JSON.stringify(categoriesData));
        this.setProductCategories(categoriesData);
      }
    });
  }

  setProductCategories(data: any) {
    this.productCategories = data;
  }
}

const ProductCategoriesStore = new productCategoriesStore();
export default ProductCategoriesStore;
