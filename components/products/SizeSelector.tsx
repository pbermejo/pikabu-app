import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

/**
 * Contract for component props
 */
interface Props {
  selectedSize?: ISize;
  sizes: ISize[];

  // Method
  onSelectedSize: (size: ISize) => void;
}

/**
 * Component for selecting sizes of products
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSelectedSize,
}) => {
  return (
    <Box display="flex" justifyContent="space-between">
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
          onClick={() => onSelectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
