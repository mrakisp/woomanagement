import React, { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import categoriesStore from "../../../store/categoriesStore";
import { observer } from "mobx-react-lite";
import Checkbox from "@mui/material/Checkbox";
import Button from "../button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import CachedIcon from "@mui/icons-material/Cached";
import { ListItemStyled, UlMaxHeightStyled } from "../styledComponents";

interface ProductCategoriesProps {
  handleCategories: (isChecked: any, data: {}) => void; //any;
  currentCategories: [];
}

// const style = {
//   WebkitTransition: "opacity 3s ease-in-out",
//   MozTransition: "opacity 3s ease-in-out",
//   msTransition: "opacity 3s ease-in-out",
//   OTransition: "opacity 3s ease-in-out",
//   // transition: visibility 0s, opacity 0.5s linear;
//   opacity: 0,
// };

// const intervalMsg = setInterval(function () {element.innerHTML += "Hello"}, 1000);;

const ProductCategories = function ProductCategories({
  handleCategories,
  currentCategories,
}: ProductCategoriesProps) {
  const [categories] = useLocalStorage<string>(
    "categories",
    JSON.parse(JSON.stringify(categoriesStore.productCategories))
  );
  const [isSynchMessageVisible, setSsSynchMessageVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState<string>("");

  const reSyncCategories = () => {
    setSsSynchMessageVisible(true);
    categoriesStore.getProductCategories();
    setTimeout(() => {
      setSsSynchMessageVisible(false);
    }, 1500);
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchedValue = e?.target.value.toLowerCase();
    if (searchedValue && searchedValue.length > 0) {
      setSearchCategory(searchedValue);
    } else {
      setSearchCategory("");
    }
  };

  useEffect(() => {
    if (categories.length <= 0) {
      categoriesStore.getProductCategories();
    } else {
      categoriesStore.setProductCategories(
        JSON.parse(JSON.stringify(categories))
      );
    }
  }, [categories]);

  return (
    <div style={{ marginTop: "15px" }}>
      <TextField
        label="Search Category"
        variant="outlined"
        size="small"
        onChange={(e) => handleSearch(e)}
      />
      <Button
        onClick={reSyncCategories}
        text="Sync"
        size="small"
        icon={<CachedIcon />}
        sx={{ marginLeft: "25px" }}
        // sx={{ display: "flex", marginLeft: "auto" }}
      />

      <Alert
        variant="filled"
        severity="success"
        sx={{
          width: "100%",
          display: isSynchMessageVisible ? "flex" : "none",
        }}
      >
        Categories Updated
      </Alert>

      <UlMaxHeightStyled>
        {categoriesStore.productCategories.map((category: any, index: number) =>
          category.parent === 0 ? (
            <ListItemStyled
              key={category.id}
              hidden={
                searchCategory !== "" &&
                !category.name.toLowerCase().includes(searchCategory)
              }
            >
              <Checkbox
                key={category.id}
                checked={
                  currentCategories?.some(
                    (element: any) => element.id === category.id
                  )
                    ? true
                    : false
                }
                onClick={(e) =>
                  handleCategories(e, {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                  })
                }
              />
              {category.name}
            </ListItemStyled>
          ) : (
            <ul key={index}>
              {!category.nested ? (
                <ListItemStyled
                  key={category.id}
                  hidden={
                    searchCategory !== "" &&
                    !category.name.toLowerCase().includes(searchCategory)
                  }
                >
                  <Checkbox
                    key={category.id}
                    checked={
                      currentCategories?.some(
                        (element: any) => element.id === category.id
                      )
                        ? true
                        : false
                    }
                    onClick={(e) =>
                      handleCategories(e, {
                        id: category.id,
                        name: category.name,
                        slug: category.slug,
                      })
                    }
                  />
                  {category.name}
                </ListItemStyled>
              ) : (
                <ul>
                  <ListItemStyled
                    key={category.id + category.parent}
                    hidden={
                      searchCategory !== "" &&
                      !category.name.toLowerCase().includes(searchCategory)
                    }
                  >
                    <Checkbox
                      key={category.id}
                      checked={
                        currentCategories?.some(
                          (element: any) => element.id === category.id
                        )
                          ? true
                          : false
                      }
                      onClick={(e) =>
                        handleCategories(e, {
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                        })
                      }
                    />
                    {category.name}
                  </ListItemStyled>
                </ul>
              )}
            </ul>
          )
        )}
      </UlMaxHeightStyled>
    </div>
  );
};

export default observer(ProductCategories);
