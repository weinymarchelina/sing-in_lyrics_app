"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const TrackList = ({ tracks }) => {
  console.log(tracks);
  return (
    <ul>
      {tracks.map((track) => (
        <li key={track.id}>
          <h3>{track.name}</h3>
          <h4>{track.album_name}</h4>
          <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
          <Link href={`/lyric/${track.id}`}>Open Lyric</Link>
          <br />
          <Image
            src={track.album_img[1].url} // Replace with the actual image URL
            alt={`${track.album_name}_img`}
            width={track.album_img[1].width} // Specify the width of the image
            height={track.album_img[1].height} // Specify the height of the image
          />
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
