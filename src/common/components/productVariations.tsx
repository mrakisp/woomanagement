import React, { useEffect } from "react";
import productVariations from "../../store/variationsStore";
import { observer } from "mobx-react-lite";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
// import SaveIcon from "@mui/icons-material/Save";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
// import Button from "./button";
import styled, { keyframes } from "styled-components";
import { amountSymbol } from "../../config/config";
import Loading from "./loading";
import ProductStore from "../../store/productStore";
import preferencesStore from "../../store/preferencesStore";

interface ProductVariationsProps {
  selectedAttributes: [];
  productId: number;
  errors: any;
}

const VariationRow = styled.div`
  box-shadow: 0px 0px 10px 10px #eee;
  padding: 0 20px;
  min-height: 80px;
`;

const VariationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px 10px;
  & > div {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0 15px;
  }
  & > div:first-child {
    margin: 0;
  }
  & > div span {
    align-self: flex-start;
    display: flex;
    position: relative;
    width: 100%;
  }
`;

const VariationLabel = styled.div`
  text-transform: capitalize;
  font-weight: 700;
  margin-top: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding: 10px 0 5px 10px;
  & span {
    font-weight: 400;
  }
`;

// function blinkingEffect() {
//   return keyframes`
//     50% {
//       opacity: 0;
//     }
//   `;
// }
// const AnimatedComponent = styled.div`
//   animation: ${blinkingEffect} 1s linear infinite;
// `;

const ProductVariations = function ProductVariations({
  productId,
  errors,
}: ProductVariationsProps) {
  const handleInputChange = (
    variationId: number,
    propertyToBeUpdated: string,
    value: string | number | boolean,
    rowIndex?: string | number
  ) => {
    const indexOfObject = errors.findIndex((object: any) => {
      return object.field === propertyToBeUpdated && object.field === rowIndex;
    });
    errors.splice(indexOfObject, 1);

    let index = productVariations.productVariations.findIndex(
      (variation) => variation.id === variationId
    );
    if (isValidInput(propertyToBeUpdated, value, index)) {
      productVariations.updateValueOfProduct(index, propertyToBeUpdated, value);
    }
  };

  const isValidInput = (
    propName: string,
    value: number | string | boolean,
    variationIndex: number
  ) => {
    if (
      propName === "sale_price" &&
      Number(value) >=
        Number(
          productVariations.productVariations[variationIndex].regular_price
        )
    ) {
      return false;
    }
    return true;
  };

  // const handleSaveVariations = () => {
  //   productVariations.saveVariations(productId);
  // };

  useEffect(() => {
    if (productId) {
      productVariations.getProductVariations(productId);
    }
  }, [productId]);

  return (
    <div style={{ marginTop: "15px" }}>
      {productVariations.loading ? (
        <Loading />
      ) : (
        productVariations.productVariations.map(
          (variation, index) =>
            variation.attributes[0] && (
              <VariationRow key={variation.id}>
                <VariationLabel>
                  {variation.attributes[0]?.name} :{" "}
                  {variation.attributes[0]?.option}
                </VariationLabel>
                <VariationContainer>
                  <div>
                    <span>Sku</span>
                    <TextField
                      defaultValue={
                        ProductStore.productToBeUpdated.sku +
                        "-" +
                        variation.attributes[0]?.option
                      }
                      value={
                        preferencesStore.preferences.autoGenSku
                          ? ProductStore.productToBeUpdated.sku +
                            "-" +
                            variation.attributes[0]?.option
                          : variation.sku
                      } //variation.sku
                      onChange={(e) =>
                        handleInputChange(
                          variation.id,
                          "sku",
                          e.target.value,
                          index
                        )
                      }
                      disabled={preferencesStore.preferences.autoGenSku}
                      size="small"
                      error={
                        errors.find(
                          (element: any) =>
                            element.field === "sku" && element.index === index
                        )
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div>
                    <span>
                      Regular Price{" "}
                      {index === 0 &&
                        productVariations.productVariations.length !== 1 && (
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              right: "0",
                            }}
                          >
                            <ContentPasteGoIcon
                              sx={{
                                width: "18px",
                                fill: "#1976d2",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                productVariations.copyValues("regular_price")
                              }
                            />
                          </div>
                        )}
                    </span>

                    <TextField
                      value={variation.regular_price}
                      onChange={(e) =>
                        handleInputChange(
                          variation.id,
                          "regular_price",
                          e.target.value,
                          index
                        )
                      }
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {amountSymbol}
                          </InputAdornment>
                        ),
                      }}
                      type="number"
                      error={
                        errors.find(
                          (element: any) =>
                            element.field === "regular_price" &&
                            element.index === index
                        )
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div>
                    <span>
                      Sale Price
                      {index === 0 &&
                        productVariations.productVariations.length !== 1 && (
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              right: "0",
                            }}
                          >
                            <ContentPasteGoIcon
                              sx={{
                                width: "18px",
                                fill: "#1976d2",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                productVariations.copyValues("sale_price")
                              }
                            />
                          </div>
                        )}
                    </span>
                    <TextField
                      value={variation.sale_price}
                      onChange={(e) =>
                        handleInputChange(
                          variation.id,
                          "sale_price",
                          e.target.value
                        )
                      }
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {amountSymbol}
                          </InputAdornment>
                        ),
                      }}
                      type="number"
                    />
                  </div>
                  <div>
                    <span>
                      Stock Quantity
                      {index === 0 &&
                        productVariations.productVariations.length !== 1 && (
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              right: "0",
                            }}
                          >
                            <ContentPasteGoIcon
                              sx={{
                                width: "18px",
                                fill: "#1976d2",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                productVariations.copyValues("stock_quantity")
                              }
                            />
                          </div>
                        )}
                    </span>
                    <TextField
                      value={variation.stock_quantity}
                      onChange={(e) =>
                        handleInputChange(
                          variation.id,
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
                  </div>
                  <div>
                    <span>
                      Weight
                      {index === 0 &&
                        productVariations.productVariations.length !== 1 && (
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              right: "0",
                            }}
                          >
                            <ContentPasteGoIcon
                              sx={{
                                width: "18px",
                                fill: "#1976d2",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                productVariations.copyValues("weight")
                              }
                            />
                          </div>
                        )}
                    </span>
                    <TextField
                      value={variation.weight}
                      onChange={(e) =>
                        handleInputChange(
                          variation.id,
                          "weight",
                          parseInt(e.target.value)
                        )
                      }
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      type="number"
                    />
                  </div>
                </VariationContainer>
              </VariationRow>
            )
        )
      )}
      {/* {productVariations.variationChanged ? (
        <AnimatedComponent>
          <Button
            onClick={handleSaveVariations}
            text="Save Variations"
            size="medium"
            icon={<SaveIcon />}
            sx={{
              marginLeft: "auto",
              display: "flex",
              marginTop: "20px",
            }}
            isLoading={productVariations.loadingSave}
          />
        </AnimatedComponent>
      ) : (
        <>
          <Button
            onClick={handleSaveVariations}
            text="Save Variations"
            size="medium"
            icon={<SaveIcon />}
            sx={{
              marginLeft: "auto",
              display: "flex",
              marginTop: "20px",
            }}
            isLoading={productVariations.loadingSave}
          />
        </>
      )} */}
    </div>
  );
};

export default observer(ProductVariations);
