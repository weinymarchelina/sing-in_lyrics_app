"use client";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import ListLayout from "../../../components/ListLayout";
import PaginationButton from "../../../components/PaginationButton";
import { useSearchParams } from "next/navigation";

async function getSavedTrack(page = 1) {
  try {
    const url = `/api/getSavedTrack${page ? `?page=${page}` : ""}`;
    const res = await fetch(url, {
      next: {
        revalidate: 5,
      },
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

export default function SavedTrack() {
  const page = useSearchParams().get("page");
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [isNextPage, setIsNextPage] = useState(false);
  const [tracks, setTracks] = useState([]);

  const fetchData = async () => {
    const newData = await getSavedTrack(currentPage);
    setTracks(newData?.track_list || []);
    setIsNextPage(newData?.is_next_page || false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const buttonCardContent = (
    <PaginationButton
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isNextPage={isNextPage}
    />
  );

  const listContent = <TrackList tracks={tracks} />;

  return (
    <ListLayout
      pageTitle="Saved Track"
      items={tracks}
      currentPage={currentPage}
      buttonCardContent={buttonCardContent}
      listContent={listContent}
    />
  );
}
