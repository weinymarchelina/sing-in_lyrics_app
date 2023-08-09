"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PlaylistList from "../../../components/PlaylistList";
import ListLayout from "../../../components/ListLayout";
import PaginationButton from "../../../components/PaginationButton";

async function getPlaylist(page = 0) {
  try {
    const url = `/api/getPlaylist${page ? `?page=${page}` : ""}`;
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

export default function Playlist() {
  const page = useSearchParams().get("page");
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [isNextPage, setIsNextPage] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const fetchData = async () => {
    const newData = await getPlaylist(currentPage);
    setPlaylists(newData?.playlist_list);
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

  const listContent = <PlaylistList playlists={playlists} />;

  return (
    <ListLayout
      pageTitle="Playlist"
      items={playlists}
      currentPage={currentPage}
      buttonCardContent={buttonCardContent}
      listContent={listContent}
    />
  );
}
