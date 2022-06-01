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
const KidsCategoryPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kids");

  return (
    <ShopLayout
      title={"Pikabu Shop - Kids"}
      pageDescription={"Encuentra los mejores productos para niños de Pikabu"}
    >
      <Typography variant="h1" component="h1">
        Niños
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para niños
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsCategoryPage;
