import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";

interface EnhancedTableToolbarProps {
  numSelected: number;
  deleteSelectedItems: () => void;
  handleSearch: (value: string) => void;
  handleSearchCancel: () => void;
  isSearchResults: boolean;
}

const HeadToolbar = function EnhancedTableToolbar(
  props: EnhancedTableToolbarProps
) {
  const [searchValue, setSearchValue] = useState("");
  const {
    numSelected,
    deleteSelectedItems,
    isSearchResults,
    handleSearch,
    handleSearchCancel,
  } = props;

  const clearSearch = () => {
    setSearchValue("");
    handleSearchCancel();
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Typography
            sx={{
              flex: "1 1 100%",
              backgroundColor: "#174776",
              color: "#fff",
              padding: "10px 20px",
            }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Products
          </Typography>
        </>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={deleteSelectedItems}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div
          style={{
            backgroundColor: "#174776",
            padding: "4px 15px",
            marginRight: "20px",
          }}
        >
          <TextField
            sx={{ minWidth: "350px", backgroundColor: "#fff" }}
            size="small"
            label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e: any) => {
              if (e.key === "Enter") {
                handleSearch(searchValue);
              }
            }}
            InputProps={{
              // startAdornment: <SearchIcon />,
              endAdornment: (
                <>
                  {isSearchResults && (
                    <IconButton
                      color="primary"
                      sx={{ p: "10px" }}
                      onClick={clearSearch}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="primary"
                    sx={{ p: "10px" }}
                    onClick={(e: any) => handleSearch(searchValue)}
                  >
                    <SearchIcon />
                  </IconButton>
                </>
              ),
            }}
          />
        </div>
      )}
    </Toolbar>
  );
};

export default HeadToolbar;
