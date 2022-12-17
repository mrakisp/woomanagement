import React, { useEffect } from "react";
import productsStore from "../../store/productsStore";
import Loading from "../../common/components/loading";
import SearchInput from "../../common/components/search/searchInput";
import { observer } from "mobx-react-lite";
import {
  searchProductsType,
  searchBySku,
} from "../../common/components/search/searchTypes";

const UpdateProducts = function UpdateProducts() {
  useEffect(() => {
    productsStore.getProducts();
  }, []);

  return (
    <>
      <SearchInput searchType={searchProductsType} searchBy={searchBySku} />
      {productsStore.loading ? (
        <Loading />
      ) : (
        productsStore.products.map((product: any) => (
          <div key={product.id}>{product.name}</div>
        ))
      )}
    </>
  );
};

export default observer(UpdateProducts);
