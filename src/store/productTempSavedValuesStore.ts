import { makeAutoObservable } from "mobx";
import productsStore from "./productStore";
import {
  setLocalStorageUtil,
  getLocalStorageUtil,
} from "../common/utils/setGetLocalStorage";

interface Attributes {
  id: number;
  name: string;
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options: any[];
  slug?: string;
}

class productTempSavedValuesStore {
  tempSavedAttributes: Attributes[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTempSaveAttributes() {
    setLocalStorageUtil(
      "savedattributes",
      JSON.stringify(productsStore.dataToBeUpdated.attributes),
      true
    );
    this.tempSavedAttributes = productsStore.dataToBeUpdated.attributes;
  }

  getTempSaveAttributes() {
    const savedattributes = getLocalStorageUtil("savedattributes", true);
    if (savedattributes) {
      productsStore.dataToBeUpdated.attributes = JSON.parse(savedattributes);
      productsStore.productToBeUpdated.attributes = JSON.parse(savedattributes);
      productsStore.isProductChanged = true;
    }
  }
}

const ProductTempSavedValuesStore = new productTempSavedValuesStore();
export default ProductTempSavedValuesStore;
