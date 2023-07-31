"use client";

import Navbar from "../components/Navbar";
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
      <body className={`${inter.className}`}>
        {!isHomePage && <Navbar />}
        <br />
        {children}
      </body>
    </html>
  );
}
