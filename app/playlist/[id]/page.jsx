"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import Image from "next/image";

async function getPlaylistTrack(playlistId, page = 1) {
  try {
    const url = `http://localhost:3000/api/playlist/${playlistId}?page=${page}`;
    console.log(url);
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
  const router = useRouter();
  const pathname = usePathname();
  const playlistId = useParams().id;
  const page = useSearchParams().get("page");
  const currentPage = page ? parseInt(page) : 1;
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");

  const fetchData = async () => {
    const newData = await getPlaylistTrack(playlistId, currentPage);
    setPlaylist(newData || {});
    console.log(newData);
    setBgColor(newData?.bg_color || "");
    setTextColor(newData?.text_color || "");
  };

  useEffect(() => {
    fetchData();
  }, [playlistId, page]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    router.push(`${pathname}?page=${nextPage}`);
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    router.push(`${pathname}?page=${prevPage}`);
  };

  return (
    <main>
      {playlist && (
        <div
          style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: "1rem",
          }}
        >
          {page > 1 && (
            <button onClick={handlePreviousPage}>Previous Page</button>
          )}

          {playlist?.is_next_page && (
            <button onClick={handleNextPage}>Next Page</button>
          )}

          {playlist && (
            <div>
              <h1>{playlist.name}</h1>
              <p>{playlist.total_tracks} tracks</p>
              {playlist?.img && playlist?.img[0]?.url && (
                <Image
                  src={playlist.img[0].url}
                  alt={`${playlist.name}_img`}
                  width={300}
                  height={300}
                />
              )}
            </div>
          )}
          {playlist?.track_list?.length > 0 && (
            <div>
              <h1>All saved tracks</h1>
              <TrackList tracks={playlist.track_list} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
