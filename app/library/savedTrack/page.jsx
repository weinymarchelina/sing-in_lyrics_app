"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

async function getSavedTrack(page = 1) {
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
  const [tracks, setTracks] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const page = useSearchParams().get("page");
  const currentPage = page ? parseInt(page) : 1;

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
    const nextPage = currentPage + 1;
    router.push(`${pathname}?page=${nextPage}`);
  };

  // Function to handle the "Previous Page" button click
  const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    router.push(`${pathname}?page=${prevPage}`);
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
