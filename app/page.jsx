"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function checkAuth() {
  try {
    const res = await fetch(`http://localhost:3000/api/checkToken`);

    const data = res.json();

    return data;
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

async function clearCookies() {
  try {
    await fetch(`http://localhost:3000/api/logout`);
  } catch (error) {
    console.log("Error setting cookie: ", error);
  }
}

export default async function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth();

      console.log(data);

      if (data?.is_auth) {
        router.push("/library");
      } else {
        await clearCookies();
      }
    };

    handleAuth();
  }, []);

  return (
    <div
      className="f-col"
      style={{
        padding: "3rem",
        backgroundColor: "#202020",
        color: "#eee",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>星音 Sing'in!</h1>
      <h2 style={{ fontSize: "1.5rem" }}>
        Explore Pinyin, Zhuyin, and Jyutping Brilliance for Every Word. Sing
        along with the Lyric Book from Your Personalized Spotify Playlists.
      </h2>
      <button
        onClick={() => router.push("/api/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Login
      </button>
    </div>
  );
}
