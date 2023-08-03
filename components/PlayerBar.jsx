"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

async function handlePlayback(action) {
  try {
    const url = `http://localhost:3000/api/${action}Track`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.log(`Error doing ${action} action:`, error);
  }
}

export default function PlayerBar() {
  const [track, setTrack] = useState(null);
  const [nextTrack, setNextTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchCurrentTrack = async () => {
    const data = await getCurrentTrack();

    if (data?.redirect_user) {
      router.push("/");
    }

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      setIsPlaying(data.current_track?.is_playing);
    }
    console.log(data);
  };

  useEffect(() => {
    fetchCurrentTrack();
  }, [pathname]);

  const handlePlayPauseToggle = async () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    const data = await handlePlayback(isPlaying ? "pause" : "play");

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      console.log(data);
    }
  };

  const handleSkipTrack = async (action) => {
    const data = await handlePlayback(action);

    if (data) {
      setTrack(data.current_track);
      setNextTrack(data.next_track);
      console.log(data);
    }
  };

  return (
    <div>
      {track && (
        <div>
          <p>
            {`You are ${isPlaying ? "playing" : "paused"}: ${track.name} by
            ${track.artists.map((artist) => artist.name).join(", ")}`}
          </p>
          <Image
            src={track.album_img[2].url}
            alt={`${track.album_name}_img`}
            width={track.album_img[2].width}
            height={track.album_img[2].height}
          />
          <Link href={`/lyric/${track.id}`}>Open Lyric</Link>
          <button onClick={handlePlayPauseToggle}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={() => handleSkipTrack("previous")}>
            Previous Track
          </button>
          <button onClick={() => handleSkipTrack("next")}>Next Track</button>
          <br />
          <br />
          {nextTrack && (
            <>
              <Link
                href={`/lyric/${nextTrack.id}`}
              >{`Next track on your playlist: ${
                nextTrack.name
              } by ${nextTrack.artists
                .map((artist) => artist.name)
                .join(", ")}`}</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
