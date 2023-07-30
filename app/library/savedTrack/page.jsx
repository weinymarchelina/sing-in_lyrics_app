"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";

async function getSavedTrack(page = 0) {
  try {
    const url = `http://localhost:3000/api/getSavedTrack${
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

export default function SavedTrack() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);

  // Function to fetch data for the current page
  const fetchData = async () => {
    const newData = await getSavedTrack(currentPage);
    setTracks(newData?.track_list || []);
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

  // Function to handle the "Previous Page" button click
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <main>
      <h1>SavedTrack</h1>
      {currentPage > 1 && (
        <button onClick={handlePreviousPage}>Previous Page</button>
      )}
      {isNextPage && <button onClick={handleNextPage}>Next Page</button>}
      <br />
      {!tracks.length && <Link href="/api/getSavedTrack">Get Data</Link>}
      {tracks.length > 0 && (
        <div>
          <h1>All saved tracks</h1>
          <TrackList tracks={tracks} />
        </div>
      )}
    </main>
  );
}
