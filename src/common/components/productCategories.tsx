import React, { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import categoriesStore from "../../store/categoriesStore";
import { observer } from "mobx-react-lite";
import Checkbox from "@mui/material/Checkbox";
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
    <UlMaxHeightStyled>
      {categoriesStore.productCategories.map((category: any, index: number) =>
        category.parent === 0 ? (
          <ListItemStyled key={category.id}>
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
            <ListItemStyled key={category.id}>
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
        )
      )}
    </UlMaxHeightStyled>
  );
};

export default observer(ProductCategories);
