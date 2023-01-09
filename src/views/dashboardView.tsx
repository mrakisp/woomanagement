import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import DatePicker from "../common/components/datePicker";
import dashboardStore from "../store/dashboardStore";
import SalesReport from "../common/components/reports/sales";
import OrdersReport from "../common/components/reports/orders";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styled from "styled-components";

const HeaderTitle = styled.div`
background-color: rgb(25, 118, 210);
color: rgb(255, 255, 255);
padding: 10px;
font-size: 16px;
min-width: 150px;
max-width: 400px;
margin: 18px 0 0 15px;
border-radius: 4px;
}
`;

const Dashboard = function Dashboard() {
  const changeFromDate = (date: string) => {
    dashboardStore.setFromDate(date);
  };

  const changeToDate = (date: string) => {
    dashboardStore.setToDate(date);
  };

  const handleDatePickerSumbit = () => {
    dashboardStore.getSalesReport();
    dashboardStore.getTopSellersReport();
    dashboardStore.getOrdersReport();
  };

  useEffect(() => {
    dashboardStore.getSalesReport();
    dashboardStore.getTopSellersReport();
    dashboardStore.getOrdersReport();
  }, []);

  return (
    <div>
      <DatePicker
        changeFromDate={changeFromDate}
        changeToDate={changeToDate}
        handleDatePickerSumbit={handleDatePickerSumbit}
      />
      <HeaderTitle>SALES</HeaderTitle>
      {dashboardStore.sales.map((sale: any, index: number) => (
        <SalesReport key={"sales" + index} data={sale} />
      ))}
      <HeaderTitle>ORDERS</HeaderTitle>
      <div style={{ display: "flex" }}>
        {dashboardStore.orders.map((order: any, index: number) => (
          <OrdersReport key={order.slug} data={order} />
        ))}
      </div>
      <HeaderTitle>TOP SELLERS</HeaderTitle>
      <TableContainer>
        <Table sx={{ maxWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardStore.topSellers.map((topSeller: any) => (
              <TableRow
                key={topSeller.product_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {topSeller.name}
                </TableCell>
                <TableCell>{topSeller.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default observer(Dashboard);
