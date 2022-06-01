import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FC, useState } from "react";

/**
 * Contract for component props
 */
interface Props {
  minValue?: number;
  maxValue?: number;
  currentValue: number;

  // Methods
  onUpdateValue: (newValue: number) => void;
}

/**
 * Component for counting items
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const ItemCounter: FC<Props> = ({
  currentValue,
  onUpdateValue,
  minValue = 1,
  maxValue = 5,
}) => {
  const addOrRemove = (value: number) => {
    const updatedValue = currentValue + value;
    if (updatedValue < minValue || updatedValue > maxValue) return;
    return onUpdateValue(currentValue + value);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton onClick={() => addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
