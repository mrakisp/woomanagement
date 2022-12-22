import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import categoriesStore from "../../store/categoriesStore";
import { observer } from "mobx-react-lite";
import Checkbox from "@mui/material/Checkbox";
import Button from "./button";
import TextField from "@mui/material/TextField";

import CachedIcon from "@mui/icons-material/Cached";
import {
  ListItemStyled,
  UlMaxHeightStyled,
} from "../../common/components/styledComponents";

interface ProductCategoriesProps {
  handleCategories: (isChecked: any, data: {}) => void; //any;
  currentCategories: [];
}

const ProductCategories = function ProductCategories({
  handleCategories,
  currentCategories,
}: ProductCategoriesProps) {
  const [categories] = useLocalStorage<string>(
    "categories",
    JSON.parse(JSON.stringify(categoriesStore.productCategories))
  );
  const [searchCategory, setSearchCategory] = useState<string>("");
  const reSyncCategories = () => {
    categoriesStore.getProductCategories();
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchedValue = e?.target.value.toLowerCase();
    if (searchedValue) setSearchCategory(searchedValue);
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
    <>
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
                checked={currentCategories.some(
                  (element: any) => element.id === category.id
                )}
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
                    checked={currentCategories.some(
                      (element: any) => element.id === category.id
                    )}
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
                      checked={currentCategories.some(
                        (element: any) => element.id === category.id
                      )}
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
    </>
  );
};

export default observer(ProductCategories);
