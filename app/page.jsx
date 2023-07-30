import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/api/">Login</Link>
      <h1>星音 Sing'in!</h1>
      <h2>
        Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word. Sing
        along with the Lyric Book from Your Personalized Spotify Playlists.
      </h2>
    </main>
  );
}
