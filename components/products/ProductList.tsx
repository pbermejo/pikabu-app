import { Card, CardActionArea, CardMedia, Grid } from "@mui/material";
import { FC } from "react";
import { IProduct } from "../../interfaces";
import { ProductCard } from "./ProductCard";

/**
 * Contract for component props
 */
interface Props {
  products: IProduct[];
}

/**
 * Component for listing products
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </Grid>
  );
};
