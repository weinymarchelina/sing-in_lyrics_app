"use client";

import "../styles/global.css";
import theme from "../styles/theme";
import { ThemeProvider } from "@emotion/react";
import { Container, Box } from "@mui/material";
import Loading from "./loading";
import PlayerBar from "../components/PlayerBar";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Navbar from "../components/Navbar";
import useMediaQuery from "@mui/material/useMediaQuery";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "星音 Sing'in Lyric App",
  description:
    "Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word! Sing along with the Lyric Book from Your Personalized Spotify Playlists!",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);
  const matches = useMediaQuery("(max-width:720px)");

  useEffect(() => {
    if (pathname === "/") {
      setIsHomePage(true);
    } else {
      setIsHomePage(false);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <body className={`${inter.className}`}>
          {!isHomePage && !matches && (
            <Container sx={{ minHeight: "calc(2.5rem + 5vh)" }}>
              <Navbar />
            </Container>
          )}
          <Suspense fallback={<Loading />}>{children}</Suspense>
          {!isHomePage && <PlayerBar />}
        </body>
      </ThemeProvider>
    </html>
  );
}
