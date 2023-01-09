import { makeAutoObservable } from "mobx";
import axios from "axios";
import {
  reportSalesEndPoint,
  reportTopSellersEndPoint,
  reportOrdersEndPoint,
  token,
} from "../config/config";
import moment from "moment";

class productVariationsStore {
  toDate: string = moment(new Date()).format("YYYY-MM-DD");
  fromDate: string = moment(new Date()).format("YYYY-MM-DD");
  sales: any[] = [];
  topSellers: any[] = [];
  orders: any[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getSalesReport() {
    const params = {
      date_min: this.fromDate,
      date_max: this.toDate,
    };
    this.loading = true;
    axios({
      method: "get",
      url: reportSalesEndPoint + "?" + token,
      params,
    })
      .then((response) => {
        this.loading = false;
        if (response && response.data && response.data.length > 0)
          this.setSales(response.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.loading = false;
        return Promise.reject(error);
      });
  }

  async getTopSellersReport() {
    const params = {
      date_min: this.fromDate,
      date_max: this.toDate,
    };
    this.loading = true;
    axios({
      method: "get",
      url: reportTopSellersEndPoint + "?" + token,
      params,
    })
      .then((response) => {
        this.loading = false;
        if (response && response.data && response.data.length > 0)
          this.setTopSellers(response.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.loading = false;
        return Promise.reject(error);
      });
  }

  async getOrdersReport() {
    const params = {
      date_min: this.fromDate,
      date_max: this.toDate,
    };
    this.loading = true;
    axios({
      method: "get",
      url: reportOrdersEndPoint + "?" + token,
      params,
    })
      .then((response) => {
        this.loading = false;
        if (response && response.data && response.data.length > 0)
          this.setOrders(response.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.loading = false;
        return Promise.reject(error);
      });
  }

  setSales(data: any) {
    this.sales = data;
  }

  setTopSellers(data: any) {
    this.topSellers = data;
  }

  setOrders(data: any) {
    this.orders = data;
  }

  setToDate(date: string) {
    this.toDate = date;
  }

  setFromDate(date: string) {
    this.fromDate = date;
  }
}

const ProductVariationsStore = new productVariationsStore();
export default ProductVariationsStore;
