import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { amountSymbol } from "../../../config/config";

interface SalesReportProps {
  data: any;
}

const titleStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "10px",
  fontSize: "16px",
  minWidth: "150px",
};

export default function SalesReport({ data }: SalesReportProps) {
  return (
    <div style={{ display: "flex" }}>
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Orders
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_orders}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Sales
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_sales} {amountSymbol}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Items
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_items}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Refunds
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_refunds}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Discount
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_discount} {amountSymbol}
          </Typography>
        </CardContent>
      </Card>
      {data.total_tax !== "0.00" && (
        <Card sx={{ margin: "20px" }}>
          <CardContent sx={{ padding: "0px" }}>
            <Typography style={titleStyle} color="text.secondary" gutterBottom>
              Total Tax
            </Typography>
            <Typography sx={{ fontSize: 16, textAlign: "center" }}>
              {data.total_tax}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Shipping
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_shipping} {amountSymbol}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ margin: "20px" }}>
        <CardContent sx={{ padding: "0px" }}>
          <Typography style={titleStyle} color="text.secondary" gutterBottom>
            Total Customers
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {data.total_customers}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
