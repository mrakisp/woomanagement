import { makeAutoObservable } from "mobx";
import { getLocalStorageUtil } from "../common/utils/setGetLocalStorage";

class preferencesStore {
  preferences = {
    showWeight: false,
    showFeatured: true,
    showSlug: true,
    autoGenSku: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setPreferences(updatedPreferences: any) {
    this.preferences = updatedPreferences;
  }
  getPreferences() {
    const preferences = getLocalStorageUtil("preferences");
    if (preferences) this.preferences = JSON.parse(preferences);
  }
  getPreferencesByVal(prop: string) {
    const property = prop;
    const val = JSON.parse(getLocalStorageUtil("preferences"));
    if (val) return val[property];
  }
}

const store = new preferencesStore();
export default store;
