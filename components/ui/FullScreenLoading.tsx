import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

/**
 * Component for showing a screen loader
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const FullScreenLoading = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"calc(100vh - 200px)"}
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
    >
      <Typography sx={{ mb: 3 }} variant="h1" fontWeight="200">
        Cargando...
      </Typography>
      <CircularProgress thickness={2} />
    </Box>
  );
};
