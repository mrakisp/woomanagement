import React from "react";
import productStore from "../store/productStore";
import ProductCategories from "../common/components/productCategories";
import SearchInput from "../common/components/search/searchInput";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import {
  searchProductsType,
  searchBySku,
} from "../common/components/search/searchTypes";
import { StyledLabel } from "../common/components/styledComponents";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Grid from "@mui/material/Grid";
import Button from "../common/components/button";
import FixedBottom from "../common/components/fixedBottomContainer";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const UpdateProduct = function UpdateProduct() {
  const handleSave = () => {
    if (productStore.isProductChanged) {
      productStore.updateProduct();
    }
  };

  const handleCancel = () => {
    productStore.resetToDefaultProduct();
  };

  const handleInputChange = (
    propertyToBeUpdated: string,
    value: string | number
  ) => {
    productStore.updateValueOfProduct(propertyToBeUpdated, value);
  };

  const handleCategories = (
    isChecked: React.ChangeEvent<HTMLInputElement>,
    data: {}
  ) => {
    productStore.updateCategories(isChecked.target.checked, data);
  };

  const FixedFooterbuttons = [
    <Button
      // isLoading={productStore.loading}
      onClick={handleCancel}
      disabled={!productStore.isProductChanged}
      text="Cancel"
      key="button2"
      color="error"
      icon={<CancelIcon />}
    />,
    <Button
      isLoading={productStore.loading}
      onClick={handleSave}
      disabled={!productStore.isProductChanged}
      text="Save"
      key="button1"
      icon={<SaveIcon />}
      sx={{ marginLeft: 5 }}
    />,
  ];

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
          <Grid item xs={2} md={1}>
            <StyledLabel>Product Id</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.id}
              disabled
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <StyledLabel>Product Sales</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.total_sales}
              disabled
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid item xs={2} md={1}>
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
              value={productStore.productToBeUpdated.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              size="small"
            />

            <StyledLabel>Description</StyledLabel>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={10}
              value={productStore.productToBeUpdated.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              style={{ width: "100%" }}
            />

            <StyledLabel>Short Description</StyledLabel>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={5}
              value={productStore.productToBeUpdated.short_description}
              onChange={(e) =>
                handleInputChange("short_description", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={3}>
            <StyledLabel>Sku</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              value={productStore.productToBeUpdated.sku}
              onChange={(e) => handleInputChange("sku", e.target.value)}
              size="small"
            />

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={6}>
                <StyledLabel>Price</StyledLabel>
                <TextField
                  id="filled-hidden-label-small"
                  value={productStore.productToBeUpdated.regular_price}
                  onChange={(e) =>
                    handleInputChange("regular_price", e.target.value)
                  }
                  size="small"
                  InputProps={{
                    inputProps: { min: 0 },
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  }}
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <StyledLabel>Sale Price</StyledLabel>
                <TextField
                  id="filled-hidden-label-small"
                  value={productStore.productToBeUpdated.sale_price}
                  onChange={(e) =>
                    handleInputChange("sale_price", e.target.value)
                  }
                  size="small"
                  InputProps={{
                    inputProps: { min: 0 },
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  }}
                  type="number"
                />
              </Grid>
            </Grid>

            <StyledLabel>Stock Quantity</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              value={productStore.productToBeUpdated.stock_quantity}
              onChange={(e) =>
                handleInputChange("stock_quantity", parseInt(e.target.value))
              }
              size="small"
              InputProps={{
                inputProps: { min: 0 },
              }}
              type="number"
            />
            <StyledLabel>Product Categories</StyledLabel>
            <ProductCategories
              handleCategories={handleCategories}
              currentCategories={productStore.productToBeUpdated.categories}
            />
            <StyledLabel>Image</StyledLabel>
            <img
              width="250"
              alt={productStore.productToBeUpdated.name}
              src={productStore.productToBeUpdated.images[0].src}
            />
          </Grid>
          <FixedBottom buttons={FixedFooterbuttons} />
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
