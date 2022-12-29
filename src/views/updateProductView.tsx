import React, { useEffect, useState } from "react";
import productStore from "../store/productStore";
import preferencesStore from "../store/preferencesStore";
import ProductCategories from "../common/components/productCategories";
import ProductAttributes from "../common/components/productAttributes";
import ProductVariations from "../common/components/productVariations";
import SearchInput from "../common/components/search/searchInput";
import { observer } from "mobx-react-lite";
import { isEmpty } from "lodash";
import {
  searchProductsType,
  searchBySku,
  searchBySearch,
} from "../common/components/search/searchTypes";
import Button from "../common/components/button";
import BasicModal from "../common/components/modal";
import FixedBottom from "../common/components/fixedBottomContainer";
import { StyledLabel } from "../common/components/styledComponents";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Switch from "@mui/material/Switch";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

const UpdateProduct = function UpdateProduct() {
  const [isSearchBySku, setIsSearchBySku] = useState(true);

  useEffect(() => {
    preferencesStore.getPreferences();
  }, []);

  const handleCloseAttributeWarning = () => {
    productStore.attributesWarning = false;
  };

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
    value: string | number | boolean
  ) => {
    if (isValidInput(propertyToBeUpdated, value)) {
      productStore.updateValueOfProduct(propertyToBeUpdated, value);
    }
  };

  const handlePreview = () => {
    window.open(productStore.productToBeUpdated.permalink, "_blank");
  };

  const handleDelete = () => {
    productStore.deleteProduct();
  };

  const handleCategories = (
    isChecked: React.ChangeEvent<HTMLInputElement>,
    data: {}
  ) => {
    productStore.updateCategories(isChecked.target.checked, data);
  };

  const handleAttributes = (
    isChecked: React.ChangeEvent<HTMLInputElement>,
    data: {}
  ) => {
    productStore.updateAttributes(isChecked.target.checked, data);
  };

  const handleAttributeVisibility = (
    isChecked: React.ChangeEvent<HTMLInputElement>,
    id: string | number
  ) => {
    productStore.updateAttributeVisibility(isChecked.target.checked, id);
  };

  const handleAttributeIsForVariation = (
    isChecked: React.ChangeEvent<HTMLInputElement>,
    id: string | number
  ) => {
    productStore.updateAttributeVariation(isChecked.target.checked, id);
  };

  const handleUpdateAttributesForVariations = () => {
    productStore.saveAttributeVariation();
  };

  const isValidInput = (propName: string, value: number | string | boolean) => {
    if (
      propName === "sale_price" &&
      Number(value) >= Number(productStore.productToBeUpdated.regular_price)
    ) {
      return false;
    }
    return true;
  };

  const FixedFooterbuttons = [
    <Button
      onClick={handleDelete}
      text="Delete Product"
      key="button1"
      size="small"
      color="error"
      icon={<DeleteIcon />}
      sx={{ marginRight: "auto" }}
    />,

    <Button
      onClick={handlePreview}
      text="View Product"
      key="button2"
      icon={<PreviewIcon />}
    />,
    <Button
      onClick={handleCancel}
      disabled={!productStore.isProductChanged}
      text="Cancel Changes"
      key="button3"
      color="warning"
      icon={<CancelIcon />}
      sx={{ marginLeft: 5 }}
    />,
    <Button
      isLoading={productStore.loading}
      onClick={handleSave}
      disabled={!productStore.isProductChanged}
      text="save"
      key="button4"
      icon={<SaveIcon />}
      sx={{ marginLeft: 5 }}
    />,
  ];

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{ paddingBottom: "100px;" }}
    >
      <Grid item xs={9}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={6} md={4}>
            {isSearchBySku ? (
              <SearchInput
                searchType={searchProductsType}
                searchBy={searchBySku}
              />
            ) : (
              <SearchInput
                searchType={searchProductsType}
                searchBy={searchBySearch}
              />
            )}
          </Grid>
          <Grid item xs={3}>
            Change Search
            <br />
            <Switch onChange={(e) => setIsSearchBySku(!isSearchBySku)} />
          </Grid>
        </Grid>
      </Grid>

      {!isEmpty(productStore.productToBeUpdated) ? (
        <>
          <Grid item xs={2} sm={2} md={1}>
            <StyledLabel>Id</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.id}
              disabled
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid item xs={2} sm={2} md={1}>
            <StyledLabel>Sales</StyledLabel>
            <TextField
              id="filled-hidden-label-small"
              defaultValue={productStore.productToBeUpdated.total_sales}
              disabled
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid item xs={2} sm={2} md={1}>
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

          <Grid item xs={9} sm={8} md={9} lg={10}>
            {preferencesStore.preferences.showSlug && (
              <>
                {" "}
                <StyledLabel>Slug</StyledLabel>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {productStore.initialProduct.permalink.replace(
                          productStore.initialProduct.slug + "/",
                          ""
                        )}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  id="filled-hidden-label-small"
                  value={productStore.productToBeUpdated.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  size="small"
                />
              </>
            )}
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
            <StyledLabel>Attributes</StyledLabel>
            <ProductAttributes
              selectedAttributes={productStore.productToBeUpdated.attributes}
              handleAttributes={handleAttributes}
              handleAttributeVisibility={handleAttributeVisibility}
              handleAttributeIsForVariation={handleAttributeIsForVariation}
              handleUpdateAttributesForVariations={
                handleUpdateAttributesForVariations
              }
            />
            {productStore.productToBeUpdated.type === "variable" && (
              <>
                <StyledLabel>Variations</StyledLabel>
                {productStore.productToBeUpdated.variations &&
                productStore.productToBeUpdated.variations.length > 0 ? (
                  <>
                    <ProductVariations
                      selectedAttributes={
                        productStore.productToBeUpdated.attributes
                      }
                      // handleVariations={handleVariations}
                      productId={productStore.productToBeUpdated.id}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      minHeight: "100px",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    There is no selected attribute to be used for Variations.
                  </div>
                )}
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={6}>
                <StyledLabel>Sku</StyledLabel>
                <TextField
                  id="filled-hidden-label-small"
                  value={productStore.productToBeUpdated.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <StyledLabel>Status</StyledLabel>
                <span style={{ textTransform: "capitalize" }}>
                  {productStore.productToBeUpdated.status}
                </span>
                <Switch
                  value={
                    productStore.productToBeUpdated.status === "publish"
                      ? "draft"
                      : "publish"
                  }
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  checked={
                    productStore.productToBeUpdated.status === "publish"
                      ? true
                      : false
                  }
                />
              </Grid>
            </Grid>
            {productStore.productToBeUpdated.type !== "variable" && (
              <>
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
                        inputProps: {
                          min: 0,
                        },
                        endAdornment: (
                          <InputAdornment position="end">€</InputAdornment>
                        ),
                      }}
                      type="number"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={6}>
                    {productStore.productToBeUpdated.manage_stock && (
                      <>
                        <StyledLabel>Stock Quantity</StyledLabel>
                        <TextField
                          value={productStore.productToBeUpdated.stock_quantity}
                          onChange={(e) =>
                            handleInputChange(
                              "stock_quantity",
                              parseInt(e.target.value)
                            )
                          }
                          size="small"
                          InputProps={{
                            inputProps: { min: 0 },
                          }}
                          type="number"
                        />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {preferencesStore.preferences.showWeight && (
                      <>
                        <StyledLabel>Weight</StyledLabel>
                        <TextField
                          value={productStore.productToBeUpdated.weight}
                          onChange={(e) =>
                            handleInputChange("weight", e.target.value)
                          }
                          size="small"
                        />
                      </>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
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

          <BasicModal
            component={
              <Alert severity="error">
                Changes detected in attributes. Please save attributes!
              </Alert>
            }
            open={productStore.attributesWarning}
            handleClose={handleCloseAttributeWarning}
          />
        </>
      ) : null}
    </Grid>
  );
};

export default observer(UpdateProduct);
