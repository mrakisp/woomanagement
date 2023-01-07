import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import EditIcon from "@mui/icons-material/Edit";
import { amountSymbol } from "../../config/config";
import productListStore from "../../store/productListStore";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

interface ProductsProps {
  id: string;
  name: string;
  sku: string;
  regular_price: any;
  sale_price: any;
  stock_quantity: string;
  date_created: string;
  stock_status: string;
  status: string;
  categories: [];
  attributes: [];
  type: string;
  images: any;
  price_html: string;
}

const Row = function Row(props: {
  row: ProductsProps;
  selected: boolean;
  labelId: string;
  handleSelect: (event: React.MouseEvent<unknown>, id: number | string) => void;
  handleEdit: any;
}) {
  const { row, selected, labelId, handleSelect, handleEdit } = props;
  const [open, setOpen] = useState(false);
  const [variations, setVariations] = useState([]);

  const handleOpen = (id: string | number) => {
    if (row.type === "variable" && id) {
      if (variations.length > 0) {
        setOpen(!open);
      } else {
        productListStore.getProductVariations(id).then((variations) => {
          console.log(variations);
          setVariations(variations);
          setOpen(!open);
        });
      }
    } else {
      setOpen(!open);
    }
  };

  let categories = "";
  row.categories.forEach(function (element: any, index: number) {
    categories = categories + element.name;
    if (index !== row.categories.length - 1) categories = categories + ", ";
  });

  if (row.type === "variable") {
    const parsedPrices = row.price_html?.match(/([0-9]*,[0-9]+)/g);
    row.regular_price = parsedPrices ? parseFloat(parsedPrices[0]) : 0;
    row.sale_price = parsedPrices ? parseFloat(parsedPrices[1]) : 0;
  } else {
    row.regular_price = parseFloat(row.regular_price);
    row.sale_price = parseFloat(row.sale_price);
  }

  const Attributes = ({ attributes }: any) => {
    return (
      <>
        <TableHead>
          <TableRow>
            <TableCell>Attribute</TableCell>
            <TableCell>Values</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {attributes.map((attribute: any) => (
            <TableRow key={attribute.id}>
              <TableCell padding="checkbox">{attribute.name}</TableCell>
              <TableCell component="th" scope="row">
                {attribute.options.map((option: any, index: number) =>
                  index !== attribute.options.length - 1
                    ? option + ", "
                    : option
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    );
  };

  const Variations = ({ variations }: any) => {
    return (
      <>
        <TableHead>
          <TableRow>
            <TableCell>Variation</TableCell>
            <TableCell>Option</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sale Price</TableCell>
            <TableCell>Stock Quantity</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {variations.map((variation: any) => (
            <TableRow key={variation.id}>
              <TableCell component="th" scope="row">
                {variation.attributes[0].name}
              </TableCell>
              <TableCell component="th" scope="row">
                {variation.attributes[0].option}
              </TableCell>
              <TableCell component="th" scope="row">
                {variation.regular_price}
              </TableCell>
              <TableCell component="th" scope="row">
                {variation.sale_price ? variation.sale_price : "-"}
              </TableCell>
              <TableCell component="th" scope="row">
                {variation.stock_quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    );
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={selected}
            onClick={(event) => handleSelect(event, row.id)}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell padding="none">
          <img
            style={{ width: "60px" }}
            src={
              row.images && row.images[0] && row.images[0].src
                ? row.images[0].src
                : null
            }
            alt={row.name}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.sku}
        </TableCell>
        <TableCell>
          {row.name}
          <span
            style={{
              display: "flex",
              fontSize: "12px",
              fontStyle: "italic",
              color: "#9e9e9e",
            }}
          >
            Id: {row.id}
          </span>
        </TableCell>
        <TableCell>
          {row.regular_price}
          {amountSymbol}
        </TableCell>
        <TableCell>
          {row.sale_price ? row.sale_price + amountSymbol : "-"}
        </TableCell>
        <TableCell
          style={{
            color: row.stock_status === "outofstock" ? "red" : "green",
            fontWeight: "600",
          }}
        >
          {row.type === "simple"
            ? row.stock_status + " ( " + row.stock_quantity + " )"
            : row.stock_status}
          {row.type === "variable" && (
            <Tooltip title="Expand row to see more details">
              <InfoIcon
                sx={{ cursor: "pointer", fontSize: "15px" }}
                onClick={() => handleOpen(row.id)}
              />
            </Tooltip>
          )}
        </TableCell>
        <TableCell sx={{ maxWidth: "100px" }}>{categories}</TableCell>
        <TableCell>{row.date_created}</TableCell>
        <TableCell>
          <span
            style={{
              padding: "10px",
              color: "#fff",
              backgroundColor: row.status === "publish" ? "green" : "#b14d4d",
              borderRadius: "5px",
            }}
          >
            {row.status}
          </span>
        </TableCell>
        {row.attributes && row.attributes.length > 0 ? (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => handleOpen(row.id)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        ) : (
          <TableCell />
        )}
        <TableCell>
          <EditIcon
            sx={{ cursor: "pointer;" }}
            onClick={() => handleEdit(row.id)}
            color="info"
          />
        </TableCell>
      </TableRow>
      {row.attributes && row.attributes.length > 0 && (
        <TableRow
          sx={{ boxShadow: "-6px 12px 13px -16px", backgroundColor: "#f6f6f6" }}
        >
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <div style={{ display: "flex", paddingBottom: "25px" }}>
                  {row.attributes && row.attributes.length > 0 && (
                    <Table size="small">
                      <Attributes attributes={row.attributes} />
                    </Table>
                  )}
                  {row.type === "variable" &&
                    variations &&
                    variations.length > 0 && (
                      <Table size="small">
                        <Variations variations={variations} />
                      </Table>
                    )}
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default Row;
