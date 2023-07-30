"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

async function setCookieWithCode(code) {
  try {
    await fetch(`http://localhost:3000/api/getCookie?code=${code}`);
    console.log("Cookie set successfully");
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

export default function Library({ searchParams }) {
  useEffect(() => {
    // Check if the code parameter is available in the searchParams
    const code = searchParams?.code;
    if (code) {
      // Send a request to set the cookie with the provided code
      setCookieWithCode(code);
    }
  }, [searchParams]);

  return (
    <main>
      <h1>Library</h1>
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
