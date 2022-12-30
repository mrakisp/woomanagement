import React, { useState } from "react";
import CreateUpdateProductView from "../../views/createUpdateProductView";
// import ProductList from "../../views/productsListView";
import DashboardView from "../../views/dashboardView";
// import { toJS } from "mobx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Preferences from "./preferences/preferences";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CenteredTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ bgcolor: "#d8e3ed" }}
      >
        <Tab label="Dashboard" />
        {/* <Tab label="Product List" /> */}
        <Tab label="Create Product" />
        <Tab label="Update Product" />
        <Preferences visible={value === 1 || value === 2} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DashboardView />
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        <ProductList />
      </TabPanel> */}
      <TabPanel value={value} index={1}>
        <CreateUpdateProductView viewState={"create"} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CreateUpdateProductView viewState={"update"} />
      </TabPanel>
    </Box>
  );
}
