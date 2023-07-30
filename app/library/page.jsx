"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

async function getCurrentTrack() {
  try {
    const res = await fetch("http://localhost:3000/api/getCurrentTrack");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error getting track:", error);
    return null;
  }
}

async function setCookieWithCode(code) {
  try {
    await fetch(`http://localhost:3000/api/getCookie?code=${code}`);
    console.log("Cookie set successfully");
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

export default function Library({ searchParams }) {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    // Check if the code parameter is available in the searchParams
    const code = searchParams?.code;
    if (code) {
      // Send a request to set the cookie with the provided code
      setCookieWithCode(code);
    }

    // Fetch current track data and update the state
    const fetchCurrentTrack = async () => {
      const data = await getCurrentTrack();
      if (data) {
        setTrack(data);
      }
    };

    fetchCurrentTrack();
  }, [searchParams]);

  return (
    <main>
      <h1>Library</h1>
      {track && <p>You are playing: {track.name}</p>}
      <br />
      <Link href="/library/playlist">Playlist</Link>
      <br />
      <Link href="/library/savedTrack">Saved Track</Link>
      <br />
      <Link href="/library/savedAlbum">Saved Album</Link>
      <br />
    </main>
  );
}
