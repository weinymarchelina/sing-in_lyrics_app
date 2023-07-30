"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const PlaylistItem = ({ playlists }) => {
  /*
        <Image
            src={playlist.images[1].url} // Replace with the actual image URL
            alt={`${playlist.name}_img`}
            width={playlist.images[1].width} // Specify the width of the image
            height={playlist.images[1].height}
          />
 */

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>
          <h3>{playlist.name}</h3>
          <p>{playlist.total_tracks} tracks</p>
          <Link href={`/playlist/${playlist.id}`}>See Tracks</Link>
        </li>
      ))}
    </ul>
  );
};

export default PlaylistItem;
