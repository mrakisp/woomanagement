import React from "react";
import Box from "@mui/material/Box";
import { searchProductsType } from "./searchTypes";

interface Props {
  props: any;
  view: string;
  option: any;
  searchBy: string;
}

const SearchOptionPreview = function SearchOptionPreview({
  props,
  option,
  view,
  searchBy,
}: Props) {
  const Options = () => {
    if (view === searchProductsType) {
      return (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="50"
            src={option.image}
            srcSet={option.image}
            alt={option.name}
          />
          {searchBy}: {option.sku} - Name: {option.name}
        </Box>
      );
    } else {
      return null;
    }
  };

  return <Options />;
};

export default SearchOptionPreview;
