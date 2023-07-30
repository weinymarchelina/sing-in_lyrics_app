"use client";

import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "星音 Sing'in Lyric App",
  description:
    "Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word! Sing along with the Lyric Book from Your Personalized Spotify Playlists!",
};

export default function RootLayout({ children }) {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  if (isHomePage) {
    console.log("you are in the home page");
  }

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
