"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

async function getCurrentTrack() {
  try {
    const res = await fetch("http://localhost:3000/api/getCurrentTrack", {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error getting track:", error);
    return null;
  }
}

export default function PlayerBar() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    // Fetch current track data and update the state
    const fetchCurrentTrack = async () => {
      const data = await getCurrentTrack();
      if (data) {
        console.log(data);
        setTrack(data);
      }
    };

    fetchCurrentTrack();
  }, []);

  return (
    <div>
      {track && (
        <div>
          <p>
            {`You are playing: ${track.name} by
            ${track.artists.map((artist) => artist.name).join(", ")}`}
          </p>
          <Image
            src={track.album_img[2].url} // Replace with the actual image URL
            alt={`${track.album_name}_img`}
            width={track.album_img[2].width} // Specify the width of the image
            height={track.album_img[2].height} // Specify the height of the image
          />
          <Link href={`/lyric/${track.id}`}>Open Lyric</Link>
        </div>
      )}
    </div>
  );
}
