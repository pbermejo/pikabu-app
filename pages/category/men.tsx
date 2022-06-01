import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

/**
 * Page component for category
 * @returns component layout in html
 */
const ManCategoryPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=men");
  return (
    <ShopLayout
      title={"Pikabu Shop - Man"}
      pageDescription={"Encuentra los mejores productos para hombre de Pikabu"}
    >
      <Typography variant="h1" component="h1">
        Hombre
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para hombres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default ManCategoryPage;
