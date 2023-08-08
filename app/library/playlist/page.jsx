"use client";
import { useState, useEffect } from "react";
import PlaylistList from "../../../components/PlaylistList";
import ListLayout from "../../../components/ListLayout";
import PaginationButton from "../../../components/PaginationButton";

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
  const [isNextPage, setIsNextPage] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const fetchData = async () => {
    const newData = await getPlaylist(currentPage);
    console.log(newData?.playlist_list);
    setPlaylists(newData?.playlist_list || []);
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
