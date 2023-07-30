"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

async function getPlaylist(page = 0) {
  try {
    const url = `http://localhost:3000/api/getPlaylist${
      page ? `?page=${page}` : ""
    }`;
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

export default function Playlist() {
  const [currentPage, setCurrentPage] = useState(1);
  const [playlists, setPlaylists] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);

  // Function to fetch data for the current page
  const fetchData = async () => {
    const newData = await getPlaylist(currentPage);
    setPlaylists(newData?.playlist_list || []);
    setIsNextPage(newData?.is_next_page || false);
  };

  // Fetch data when the component mounts or when the currentPage changes
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Function to handle the "Next Page" button click
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <main>
      <h1>Playlist</h1>
      {isNextPage && <button onClick={handleNextPage}>NEXT PAGE</button>}
      <br />
      {!playlists.length && <Link href="/api/getPlaylist">Get Data</Link>}
      {playlists.length > 0 && (
        <div>
          <h1>All playlists</h1>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id}>{playlist.name}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
