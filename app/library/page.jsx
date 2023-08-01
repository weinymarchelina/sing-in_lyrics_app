"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

async function setCookieWithCode(token, refresh_token) {
  try {
    await fetch(
      `http://localhost:3000/api/getCookie?token=${token}&refreshToken=${refresh_token}`
    );
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

export default function Library() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const refresh_token = searchParams.get("refresh_token");

    if (token) {
      setCookieWithCode(token, refresh_token);
      router.push("/library");
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
