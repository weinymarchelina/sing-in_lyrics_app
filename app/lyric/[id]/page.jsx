"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function LyricInfo() {
  const [lyricData, setLyricData] = useState(null);
  const trackId = useParams().id;

  useEffect(() => {
    // Fetch lyric data only if trackId is not empty
    console.log(trackId);

    async function fetchLyricData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lyric/${trackId}`
        );
        const data = await response.json();
        setLyricData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching lyric data:", error);
      }
    }

    fetchLyricData();
  }, [trackId]);

  if (!lyricData) {
    return <div>Loading...</div>;
  }

  const { track, is_lyric_available, lyric } = lyricData;

  return (
    <div>
      <h2>Track Information</h2>
      <Image
        src={track.album_img[1].url} // Replace with the actual image URL
        alt={`${track.album_name}_img`}
        width={track.album_img[1].width} // Specify the width of the image
        height={track.album_img[1].height} // Specify the height of the image
      />
      <p>Track Name: {track.name}</p>
      <p>Album Name: {track.album_name}</p>
      <p>Artists:</p>
      <ul>
        {track.artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
      <h2>Lyric Information</h2>
      {is_lyric_available ? (
        <div>
          <div>
            <h3>Original</h3>
            <ul>
              {lyric["original"].map((version, index) => (
                <li key={index}>{version.join(" ")}</li>
              ))}
            </ul>
          </div>
          <br />
          <div>
            <h3>Pinyin</h3>
            <ul>
              {lyric["pinyin"].map((version, index) => (
                <li key={index}>{version.join(" ")}</li>
              ))}
            </ul>
          </div>
          <br />
          <div>
            <h3>Zhuyin</h3>
            <ul>
              {lyric["zhuyin"].map((version, index) => (
                <li key={index}>{version.join(" ")}</li>
              ))}
            </ul>
          </div>
          <br />
          <div>
            <h3>Jyutping</h3>
            <ul>
              {lyric["jyutping"].map((version, index) => (
                <li key={index}>{version.join(" ")}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Lyric not available</p>
      )}
    </div>
  );
}
