import { logInCredentials } from "../config/config";
import { makeAutoObservable } from "mobx";
import { isEqual } from "lodash";

interface user {
  email: string | undefined;
  password: string | undefined;
}

class loginStore {
  user: user = { email: "", password: "" };
  isLoggedIn = false;
  error = false;

  constructor() {
    makeAutoObservable(this);
  }

  login(email: string | undefined, password: string | undefined) {
    this.user.email = email;
    this.user.password = password;
    this.isUserValid();
  }

  isUserValid() {
    if (isEqual(this.user, logInCredentials)) {
      this.isLoggedIn = true;
      this.error = false;
      localStorage.setItem("isLoged", JSON.stringify(this.isLoggedIn));
    } else {
      this.isLoggedIn = false;
      this.error = true;
      localStorage.setItem("isLoged", JSON.stringify(this.isLoggedIn));
    }
  }
}

const store = new loginStore();
export default store;
