import React from "react";
import Box from "@mui/material/Box";
import { searchProductsType } from "./searchTypes";

interface Props {
  props: any;
  view: string;
  option: any;
  // searchBy: string;
  searchBy: { key: string; name: string };
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
            src={option.images[0].src ? option.images[0].src : null}
            srcSet={option.images[0].src ? option.images[0].src : null}
            alt={option.name}
          />
          <strong> {searchProductsType ? "Sku" : searchBy.name}: </strong>{" "}
          {option.sku} - <strong> Name: </strong> {option.name}
        </Box>
      );
    } else {
      return null;
    }
  };

  return <Options />;
};

export default SearchOptionPreview;
