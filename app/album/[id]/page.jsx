"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlbumTrackList from "../../../components/AlbumTrackList";
import {
  ListItem,
  Typography,
  Container,
  Box,
  List,
  Card,
} from "@mui/material";
import MainHeroPage from "../../../components/MainHeroPage";
import useMediaQuery from "@mui/material/useMediaQuery";

async function getAlbumTrack(albumId) {
  try {
    const url = `/api/album/${albumId}`;
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

export default function AlbumTrack() {
  const [albumInfo, setAlbumInfo] = useState({});
  const [tracks, setTracks] = useState([]);
  const [bgColor, setBgColor] = useState("#202020");
  const [textColor, setTextColor] = useState("#eee");
  const [mainImageData, setMainImageData] = useState([]);
  const albumId = useParams().id;
  const smallScreen = useMediaQuery("(max-width:720px)");

  const fetchData = async () => {
    const newData = await getAlbumTrack(albumId);

    setTracks(newData?.track_list || []);
    setAlbumInfo(newData?.base_album_info || {});
    setMainImageData(newData?.base_album_info.img);
    setBgColor(newData?.bg_color);
    setTextColor(newData?.text_color);
  };

  useEffect(() => {
    fetchData();
  }, [albumId]);

  const heroContent = (
    <>
      <Typography variant={smallScreen ? "h4" : "h3"} component="h1">
        {albumInfo.name}
      </Typography>
      {albumInfo.total_tracks && (
        <Typography
          sx={{ py: 2, textTransform: "uppercase" }}
          variant={smallScreen ? "h6" : "h5"}
          component="h2"
        >
          {albumInfo.total_tracks} tracks
        </Typography>
      )}
    </>
  );

  const mainContent = (
    <>
      {albumInfo?.artists && (
        <Container sx={{ py: 3, px: 0 }}>
          <Typography
            sx={{ textTransform: "uppercase" }}
            variant="h5"
            component="h2"
          >
            Artist
          </Typography>
          <List>
            {albumInfo.artists.map((artist) => (
              <ListItem sx={{ px: 0 }} key={artist.id}>
                <Card
                  variant="outlined"
                  sx={{
                    width: "100%",
                    maxHeight: "100px",
                    backgroundColor: "rgba(0, 0, 0, 0.15)",
                    color: textColor,
                  }}
                  className="f-space"
                >
                  <Box sx={{ minWidth: "100px" }}>
                    <Image
                      src={artist.img[1].url}
                      alt={`${artist.name}_img`}
                      width={100}
                      height={100}
                    />
                  </Box>
                  <Container
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Typography variant="h5" component="p">
                      {artist.name}
                    </Typography>
                  </Container>
                </Card>
              </ListItem>
            ))}
          </List>
        </Container>
      )}

      {tracks.length > 0 && (
        <Container sx={{ mt: 2, mb: 15, px: 0 }}>
          <Typography
            sx={{ textTransform: "uppercase" }}
            variant="h5"
            component="h2"
          >
            All tracks
          </Typography>
          <AlbumTrackList tracks={tracks} textColor={textColor} />
        </Container>
      )}
    </>
  );

  return (
    <MainHeroPage
      smallScreen={smallScreen}
      bgColor={bgColor}
      textColor={textColor}
      heroCondition={albumInfo.name}
      imgUrl={smallScreen ? mainImageData[1]?.url : mainImageData[0]?.url}
      imgAlt={`${albumInfo.name}_img`}
      heroContent={heroContent}
      mainContent={mainContent}
    />
  );
}
