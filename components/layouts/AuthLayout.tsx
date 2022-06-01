import { Box } from "@mui/material";
import Head from "next/head";
import { FC } from "react";

/**
 * Contract for component props
 */
interface Props {
  title: string;
}

/**
 * Layout component for authentication pages
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 200px)"
        >
          {children}
        </Box>
      </main>
    </>
  );
};
