"use client";
import { Container } from "@mui/material";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider } from "@emotion/react";
import { Inter } from "next/font/google";

import Loading from "../app/loading";
import Navbar from "./Navbar";
import PlayerBar from "./PlayerBar";
import theme from "../styles/theme";

const inter = Inter({ subsets: ["latin"] });

export default function MainLayoutProvider({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const matches = useMediaQuery("(max-width:720px)");

  return (
    <ThemeProvider theme={theme}>
      <body className={inter.className}>
        {!isHomePage && !matches && (
          <Container sx={{ minHeight: "calc(2.5rem + 5vh)" }}>
            <Navbar />
          </Container>
        )}
        <Suspense fallback={<Loading />}>{children}</Suspense>
        {!isHomePage && <PlayerBar />}
      </body>
    </ThemeProvider>
  );
}
