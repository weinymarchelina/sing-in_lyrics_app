import "../styles/global.css";
import MainLayoutProvider from "../components/MainLayoutProvider";

export const metadata = {
  title: "星音 Sing'in Lyric App",
  description:
    "Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word! Sing along with the Lyric Book from Your Personalized Spotify Playlists!",
  icons: {
    icon: "/base_icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <MainLayoutProvider>{children}</MainLayoutProvider>
    </html>
  );
}
