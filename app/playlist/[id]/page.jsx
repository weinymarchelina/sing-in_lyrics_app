"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";

async function getPlaylistTrack(playlistId) {
  try {
    const url = `http://localhost:3000/api/playlist/${playlistId}`;
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

export default function PlaylistTrack() {
  const [playlist, setPlaylist] = useState({});
  const playlistId = useParams().id;

  const fetchData = async () => {
    const newData = await getPlaylistTrack(playlistId);
    setPlaylist(newData || {});
    console.log(newData?.track_list);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      {playlist && (
        <div>
          <h1>{playlist.name}</h1>
          <p>{playlist.total_tracks} tracks</p>
        </div>
      )}
      {playlist?.track_list?.length > 0 && (
        <div>
          <h1>All saved tracks</h1>
          <TrackList tracks={playlist.track_list} />
        </div>
      )}
    </main>
  );
}
