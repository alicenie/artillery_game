import React from "react";
import {
  TextField,
  InputAdornment,
  Slider,
  Typography,
  Grid,
} from "@mui/material";

const Input = (props) => {
  const marks = [
    { value: 0, label: "0˚" },
    { value: 90, label: "90˚" },
  ];

  return (
    <Grid container spacing={8} justifyContent="center">
      <Grid item xs={4}>
        <Typography align="left">Speed</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          placeholder="Input speed..."
          fullWidth
          defaultValue={100}
          InputProps={{
            endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
          }}
          onChange={(e) => props.onSpeedChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <Typography align="left" marginBottom={2}>
          Angle: {props.angle} degrees
        </Typography>
        <Slider
          defaultValue={45}
          min={0}
          max={90}
          valueLabelDisplay="auto"
          marks={marks}
          onChange={(e) => props.onAngleChange(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default Input;
