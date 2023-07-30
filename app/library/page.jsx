"use client";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useCookies } from "react-cookie";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Library({ searchParams }) {
  const [cookies, setCookie] = useCookies();

  console.log(searchParams.code);

  const code = searchParams.code;

  if (code) {
    console.log("Known code: " + code);
  } else {
    console.log(cookies);
    console.log("Cookie value:", getCookie("access_token"));
  }

  if (getCookie("access_token")) {
    console.log("cookie is found!");

    try {
      const res = await fetch("http://localhost:3000/api/getCurrentTrack");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log("Error getting track:", error);
    }
  } else if (code) {
    console.log("redirecting...");

    try {
      const res = await fetch(
        `http://localhost:3000/api/getCookie?code=${code}`
      );
      console.log("Set cookies!");
      console.log(res);
    } catch (error) {
      console.log("Error! What: ", error);
    }
  }

  return (
    <main>
      <h1>Library</h1>
      <br />
      <Link href="/library/savedTrack">Saved Track</Link>
      <br />
      <Link href="/api/getCurrentTrack">Get Current Track</Link>

      {/*
      <Link href="/library/playlist">Playlist</Link>
      <br />
      <Link href="/library/savedTrack">Saved Track</Link>
      <br />
      <Link href="/library/savedAlbum">Saved Album</Link>
      <br />
      {token && <Link href={`/api/getCookie?code=${token}`}>Get Cookie</Link>}
      <br />
      <Link href="/api/playTrack">Play Track</Link>
      <br />
      <Link href="/api/pauseTrack">Pause Track</Link>
      */}
    </main>
  );
}
