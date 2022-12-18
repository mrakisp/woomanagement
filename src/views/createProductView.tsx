import React from "react";
import { observer } from "mobx-react-lite";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Grid from "@mui/material/Grid";
import { StyledLabel } from "../common/components/label";

const CreateProduct = function CreateProduct() {
  const handleSave = () => {};

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Grid item xs={9}>
        <StyledLabel>Name</StyledLabel>
        <TextField fullWidth id="filled-hidden-label-small" size="small" />

        <StyledLabel>Description</StyledLabel>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={10}
          style={{ width: "100%" }}
        />

        <StyledLabel>Short Description</StyledLabel>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={5}
          style={{ width: "100%" }}
        />
      </Grid>

      <Grid item xs={3}>
        <StyledLabel>Sku</StyledLabel>
        <TextField id="filled-hidden-label-small" size="small" />

        <StyledLabel>Price</StyledLabel>
        <TextField
          id="filled-hidden-label-small"
          size="small"
          InputProps={{
            inputProps: { min: 0 },
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
          }}
          type="number"
        />

        <StyledLabel>Sale Price</StyledLabel>
        <TextField
          id="filled-hidden-label-small"
          size="small"
          InputProps={{
            inputProps: { min: 0 },
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
          }}
          type="number"
        />
        <StyledLabel>Stock Quantity</StyledLabel>
        <TextField
          id="filled-hidden-label-small"
          size="small"
          InputProps={{
            inputProps: { min: 0 },
          }}
          type="number"
        />
      </Grid>
      <button onClick={handleSave}>Save</button>
    </Grid>
  );
};

export default observer(CreateProduct);
