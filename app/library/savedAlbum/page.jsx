"use client";
import { useState, useEffect } from "react";
import AlbumList from "../../../components/AlbumList";
import ListLayout from "../../../components/ListLayout";
import PaginationButton from "../../../components/PaginationButton";

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
  const [isNextPage, setIsNextPage] = useState(false);
  const [albums, setAlbums] = useState([]);

  const fetchData = async () => {
    const newData = await getSavedAlbum(currentPage);
    setAlbums(newData?.album_data || []);
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

  const listContent = <AlbumList albums={albums} />;

  return (
    <ListLayout
      pageTitle="Saved Album"
      items={albums}
      currentPage={currentPage}
      buttonCardContent={buttonCardContent}
      listContent={listContent}
    />
  );
}
