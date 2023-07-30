"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AlbumTrackList = ({ tracks }) => {
  return (
    <ul>
      {tracks.map((track) => (
        <li key={track.id}>
          <h3>{track.name}</h3>
          <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
          <Link href={`/lyric/${track.id}`}>Open Lyric</Link>
        </li>
      ))}
    </ul>
  );
};

export default AlbumTrackList;
