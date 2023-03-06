import React from "react";
import {
  TextField,
  InputAdornment,
  Slider,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const Input = (props) => {
  const marks = [
    { value: 0, label: "0˚" },
    { value: 90, label: "90˚" },
  ];

  return (
    <Grid
      container
      columnSpacing={8}
      justifyContent={"center"}
      alignItems={"center"}
      padding={2}
    >
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
          type="number"
          onChange={(e) => props.onSpeedChange(e.target.value)}
          color={"primary"}
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
          color={"primary"}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          size="large"
          color="error"
          startIcon={<LocalFireDepartmentIcon />}
          onClick={props.onFire}
          disabled={!props.isTurn}
        >
          Fire
        </Button>
      </Grid>
    </Grid>
  );
};

export default Input;
