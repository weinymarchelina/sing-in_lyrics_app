"use client";

import "../styles/global.css";
import theme from "../styles/theme";
import { ThemeProvider } from "@emotion/react";
import { Container, Box } from "@mui/material";
import PlayerBar from "../components/PlayerBar";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "星音 Sing'in Lyric App",
  description:
    "Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word! Sing along with the Lyric Book from Your Personalized Spotify Playlists!",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);

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
          <Box sx={{ pb: 2 }}>{children}</Box>
          {!isHomePage && <PlayerBar />}
        </body>
      </ThemeProvider>
    </html>
  );
}
