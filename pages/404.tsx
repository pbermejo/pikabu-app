import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";

/**
 * Page component for 404 requests
 * @returns component layout in html
 */
const Custom404 = () => {
  return (
    <ShopLayout
      title="Page not found"
      pageDescription={"Nada que mostrar aquí"}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <Typography variant="h1" component="h1" fontSize={100} fontWeight={200}>
          404
        </Typography>
        <Typography
          variant="h1"
          component="h1"
          fontSize={100}
          fontWeight={200}
          marginLeft={3}
          sx={{ display: { xs: "none", sm: "inline" } }}
        >
          |
        </Typography>
        <Typography marginLeft={3}>No se ha encontrado el contenido</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
