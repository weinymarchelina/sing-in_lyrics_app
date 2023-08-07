"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Container,
  List,
  ListItem,
  Typography,
  Box,
  Card,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const router = useRouter();
  const smallScreen = useMediaQuery("(max-width:720px)");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/profile");
        const data = await response.json();
        console.log(data);
        setUserData(data);
        setBgColor(data?.bg_color || "");
        setTextColor(data?.text_color || "");
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <Container
      className={smallScreen ? "" : "f-row"}
      sx={{ p: 3, pb: 25, backgroundColor: bgColor, color: textColor }}
    >
      <Box className="f-col" maxWidth={"lg"} sx={{ width: "100%" }}>
        {userData && (
          <>
            <Container
              className={smallScreen ? "f-col" : "f-row"}
              sx={{
                py: 3,
                pb: 10,
                px: 0,
                gap: 5,
                alignItems: "center",
                maxWidth: `${smallScreen ? 320 : "auto"}`,
              }}
            >
              <Box
                sx={{
                  boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                  flex: 1,
                  maxWidth: 320,
                  maxHeight: 320,
                }}
              >
                <Image
                  src={
                    userData.img[1].url ? userData.img[1].url : "/backup.jpg"
                  }
                  alt={`${userData.name}_img`}
                  width={320}
                  height={330}
                />
              </Box>
              <Typography
                sx={{
                  py: 3,
                  flex: 1,
                  width: "calc(1vw + 300px)",
                  fontWeight: 600,
                }}
                variant={smallScreen ? "h3" : "h2"}
                component="h1"
              >
                {userData.name}'s Music Taste
              </Typography>
            </Container>
            {userData?.top_artists.length > 0 && (
              <Container className="f-col" sx={{ py: 3, px: 0 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ alignSelf: "center", textAlign: "center" }}
                >
                  Current Top Artists
                </Typography>
                <List>
                  <ListItem
                    className="f-col"
                    sx={{ pb: 3 }}
                    key={userData.top_artists[0].id}
                  >
                    <Box sx={{ py: 2 }}>
                      <Image
                        src={
                          userData.top_artists[0].img[0].url
                            ? userData.top_artists[0].img[0].url
                            : "/backup.jpg"
                        }
                        alt={`${userData.top_artists[0].name}_img`}
                        width={userData.top_artists[0].img[1].width}
                        height={userData.top_artists[0].img[1].height}
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      component="p"
                    >{`${userData.top_artists[0].name}`}</Typography>
                  </ListItem>
                  {userData.top_artists.map(
                    (artist, index) =>
                      index > 0 && (
                        <ListItem key={artist.id}>
                          <Card
                            className="f-space"
                            sx={{
                              width: "100%",
                              maxHeight: "100px",
                              backgroundColor: "rgba(0, 0, 0, 0.15)",
                              color: textColor,
                            }}
                            variant="outlined"
                          >
                            <Box sx={{ minWidth: "100px" }}>
                              <Image
                                src={
                                  artist.img[1].url
                                    ? artist.img[1].url
                                    : "/backup.jpg"
                                }
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
                              <Typography
                                variant={smallScreen ? "subtitle" : "h5"}
                                component="p"
                              >{`${index + 1}. ${artist.name}`}</Typography>
                            </Container>
                          </Card>

                          {/*
        <span>Popularity: {artist.popularity}</span>
      */}
                        </ListItem>
                      )
                  )}
                </List>
              </Container>
            )}
            {userData?.top_tracks.length > 0 && (
              <Container className="f-col" sx={{ py: 3, px: 0 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ alignSelf: "center", textAlign: "center" }}
                >
                  Current Top Tracks
                </Typography>
                <List>
                  <ListItem
                    className="f-col"
                    sx={{ pb: 3 }}
                    key={userData.top_tracks[0].id}
                  >
                    <Box sx={{ py: 2 }}>
                      <Image
                        src={
                          userData.top_tracks[0].album_img[0]?.url
                            ? userData.top_tracks[0].album_img[0]?.url
                            : "/backup.jpg"
                        }
                        alt={`${userData.top_tracks[0].album_name}_img`}
                        width={userData.top_tracks[0].album_img[1].width}
                        height={userData.top_tracks[0].album_img[1].height}
                      />
                    </Box>
                    <Typography variant="h4" component="p">
                      {userData.top_tracks[0].name}
                    </Typography>
                  </ListItem>
                  {userData.top_tracks.map(
                    (track, index) =>
                      index > 0 && (
                        <ListItem key={track.id}>
                          <Card
                            className="f-space"
                            sx={{
                              width: "100%",
                              maxHeight: "100px",
                              backgroundColor: "rgba(0, 0, 0, 0.15)",
                              color: textColor,
                            }}
                            variant="outlined"
                          >
                            <Box
                              sx={{
                                minWidth: "100px",
                              }}
                            >
                              <Image
                                src={
                                  track.album_img[1]?.url
                                    ? track.album_img[1]?.url
                                    : "/backup.jpg"
                                }
                                alt={`${track.album_name}_img`}
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
                              <Typography
                                variant={smallScreen ? "subtitle" : "h5"}
                                component="p"
                              >
                                {`${index + 1}. ${track.name}`}
                              </Typography>
                            </Container>
                          </Card>
                        </ListItem>
                      )
                  )}
                </List>
              </Container>
            )}
            <Container className="f-col" sx={{ width: "100%", py: 3 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{ alignSelf: "center", textAlign: "center", pb: 3 }}
              >
                Settings
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  py: 2,
                  color: textColor,
                  borderColor: textColor,
                }}
                onClick={() => router.push("/api/logout")}
              >
                <Typography>Logout</Typography>
              </Button>
            </Container>
          </>
        )}
      </Box>
    </Container>
  );
}
