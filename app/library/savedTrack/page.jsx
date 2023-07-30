"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

async function getSavedTrack(page = 0) {
  try {
    const url = `http://localhost:3000/api/getSavedTrack${
      page ? `?page=${page}` : ""
    }`;
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export default function SavedTrack() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);

  // Function to fetch data for the current page
  const fetchData = async () => {
    const newData = await getSavedTrack(currentPage);
    setData(newData);
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
      <h1>SavedTrack</h1>
      <button onClick={handleNextPage}>NEXT PAGE</button>
      <br />
      {!data && <Link href="/api/getSavedTrack">Get Data</Link>}
      {data && (
        <div>
          <h1>All saved tracks</h1>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </div>
      )}
    </main>
  );
}
