import Link from "next/link";
import { useState } from "react";

const getPlaylist = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/getSavedTrack");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching current track:", error);
    return "BLANK";
  }
};

export default async function Playlist() {
  const data = await getPlaylist();

  console.log(data);

  return (
    <main>
      <h1>Playlist</h1>
      <Link href="/api/getPlaylist">Get Data</Link>
    </main>
  );
}
