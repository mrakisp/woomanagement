import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface OrdersReportProps {
  data: any;
}

const titleStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "10px",
  fontSize: "16px",
  minWidth: "150px",
};

export default function OrdersReport({ data }: OrdersReportProps) {
  return (
    <Card sx={{ margin: "20px" }}>
      <CardContent sx={{ padding: "0px" }}>
        <Typography style={titleStyle} color="text.secondary" gutterBottom>
          {data.name}
        </Typography>
        <Typography sx={{ fontSize: 16, textAlign: "center" }}>
          {data.total}
        </Typography>
      </CardContent>
    </Card>
  );
}
