import React, { useEffect, useState } from "react";
import productStore from "../store/productStore";
import preferencesStore from "../store/preferencesStore";
import ProductCategories from "../common/components/productCategories";
import ProductAttributes from "../common/components/productAttributes";
import ProductVariations from "../common/components/productVariations";
import Loading from "../common/components/loading";
import SearchInput from "../common/components/search/searchInput";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

interface ProductProps {
  viewState: string;
}

const UpdateProduct = function UpdateProduct({ viewState }: ProductProps) {
  const [isSearchBySku, setIsSearchBySku] = useState(true);
  const [isSkuFilled, setIsSkuFilled] = useState(false);
  const [isValidFields, setIsValidFields] = useState(false);
  const [editorStateDescr, setEditorStateDescr] = useState(() =>
    EditorState.createEmpty()
  );
  const [editorStateShortDescr, setEditorStateShortDescr] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (viewState === "create") {
      productStore.resetCreateProduct(true);
    } else {
      productStore.productToBeUpdated = {};
    }
  }, [viewState]);

  const productHasId = productStore.productToBeUpdated.id
    ? productStore.productToBeUpdated.id
    : "";
  useEffect(() => {
    if (viewState === "update" && productStore.productToBeUpdated.id) {
      const descr = convertFromHTML(
        productStore.productToBeUpdated.description
      );
      setEditorStateDescr(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            descr.contentBlocks,
            descr.entityMap
          )
        )
      );
      const shortDescr = convertFromHTML(
        productStore.productToBeUpdated.short_description
      );
      setEditorStateShortDescr(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            shortDescr.contentBlocks,
            shortDescr.entityMap
          )
        )
      );
    }
  }, [productHasId, viewState]);

  const isProductSaved = productStore.productsaved ? true : false;
  useEffect(() => {
    if (productStore.productsaved) {
      document.documentElement.scrollTop = 0;
      const deafultdescr = convertFromHTML("<p></p>");
      setEditorStateDescr(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            deafultdescr.contentBlocks,
            deafultdescr.entityMap
          )
        )
      );
      setEditorStateShortDescr(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            deafultdescr.contentBlocks,
            deafultdescr.entityMap
          )
        )
      );
    }
  }, [isProductSaved]);

  const handleCloseAttributeWarning = () => {
    productStore.attributesWarning = false;
  };

  const handleCloseSavedMessage = () => {
    productStore.productsaved = false;
  };

  const handleCloseRequiredError = () => {
    setIsValidFields(false);
  };

  const handleSave = () => {
    productStore.isSavedAndClone = false;
    if (productStore.validateFields()) {
      if (viewState === "create" && !productStore.productToBeUpdated.id) {
        productStore.createProduct();
      } else if (productStore.isProductChanged) {
        productStore.updateProduct(viewState);
      }
    } else {
      setIsValidFields(true);
    }
  };

  const handleSaveAndClone = () => {
    productStore.isSavedAndClone = true;
    if (productStore.validateFields()) {
      if (viewState === "create" && !productStore.productToBeUpdated.id) {
        productStore.createProduct();
      } else if (productStore.isProductChanged) {
        productStore.updateProduct(viewState);
      }
    } else {
      setIsValidFields(true);
    }
  };

  const handleCancel = () => {
    productStore.resetToDefaultProduct(viewState);
    setIsSkuFilled(false);
  };

  const handleInputChange = (
    propertyToBeUpdated: string,
    value: string | number | boolean
  ) => {
    setIsSkuFilled(false);

    //remove error
    const indexOfObject = productStore.notValidFields.findIndex(
      (object: any) => {
        return object.field === propertyToBeUpdated;
      }
    );
    productStore.notValidFields.splice(indexOfObject, 1);
    //end remove error

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
    productStore.updateAttributeVariation(
      isChecked.target.checked,
      id,
      viewState
    );
  };

  const handleUpdateAttributesForVariations = () => {
    if (!productStore.productToBeUpdated.sku) {
      setIsSkuFilled(true);
      document.documentElement.scrollTop = 0;
    } else {
      if (viewState === "create" && !productStore.productToBeUpdated.id) {
        productStore.createTempProduct();
      } else {
        productStore.saveAttributeVariation();
      }
      // const element = document.getElementById("div");
      // document.getElementById("productVariations")?.scrollIntoView();
    }
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
    viewState === "update" && (
      <Button
        onClick={handleDelete}
        text="Delete Product"
        key="button1"
        size="small"
        color="error"
        icon={<DeleteIcon />}
        sx={{ marginRight: "auto" }}
      />
    ),
    viewState === "update" && (
      <Button
        onClick={handlePreview}
        text="View Product"
        key="button2"
        icon={<PreviewIcon />}
      />
    ),

    <Button
      onClick={handleCancel}
      disabled={!productStore.isProductChanged}
      text="Cancel Changes"
      key="button3"
      color="warning"
      icon={<CancelIcon />}
      sx={{ marginLeft: 5 }}
    />,
    viewState === "create" && (
      <Button
        isLoading={productStore.loading}
        onClick={handleSaveAndClone}
        disabled={!productStore.isProductChanged}
        text="save & clone"
        key="button4"
        icon={<SaveIcon />}
        sx={{ marginLeft: 5 }}
      />
    ),
    <Button
      isLoading={productStore.loading}
      onClick={handleSave}
      disabled={!productStore.isProductChanged}
      text="save"
      key="button5"
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
      {viewState === "update" && (
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
              Change Search By {isSearchBySku ? "Name" : "Sku"}
              <br />
              <Switch onChange={(e) => setIsSearchBySku(!isSearchBySku)} />
            </Grid>
          </Grid>
        </Grid>
      )}
      {(viewState === "update" &&
        !isEmpty(productStore.productToBeUpdated) &&
        productStore.productToBeUpdated.id) ||
      (viewState === "create" && !isEmpty(productStore.productToBeUpdated)) ? (
        <>
          {viewState === "update" && (
            <>
              <Grid item xs={2} sm={2} md={1}>
                <StyledLabel>Id</StyledLabel>
                <TextField
                  value={productStore.productToBeUpdated.id}
                  disabled
                  variant="filled"
                  size="small"
                />
              </Grid>
              <Grid item xs={2} sm={2} md={1}>
                <StyledLabel>Sales</StyledLabel>
                <TextField
                  value={productStore.productToBeUpdated.total_sales}
                  disabled
                  variant="filled"
                  size="small"
                />
              </Grid>
              <Grid item xs={2} sm={2} md={1}>
                <StyledLabel>Low Stock</StyledLabel>
                <TextField
                  value={
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
            </>
          )}
          <Grid item xs={9} sm={8} md={9} lg={10}>
            {preferencesStore.preferences.showSlug && (
              <>
                <StyledLabel>Slug</StyledLabel>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {viewState === "update" &&
                          productStore.initialProduct?.permalink?.replace(
                            productStore.initialProduct.slug + "/",
                            ""
                          )}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  value={productStore.productToBeUpdated.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  size="small"
                />
              </>
            )}
            <StyledLabel>Name</StyledLabel>
            <TextField
              fullWidth
              value={productStore.productToBeUpdated.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              size="small"
              error={
                productStore.notValidFields.find(
                  (element: any) => element.field === "name"
                )
                  ? true
                  : false
              }
            />
            <StyledLabel>Description</StyledLabel>
            <Editor
              editorState={editorStateDescr}
              onEditorStateChange={setEditorStateDescr}
              onChange={(e) =>
                handleInputChange(
                  "description",
                  convertToHTML(editorStateDescr.getCurrentContent())
                )
              }
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              toolbar={{
                options: [
                  "blockType",
                  "inline",
                  "fontSize",
                  "list",
                  "textAlign",
                  "history",
                  "link",
                ],
                inline: { inDropdown: false },
                list: { inDropdown: false },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
            <StyledLabel>Short Description</StyledLabel>
            <Editor
              toolbar={{
                options: [
                  "blockType",
                  "inline",
                  "fontSize",
                  "list",
                  "textAlign",
                  "history",
                  "link",
                ],
                inline: { inDropdown: false },
                list: { inDropdown: false },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
              editorState={editorStateShortDescr}
              onEditorStateChange={setEditorStateShortDescr}
              onChange={(e) =>
                handleInputChange(
                  "short_description",
                  convertToHTML(editorStateShortDescr.getCurrentContent())
                )
              }
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
            <StyledLabel>Attributes</StyledLabel>
            <ProductAttributes
              selectedAttributes={
                productStore.productToBeUpdated.attributes
                  ? productStore.productToBeUpdated.attributes
                  : []
              }
              handleAttributes={handleAttributes}
              handleAttributeVisibility={handleAttributeVisibility}
              handleAttributeIsForVariation={handleAttributeIsForVariation}
              handleUpdateAttributesForVariations={
                handleUpdateAttributesForVariations
              }
              viewState={viewState}
            />
            {productStore.productToBeUpdated.type === "variable" && (
              <>
                <StyledLabel>Variations</StyledLabel>
                {productStore.productToBeUpdated.variations &&
                productStore.productToBeUpdated.variations.length > 0 &&
                productStore.productToBeUpdated.id ? (
                  <div id="productVariations">
                    <ProductVariations
                      selectedAttributes={
                        productStore.productToBeUpdated.attributes
                          ? productStore.productToBeUpdated.attributes
                          : []
                      }
                      errors={productStore.notValidVariations}
                      productId={productStore.productToBeUpdated.id}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      minHeight: "100px",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {productStore.autoCreateVariations ? (
                      <Loading />
                    ) : (
                      "There is no selected attribute to be used for Variations."
                    )}
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
                  value={productStore.productToBeUpdated.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  size="small"
                  error={
                    isSkuFilled ||
                    productStore.notValidFields.find(
                      (element: any) => element.field === "sku"
                    )
                      ? true
                      : false
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <StyledLabel>Status</StyledLabel>
                <span style={{ textTransform: "capitalize" }}>
                  <span
                    style={{
                      color:
                        productStore.userStatusSelection === "publish"
                          ? "#239b78"
                          : "#9b2323",
                    }}
                  >
                    {productStore.userStatusSelection}
                  </span>
                </span>
                <Switch
                  value={
                    productStore.productToBeUpdated.status === "publish"
                      ? "draft"
                      : "publish"
                  }
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  checked={
                    productStore.userStatusSelection === "publish"
                      ? true
                      : false
                  }
                />
              </Grid>
            </Grid>
            {/* {productStore.productToBeUpdated.type !== "variable" && ( */}
            {/* <> */}
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={6}>
                <StyledLabel>
                  Price
                  <Tooltip title="Price will be used only for simple product. If you use variations, variations price will be applied">
                    <InfoIcon
                      sx={{
                        marginLeft: "auto",
                        display: "flex",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </StyledLabel>
                <TextField
                  disabled={productStore.productToBeUpdated.type === "variable"}
                  variant={
                    productStore.productToBeUpdated.type === "variable"
                      ? "filled"
                      : undefined
                  }
                  value={
                    productStore.productToBeUpdated.type === "variable"
                      ? null
                      : productStore.productToBeUpdated.regular_price
                  }
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
                  error={
                    productStore.notValidFields.find(
                      (element: any) => element.field === "regular_price"
                    )
                      ? true
                      : false
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <StyledLabel>
                  Sale Price
                  <Tooltip title="Sale Price will be used only for simple product. If you use variations, variations sale price will be applied">
                    <InfoIcon
                      sx={{
                        marginLeft: "auto",
                        display: "flex",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </StyledLabel>
                <TextField
                  disabled={productStore.productToBeUpdated.type === "variable"}
                  value={
                    productStore.productToBeUpdated.type === "variable"
                      ? null
                      : productStore.productToBeUpdated.sale_price
                  }
                  onChange={(e) =>
                    handleInputChange("sale_price", e.target.value)
                  }
                  variant={
                    productStore.productToBeUpdated.type === "variable"
                      ? "filled"
                      : undefined
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
                {(productStore.productToBeUpdated.manage_stock ||
                  viewState === "create") && (
                  <>
                    <StyledLabel>
                      Stock Quantity
                      <Tooltip
                        title="Stock will be used only for simple product. If you use variations, variations stock will be applied. If you let it empty, 
                      then product will have infinite stock quantity. Add 0 if you need it out of stock."
                      >
                        <InfoIcon
                          sx={{
                            marginLeft: "auto",
                            display: "flex",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </StyledLabel>
                    <TextField
                      value={
                        productStore.productToBeUpdated.type === "variable"
                          ? null
                          : productStore.productToBeUpdated.stock_quantity
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "stock_quantity",
                          parseInt(e.target.value)
                        )
                      }
                      disabled={
                        productStore.productToBeUpdated.type === "variable"
                      }
                      variant={
                        productStore.productToBeUpdated.type === "variable"
                          ? "filled"
                          : undefined
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
                    <StyledLabel>
                      Weight{" "}
                      <Tooltip title="Weight will be used only for simple product. If you use variations, variations weight will be applied">
                        <InfoIcon
                          sx={{
                            marginLeft: "auto",
                            display: "flex",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </StyledLabel>
                    <TextField
                      variant={
                        productStore.productToBeUpdated.type === "variable"
                          ? "filled"
                          : undefined
                      }
                      disabled={
                        productStore.productToBeUpdated.type === "variable"
                      }
                      value={
                        productStore.productToBeUpdated.type === "variable"
                          ? null
                          : productStore.productToBeUpdated.weight
                      }
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      size="small"
                    />
                  </>
                )}
              </Grid>
            </Grid>
            {/* </> */}
            {/* )} */}
            <StyledLabel>Product Categories</StyledLabel>
            <ProductCategories
              handleCategories={handleCategories}
              currentCategories={productStore.productToBeUpdated.categories}
            />
            <StyledLabel>Image</StyledLabel>
            {viewState === "update" && (
              <img
                width="250"
                alt={productStore.productToBeUpdated.name}
                src={productStore.productToBeUpdated.images[0]?.src}
              />
            )}
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
          <BasicModal
            component={<Alert severity="success">Product Saved</Alert>}
            open={productStore.productsaved}
            handleClose={handleCloseSavedMessage}
          />
          <BasicModal
            component={
              <Alert severity="error">
                You have to complete all required fields
              </Alert>
            }
            open={isValidFields}
            handleClose={handleCloseRequiredError}
          />
        </>
      ) : null}
    </Grid>
  );
};

export default observer(UpdateProduct);
