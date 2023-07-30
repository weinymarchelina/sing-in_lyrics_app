"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlbumTrackList from "../../../components/AlbumTrackList";

async function getAlbumTrack(albumId) {
  try {
    const url = `http://localhost:3000/api/album/${albumId}`;
    const res = await fetch(url, {
      next: {
        revalidate: 5,
      },
    });

    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export default function AlbumTrack() {
  const [tracks, setTracks] = useState([]);
  const albumId = useParams().id;

  const fetchData = async () => {
    const newData = await getAlbumTrack(albumId);
    setTracks(newData?.track_list || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <h1>Album Track</h1>
      <br />
      {tracks.length > 0 && (
        <div>
          <h1>All tracks</h1>
          <AlbumTrackList tracks={tracks} />
        </div>
      )}
    </main>
  );
}
