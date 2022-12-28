import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import searchStore from "../../../store/searchStore";
import { debounce } from "lodash";
import SearchOptionPreview from "./searchOptionPreview";
import { searchProductsType } from "./searchTypes";
import SearchIcon from "@mui/icons-material/Search";

interface Product {
  name: string;
  id: number;
  sku: string;
  image: string;
}

interface SearchProps {
  searchBy: { key: string; name: string };
  searchType: string;
}

const SearchInput = function SearchInput({
  searchBy,
  searchType,
}: SearchProps) {
  const [fetchResults, setFetchResults] = useState<Product[]>([]);
  const fetchedResults = searchStore.products.length > 0 ? true : false;
  const searchLabel = `Search by ${searchBy.name}`;
  const searchByKey = searchBy.key;

  const searchByInputValue = (value: string) => {
    if (value && value.length > 3) {
      if (searchType === searchProductsType) {
        searchStore.getProducts(searchByKey, value);
      }
    }
  };

  const handleSelectedValue = (newValue: Product | null) => {
    if (newValue) {
      if (searchType === searchProductsType) {
        searchStore.setSelectedProduct(newValue);
      }
    }
  };

  useEffect(() => {
    if (searchType === searchProductsType) {
      setFetchResults(searchStore.products);
    }
  }, [fetchedResults, searchType]);

  return (
    <Autocomplete
      sx={{ maxWidth: 500 }}
      onInputChange={debounce(
        (e) => searchByInputValue(e?.target?.value),
        1000
      )} // add delay to user typing
      filterOptions={(x) => x}
      isOptionEqualToValue={(fetchResults, value) =>
        fetchResults.name === value.name
      }
      onChange={(event, newValue) => {
        handleSelectedValue(newValue);
      }}
      getOptionLabel={(fetchResults) => fetchResults.name}
      options={fetchResults}
      loading={searchStore.loading}
      renderOption={(props, option) => (
        <SearchOptionPreview
          key={option.id}
          props={props}
          option={option}
          view={searchType}
          searchBy={searchBy}
        />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={searchLabel}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {searchStore.loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}

                {params.InputProps.endAdornment}
              </>
            ),
            startAdornment: <SearchIcon />,
          }}
        />
      )}
    />
  );
};

export default observer(SearchInput);
