import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";

/**
 * Page component for empty cart
 * @returns component layout in html
 */
const EmptyPage = () => {
  return (
    <ShopLayout
      title="Cesta vacía"
      pageDescription="No hay artículos en la cesta"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>Tu cesta está vacía</Typography>
          <NextLink href="/" passHref>
            <Link typography="h4" color="secondary">
              Volver
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
