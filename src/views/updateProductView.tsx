import React from "react";
import productStore from "../store/productStore";
import SearchInput from "../common/components/search/searchInput";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import {
  searchProductsType,
  searchBySku,
} from "../common/components/search/searchTypes";
import { StyledLabel } from "../common/components/label";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Grid from "@mui/material/Grid";

const UpdateProduct = function UpdateProduct() {
  const handleSave = () => {
    // console.log(productStore.productToBeUpdated);
    // productStore.createProduct(productStore.productToBeUpdated);
  };
  // useEffect(() => {
  //   searchStore.resetAll();
  // }, []);

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Grid item xs={9}>
        <SearchInput searchType={searchProductsType} searchBy={searchBySku} />
      </Grid>

      {!isEmpty(productStore.productToBeUpdated) ? (
        <>
          <Grid item xs={1}>
            <StyledLabel>Product Id</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.id}
              disabled
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid item xs={1}>
            <StyledLabel>Product Sales</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.total_sales}
              disabled
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid item xs={1}>
            <StyledLabel>Low Stock</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={
                productStore.productToBeUpdated.low_stock_amount &&
                productStore.productToBeUpdated.low_stock_amount <=
                  productStore.productToBeUpdated.stock_quantity
                  ? "Yes"
                  : "No"
              }
              disabled
              variant="filled"
              size="small"
            />
          </Grid>

          <Grid item xs={9}>
            <StyledLabel>Name</StyledLabel>
            <TextField
              fullWidth
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.name}
              size="small"
            />

            <StyledLabel>Description</StyledLabel>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={10}
              defaultValue={productStore.productToBeUpdated.description}
              style={{ width: "100%" }}
            />

            <StyledLabel>Short Description</StyledLabel>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={5}
              defaultValue={productStore.productToBeUpdated.short_description}
              style={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={3}>
            <StyledLabel>Sku</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.sku}
              size="small"
            />

            <StyledLabel>Price</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.regular_price}
              size="small"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              type="number"
            />

            <StyledLabel>Sale Price</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.sale_price}
              size="small"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              type="number"
            />
            <StyledLabel>Stock Quantity</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.stock_quantity}
              size="small"
              InputProps={{
                inputProps: { min: 0 },
              }}
              type="number"
            />
          </Grid>
          <button onClick={handleSave}>Update</button>
        </>
      ) : null}
    </Grid>
  );
};

export default observer(UpdateProduct);

/* type : "simple"
status : "publish"
on_sale : false
manage_stock : true
stock_quantity : 3
sale_price
regular_price
total_sales : 0
low_stock_amount : null */
