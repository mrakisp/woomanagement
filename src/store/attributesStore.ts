import { makeAutoObservable } from "mobx";
import axios from "axios";
import { attributesEndPoint, token } from "../config/config";
import { setLocalStorageUtil } from "../common/utils/setGetLocalStorage";

interface Attributes {
  id: number;
  name: string;
  position?: number;
  visible?: boolean;
  variation: boolean;
  options: any[];
  slug?: string;
}

interface AttributesTerms {
  id: number;
  slug: string | undefined;
}

class productAttributesStore {
  productAttributes: Attributes[] = [];
  loading = false;
  tempSavedAttributes: Attributes[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  //fetch attributes
  async getProductAttributes() {
    this.loading = true;
    const attributesData: Attributes[] = [];
    axios({
      method: "get",
      url: attributesEndPoint + "?" + token,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.loading = false;
        response.data.forEach((attribute: Attributes) => {
          this.getProductAttributesTerms(attribute.id);
          attributesData.push({
            name: attribute.name,
            id: attribute.id,
            options: [],
            variation: false,
          });
        });

        this.setProductAttributes(attributesData);
      }
    });
  }

  getProductAttributesTerms(id: number) {
    this.loading = true;
    const attributesTermsData: AttributesTerms[] = [];
    axios({
      method: "get",
      url: attributesEndPoint + id + "/terms?" + token,
    }).then((response) => {
      if (response && response.data && response.data.length > 0) {
        this.loading = false;

        response.data.forEach(function (attributeTerm: any) {
          const id = attributeTerm.id;
          const slug = attributeTerm.slug;
          attributesTermsData.push({ id: id, slug: slug });
        });

        this.setProductAttributesTerms(id, attributesTermsData);

        setLocalStorageUtil(
          "attributes",
          JSON.stringify(this.productAttributes),
          true
        );
      }
    });
  }

  setProductAttributes(data: Attributes[]) {
    this.productAttributes = data;
  }
  setProductAttributesTerms(attributeId: number, terms: any) {
    let index = this.productAttributes.findIndex(
      (attr) => attr.id === attributeId
    );
    this.productAttributes[index].options = [];
    terms.forEach((term: { slug: string }) => {
      this.productAttributes[index].options.push(term.slug);
    });

    this.productAttributes[index].options.sort((a, b) => {
      if (a === "K" || b === "N") {
        return -1;
      }
      if (a === "N" || b === "K") {
        return 1;
      }
      return +a - +b;
    });
  }
}

const ProductAttributesStore = new productAttributesStore();
export default ProductAttributesStore;
