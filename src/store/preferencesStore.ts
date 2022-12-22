import { makeAutoObservable } from "mobx";
import { getLocalStorageUtil } from "../common/utils/setGetLocalStorage";

class preferencesStore {
  preferences = {
    showWeight: true,
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
}

const store = new preferencesStore();
export default store;
