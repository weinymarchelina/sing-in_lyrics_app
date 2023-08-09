"use client";
import { useState, useEffect } from "react";
import TrackList from "../../../components/TrackList";
import { useParams, useSearchParams } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Container, Card, Typography } from "@mui/material";
import MainHeroPage from "../../../components/MainHeroPage";
import PaginationButton from "../../../components/PaginationButton";

async function getPlaylistTrack(playlistId, page = 1) {
  try {
    const url = `http://localhost:3000/api/playlist/${playlistId}?page=${page}`;
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

export default function PlaylistTrack() {
  const [playlist, setPlaylist] = useState({});
  const playlistId = useParams().id;
  const page = useSearchParams().get("page");
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [isNextPage, setIsNextPage] = useState(false);
  const [bgColor, setBgColor] = useState("#202020");
  const [textColor, setTextColor] = useState("#eee");
  const [mainImageData, setMainImageData] = useState([]);
  const smallScreen = useMediaQuery("(max-width:720px)");

  const fetchData = async () => {
    const newData = await getPlaylistTrack(playlistId, currentPage);
    setPlaylist(newData || {});
    setIsNextPage(newData?.is_next_page);
    setMainImageData(newData?.img);
    setBgColor(newData?.bg_color);
    setTextColor(newData?.text_color);
  };

  useEffect(() => {
    fetchData();
  }, [playlistId, page]);

  const heroContent = (
    <>
      <Typography variant={smallScreen ? "h3" : "h2"} component="h1">
        {playlist.name}
      </Typography>
      {playlist.total_tracks && (
        <Typography
          sx={{ py: 2, textTransform: "uppercase" }}
          variant={smallScreen ? "h6" : "h5"}
          component="h2"
        >
          {playlist.total_tracks} tracks
        </Typography>
      )}
    </>
  );

  const mainContent = (
    <>
      {playlist?.track_list?.length > 0 && (
        <Container sx={{ my: 5, px: 0 }}></Container>
      )}
      {playlist?.track_list?.length > 0 && (
        <Container sx={{ my: 5, px: 0 }}>
          <Typography
            variant="h4"
            sx={{ textTransform: "uppercase", py: 3 }}
            component="h2"
          >
            All tracks
          </Typography>

          <Container
            sx={{
              px: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{ textTransform: "uppercase" }}
            >{`Page ${currentPage}`}</Typography>
            <Card
              variant="outlined"
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
            >
              <PaginationButton
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isNextPage={isNextPage}
              />
            </Card>
          </Container>
          <TrackList tracks={playlist.track_list} textColor={textColor} />
        </Container>
      )}
    </>
  );

  return (
    playlist?.name && (
      <MainHeroPage
        smallScreen={smallScreen}
        bgColor={bgColor}
        textColor={textColor}
        heroCondition={playlist.name}
        imgUrl={mainImageData[0]?.url}
        imgAlt={`${playlist.name}_img`}
        heroContent={heroContent}
        mainContent={mainContent}
      />
    )
  );
}
