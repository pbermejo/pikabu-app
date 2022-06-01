import Head from "next/head";
import { FC } from "react";
import { Navbar } from "../ui";
import { SideMenu } from "../ui/SideMenu";

/**
 * Contract for component props
 */
interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

/**
 * Layout component for most pages
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <nav>
        <Navbar />
      </nav>

      {/* Sidebar Menu */}
      <SideMenu />

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        {children}
      </main>

      <footer>{/* TODO: Custom Footer */}</footer>
    </>
  );
};
