import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { IconButton } from "@mui/material";
import ArrowCircleRightSharpIcon from "@mui/icons-material/ArrowCircleRightSharp";
import styled from "styled-components";

interface datePickerProps {
  changeFromDate: (date: string) => void;
  changeToDate: (date: string) => void;
  handleDatePickerSumbit: () => void;
}

const Period = styled.div`
margin: 40px 20px 20px;
  // max-width: 500px;
  background-color: #1976d2;
  padding: 15px 15px;
  color: #fff;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 0 10px -3px #000;
  margin-bottom: 40px;
}
`;

export default function BasicDatePicker({
  changeFromDate,
  changeToDate,
  handleDatePickerSumbit,
}: datePickerProps) {
  const [fromValue, setFromValue] = useState<any | null>(null);
  const [toValue, setToValue] = useState<any | null>(null);

  const handleFromDate = (date: any) => {
    setFromValue(date);
    changeFromDate(moment(date).format("YYYY-MM-DD"));
  };

  const handleToDate = (date: any) => {
    setToValue(date);
    changeToDate(moment(date).format("YYYY-MM-DD"));
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label="From"
          value={fromValue}
          inputFormat="DD/MM/YYYY"
          maxDate={new Date()}
          onChange={(newValue) => {
            handleFromDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="To"
          inputFormat="DD/MM/YYYY"
          minDate={fromValue}
          maxDate={new Date()}
          value={toValue}
          onChange={(newValue) => {
            handleToDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <IconButton
        disabled={!fromValue || !toValue}
        onClick={handleDatePickerSumbit}
        sx={{ marginTop: "8px" }}
      >
        <ArrowCircleRightSharpIcon sx={{ fill: "#1976d2" }} />
      </IconButton>
      <Period>
        <span>PERIOD: </span>
        {fromValue && toValue
          ? "From: " +
            moment(fromValue).format("DD/MM/YYYY") +
            " To: " +
            moment(toValue).format("DD/MM/YYYY")
          : "Today"}
      </Period>
    </>
  );
}
