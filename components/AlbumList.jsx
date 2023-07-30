"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AlbumList = ({ albums }) => {
  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id}>
          <h3>{album.name}</h3>
          <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
          <Link href={`/album/${album.id}`}>See Tracks</Link>
          <br />
          {album.img[1].url && (
            <Image
              src={album.img[1].url} // Replace with the actual image URL
              alt={`${album.name}_img`}
              width={album.img[1].width} // Specify the width of the image
              height={album.img[1].height} // Specify the height of the image
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default AlbumList;
