import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "星音 Sing'in Lyric App",
  description:
    "Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word! Sing along with the Lyric Book from Your Personalized Spotify Playlists!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navbar />
        <br />
        {children}
      </body>
    </html>
  );
}
