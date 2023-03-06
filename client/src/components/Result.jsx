import "./style.css";
import React from "react";
import { Box, Card, Typography } from "@mui/material";

const Result = ({ isWinner }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
      }}
    >
      <Card
        sx={{
          width: "30%",
          height: "30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5%",
          boxShadow: "0 0 20px rgba(0, 0, 80%, 0.5)",
        }}
      >
        <Typography variant="h2">
          {isWinner ? "You win!" : "You lose!"}
        </Typography>
      </Card>
    </Box>
  );
};

export default Result;
