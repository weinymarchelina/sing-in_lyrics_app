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
import { Box, Container, Card, IconButton, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

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
  const [bgColor, setBgColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#202020");

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
    <Container sx={{ p: 3, backgroundColor: bgColor, color: textColor }}>
      {playlist && (
        <Container
          style={{
            padding: "1rem",
          }}
        >
          {playlist && (
            <Container>
              {playlist?.img && playlist?.img[0]?.url && (
                <Box>
                  <Image
                    src={playlist.img[0].url}
                    alt={`${playlist.name}_img`}
                    width={300}
                    height={300}
                  />
                </Box>
              )}
              <Container>
                <Typography variant="h3" component="h1">
                  {playlist.name}
                </Typography>
                <Typography>{playlist.total_tracks} tracks</Typography>
              </Container>
              <Container className="f-space">
                <Typography
                  variant="h6"
                  sx={{ textTransform: "uppercase" }}
                >{`Page ${currentPage}`}</Typography>
                <Card variant="outlined">
                  {page > 1 && (
                    <IconButton onClick={handlePreviousPage}>
                      <ArrowBackIosIcon />
                    </IconButton>
                  )}
                  {playlist?.is_next_page && (
                    <IconButton onClick={handleNextPage}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </Card>
              </Container>
            </Container>
          )}
          {playlist?.track_list?.length > 0 && (
            <Container sx={{ my: 5 }}>
              <Typography variant="h5">All saved tracks</Typography>
              <TrackList tracks={playlist.track_list} />
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
}
