import React, { useEffect, useState } from "react";
import productListStore from "../store/productListStore";
import { observer } from "mobx-react-lite";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Row from "../common/components/tableRow";
import Head from "../common/components/tableHead";
import HeadToolbar from "../common/components/tableHeadToolbar";

interface Data {
  images: any;
  sku: string;
  regular_price: number;
  sale_price: number;
  name: string;
  categories: string;
  stock_quantity: string;
  date_created: string;
  status: string;
}

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ProductsTable = function CollapsibleTable({ handleEdit }: any) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("name");
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selected, setSelected] = useState<readonly string[]>([]);

  useEffect(() => {
    productListStore.getAllProductsCount();
    productListStore.getProducts(1, 30);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    productListStore.getProducts(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    productListStore.getProducts(1, +event.target.value);
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = productListStore.allProducts.map((n: any) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {productListStore.allProducts ? (
        <>
          <HeadToolbar numSelected={selected.length} />

          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="collapsible table">
              <Head
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={productListStore.allProducts.length}
              />
              <TableBody>
                {stableSort(
                  productListStore.allProducts,
                  getComparator(order, orderBy)
                )
                  //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index: number) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Row
                        key={row.id}
                        row={row}
                        selected={isItemSelected}
                        labelId={labelId}
                        handleClick={handleClick}
                        handleEdit={handleEdit}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[30, 60, 100]}
            component="div"
            count={productListStore.allProductsCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        "Loading..."
      )}
    </Paper>
  );
};

export default observer(ProductsTable);
