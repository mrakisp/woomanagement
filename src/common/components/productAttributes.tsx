import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import attributesStore from "../../store/attributesStore";
import productTempSavedValuesStore from "../../store/productTempSavedValuesStore";
import { observer } from "mobx-react-lite";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CachedIcon from "@mui/icons-material/Cached";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Alert from "@mui/material/Alert";
import Button from "./button";
import styled from "styled-components";

//Styled internal components
const AttributeRow = styled.div`
  padding: 0 20px;
  min-height: 80px;

  box-shadow: 0px 0px 10px 10px #eee;
`;

const AttributeItem = styled.div`
  background-color: #eee;
  margin: 5px 8px;
  border-radius: 4px;
  padding: 5px 10px 5px 4px;
  display: flex;
  align-items: center;
  display: ${(props) => (props.hidden ? "none" : "flex")};
`;

const AttributeLabel = styled.div`
  text-transform: capitalize;
  font-weight: 700;
  margin-top: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding: 10px 0 5px 10px;
  & span {
    font-weight: 400;
    display: flex;
    flex-direction: column;
  }
`;

const AttributeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 300px;
  overflow: auto;
  padding-bottom: 15px;
`;

interface ProductAttributesProps {
  handleAttributes: (isChecked: any, data: {}) => void;
  handleAttributeVisibility: (isChecked: any, id: string | number) => void;
  handleAttributeIsForVariation: (isChecked: any, id: string | number) => void;
  handleUpdateAttributesForVariations: (
    isChecked: any,
    id: string | number
  ) => void;
  selectedAttributes: [
    {
      id: number;
      name: string;
      position: number;
      visible: boolean;
      variation: boolean;
      options: any;
    }
  ];
}

const ProductAttributes = function ProductAttributes({
  selectedAttributes,
  handleAttributes,
  handleAttributeVisibility,
  handleAttributeIsForVariation,
  handleUpdateAttributesForVariations,
}: ProductAttributesProps) {
  const [fetchedAttributes] = useLocalStorage<string>(
    "attributes",
    JSON.parse(JSON.stringify(attributesStore.productAttributes)),
    true
  );
  const [searchAttribute, setSearchAttribute] = useState<string>("");
  const [isSynchMessageVisible, setSsSynchMessageVisible] = useState(false);
  const [showWarningOnPaste, setShowWarningOnPaste] = useState(false);

  let attributesTerms: any = [];
  selectedAttributes?.forEach((row) => {
    row?.options?.forEach((term: any) => {
      attributesTerms.push(term);
    });
  });

  const handleSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchedValue = e?.target.value.toLowerCase();
    if (searchedValue && searchedValue.length > 0) {
      setSearchAttribute(searchedValue);
    } else {
      setSearchAttribute("");
    }
  };

  const reSyncAttributes = () => {
    setSsSynchMessageVisible(true);
    attributesStore.getProductAttributes();
    setTimeout(() => {
      setSsSynchMessageVisible(false);
    }, 3500);
  };

  const setTempSaveAttributes = () => {
    productTempSavedValuesStore.setTempSaveAttributes();
  };

  const getSavedAttributes = () => {
    productTempSavedValuesStore.getTempSaveAttributes();
    let savedattributesTerms: any = [];
    productTempSavedValuesStore.tempSavedAttributes?.forEach((row) => {
      row?.options?.forEach((term: any) => {
        savedattributesTerms.push(term);
      });
    });

    if (
      !productTempSavedValuesStore.tempSavedAttributes ||
      productTempSavedValuesStore.tempSavedAttributes.length <= 0
    ) {
      setShowWarningOnPaste(true);
      setTimeout(() => {
        setShowWarningOnPaste(false);
      }, 1500);
    } else {
      setShowWarningOnPaste(false);
    }
  };

  useEffect(() => {
    if (fetchedAttributes.length <= 0) {
      attributesStore.getProductAttributes();
    } else {
      attributesStore.setProductAttributes(
        JSON.parse(JSON.stringify(fetchedAttributes))
      );
    }
  }, [fetchedAttributes]);

  return (
    <div style={{ marginTop: "15px", maxHeight: "600px", overflow: "auto" }}>
      <TextField
        label={`Search Attributes`}
        variant="outlined"
        size="small"
        onChange={(e) => handleSearch(e)}
        sx={{
          position: "sticky",
          top: "0",
          zIndex: "2",
          backgroundColor: "#fff",
        }}
      />
      <Button
        onClick={reSyncAttributes}
        text="Sync"
        size="small"
        icon={<CachedIcon />}
        sx={{ marginLeft: "25px" }}
      />
      <Button
        onClick={setTempSaveAttributes}
        text="Copy Selected Attributes"
        size="small"
        icon={<ContentCopyIcon />}
        sx={{ marginLeft: "25px" }}
      />
      <Button
        onClick={getSavedAttributes}
        text="Paste Attributes"
        size="small"
        icon={<ContentPasteGoIcon />}
        sx={{ marginLeft: "25px" }}
        // disabled={
        //   productTempSavedValuesStore.tempSavedAttributes &&
        //   productTempSavedValuesStore.tempSavedAttributes.length > 0
        //     ? false
        //     : true
        // }
      />
      <Alert
        variant="filled"
        severity="success"
        sx={{
          width: "50%",
          display: isSynchMessageVisible ? "flex" : "none",
        }}
      >
        Attributes Updated
      </Alert>
      <Alert
        variant="filled"
        severity="warning"
        sx={{
          width: "50%",
          display: showWarningOnPaste ? "flex" : "none",
        }}
      >
        There is no coppied attributes
      </Alert>
      <>
        <div>
          {attributesStore.productAttributes.map((attribute, index) => (
            <AttributeRow
              key={index}
              // hidden={
              //   searchAttribute !== "" &&
              //   !attribute.name.includes(searchAttribute) &&
              //   !attribute.options
              //     .find((element) => searchAttribute)
              //     .includes(searchAttribute)
              // }
            >
              <AttributeLabel
                key={attribute.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                {attribute.name}{" "}
                <Checkbox
                  // value={
                  //   selectedAttributes.find(
                  //     (element) => element.id === attribute.id
                  //   )?.visible
                  // }
                  sx={{ marginLeft: "auto" }}
                  key={"visible" + attribute.id}
                  checked={
                    selectedAttributes.find(
                      (element) => element.id === attribute.id
                    )?.visible
                      ? true
                      : false
                  }
                  onClick={(e) => handleAttributeVisibility(e, attribute.id)}
                />
                <span>Visible on the product page</span>
                {selectedAttributes.find((element) => element.variation) && (
                  <>
                    <div
                      style={{
                        borderLeft: "1px solid",
                        paddingLeft: "10px",
                        marginLeft: "20px",
                        height: "20px",
                      }}
                    ></div>
                    <Checkbox
                      key={"variationEnabled" + attribute.id}
                      // disabled={
                      //   selectedAttributes.find(
                      //     (element) => element.id === attribute.id
                      //   )
                      //     ? false
                      //     : true
                      // }
                      checked={
                        selectedAttributes.find(
                          (element) => element.id === attribute.id
                        )?.variation
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        handleAttributeIsForVariation(e, attribute.id)
                      }
                    />
                    <span>
                      Used for variations{" "}
                      <span
                        style={{ fontSize: "12px", textTransform: "inherit" }}
                      >
                        (Save attributes to apply variations)
                      </span>
                    </span>
                  </>
                )}
              </AttributeLabel>
              <AttributeList>
                {attribute.options.map((option) => (
                  <AttributeItem
                    key={option}
                    hidden={
                      searchAttribute !== "" &&
                      !option.includes(searchAttribute) &&
                      !attributesTerms.includes(option)
                    }
                  >
                    <Checkbox
                      key={"checkbox" + option}
                      sx={{ padding: "0 5px" }}
                      checked={attributesTerms.includes(option) ? true : false}
                      onClick={(e) =>
                        handleAttributes(e, {
                          option: option,
                          attributeId: attribute.id,
                        })
                      }
                    />
                    {option}
                  </AttributeItem>
                ))}
              </AttributeList>
            </AttributeRow>
          ))}
        </div>
        {selectedAttributes.find((element) => element.variation) && (
          <Button
            onClick={handleUpdateAttributesForVariations}
            text="Save Attributes"
            size="medium"
            icon={<SaveIcon />}
            sx={{ marginLeft: "auto", display: "flex", marginTop: "20px" }}
          />
        )}
      </>
    </div>
  );
};

export default observer(ProductAttributes);
