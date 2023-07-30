"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import AlbumList from "../../../components/AlbumList";

async function getSavedAlbum(page = 0) {
  try {
    const url = `http://localhost:3000/api/getSavedAlbum${
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

export default function SavedAlbum() {
  const [currentPage, setCurrentPage] = useState(1);
  const [albums, setAlbums] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);

  // Function to fetch data for the current page
  const fetchData = async () => {
    const newData = await getSavedAlbum(currentPage);
    setAlbums(newData?.album_data || []);
    setIsNextPage(newData?.is_next_page || false);
    console.log(newData?.album_data);
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
      {currentPage > 1 && (
        <button onClick={handlePreviousPage}>Previous Page</button>
      )}
      {isNextPage && <button onClick={handleNextPage}>Next Page</button>}
      <br />
      {albums.length > 0 && (
        <div>
          <h1>All saved albums</h1>
          <AlbumList albums={albums} />
        </div>
      )}
    </main>
  );
}
