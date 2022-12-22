import { makeAutoObservable } from "mobx";
import axios from "axios";
import { categoriesEndPoint, token } from "../config/config";
import { setLocalStorageUtil } from "../common/utils/updateLocalStorage";

interface Categories {
  name: string;
  parent: number | string;
  id: number | string;
  slug: string;
  sorting?: number | string;
  nested?: boolean; //is nested 2nd lvl
}

class productCategoriesStore {
  productCategories: Categories[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  //fetch categories
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

        //sorting categories for ui purposes
        const sortedCatData = this.fixSortingCategories(categoriesData);

        //set sorted fetched categories to localstorage - preventing the service call everytime
        setLocalStorageUtil("categories", JSON.stringify(sortedCatData));
        this.setProductCategories(sortedCatData);
      }
    });
  }

  //sorting categories for ui purposes
  fixSortingCategories(categoriesData: Categories[]) {
    let parentCats: Categories[] = [];
    categoriesData.forEach(function (category: Categories) {
      if (category.parent === 0) {
        category.sorting = category.id;
      } else {
        category.sorting = category.parent;
        parentCats.push({
          id: category.id,
          sorting: category.sorting,
          name: "",
          parent: "",
          slug: "",
        });
      }
    });
    categoriesData.forEach(function (category: Categories) {
      const isNestedLevel2 = parentCats.find(
        ({ id }) => id === category.parent
      );
      if (category.parent !== 0 && isNestedLevel2) {
        category.sorting = isNestedLevel2.sorting;
        category.nested = true;
      }
    });

    //sort by key sort and id
    categoriesData.sort((key1: any, key2: any) =>
      key1.sorting > key2.sorting
        ? 1
        : key1.sorting < key2.sorting
        ? -1
        : 0 || key1.id > key2.id
        ? 1
        : key1.id < key2.id
        ? -1
        : 0
    );

    return categoriesData;
  }

  setProductCategories(data: Categories[]) {
    this.productCategories = data;
  }
}

const ProductCategoriesStore = new productCategoriesStore();
export default ProductCategoriesStore;
