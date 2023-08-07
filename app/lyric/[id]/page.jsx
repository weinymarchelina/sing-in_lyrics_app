"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  Container,
  Typography,
  IconButton,
  Card,
  ToggleButtonGroup,
} from "@mui/material";
import MuiToggleButton from "@mui/material/ToggleButton";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import useMediaQuery from "@mui/material/useMediaQuery";

async function savePreference(preference) {
  try {
    await fetch(
      `http://localhost:3000/api/setPreference?preference=${preference}`
    );
  } catch (error) {
    console.log("Error setting preference: ", error);
  }
}

async function getAudio(textList) {
  try {
    const response = await fetch("http://localhost:3000/api/getAudio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_data: textList }),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.log("Error getting audio: ", error);
  }
}

export default function LyricInfo() {
  const [mainData, setMainData] = useState(null);
  const [selectedPhonetic, setSelectedPhonetic] = useState("pinyin");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [phoneticIndex, setPhoneticIndex] = useState(-1);
  const trackId = useParams().id;
  const [lyric, setLyric] = useState([]);
  const smallScreen = useMediaQuery("(max-width:720px)");

  const handlePhoneticsIndex = (newSelectedPhonetic) => {
    const phoneticsList = ["original", "pinyin", "zhuyin", "jyutping"];
    const index = phoneticsList.indexOf(newSelectedPhonetic);

    if (index !== 0) {
      setPhoneticIndex(index);
    } else {
      setPhoneticIndex(-1);
    }
  };

  const handlePreference = async (event, newSelectedPhonetic) => {
    handlePhoneticsIndex(newSelectedPhonetic);
    setSelectedPhonetic(newSelectedPhonetic);
    await savePreference(newSelectedPhonetic);
  };

  const ToggleButton = styled(MuiToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: textColor,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
  });

  useEffect(() => {
    async function fetchLyricData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lyric/${trackId}`
        );
        const data = await response.json();

        setMainData(data);
        setSelectedPhonetic(data?.preference || "pinyin");
        handlePhoneticsIndex(data?.preference);

        const script = {
          name: data?.track.name,
          album_name: data?.track.album_name,
          artists: data?.track.artists.map((artist) => artist.name).join(", "),
        };

        const audioUrl = await getAudio(script);
        setAudioUrl(audioUrl);

        setLyric(data?.lyric);

        setBgColor(data?.bg_color);
        setTextColor(data?.text_color);
      } catch (error) {
        console.error("Error fetching lyric data:", error);
      }
    }

    fetchLyricData();
  }, [trackId]);

  const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const renderArtistList = () => {
    return mainData?.track?.artists?.map((artist) => (
      <ListItem sx={{ px: 0 }} key={artist.id}>
        <Card
          className="f-space"
          variant="outlined"
          sx={{
            width: "100%",
            maxHeight: "100px",
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            color: textColor,
          }}
        >
          <Box sx={{ minWidth: "100px" }}>
            <Image
              src={artist.img[1]?.url ? artist.img[1]?.url : "/backup.jpg"}
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
    ));
  };

  return (
    <Container
      className={smallScreen ? "" : "f-row"}
      sx={{ p: 3, backgroundColor: bgColor, color: textColor }}
    >
      <Box maxWidth={"lg"}>
        {mainData && (
          <Container sx={{ py: 2, px: 0 }}>
            {mainData.track && (
              <Container sx={{ p: 0 }}>
                <Container
                  sx={{
                    py: 3,
                    pb: 10,
                    px: 0,
                    gap: 5,
                    alignItems: "center",
                    maxWidth: `${smallScreen ? 320 : "auto"}`,
                  }}
                  className={smallScreen ? "f-col" : "f-row"}
                >
                  {mainData.track.album_img &&
                    mainData.track.album_img[0]?.url && (
                      <Box
                        sx={{
                          flex: 1,
                          maxWidth: 320,
                          maxHeight: 320,
                          boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                        }}
                      >
                        <Image
                          src={mainData.track.album_img[0].url}
                          alt={`${mainData.track.album_name}_img`}
                          width={300}
                          height={300}
                        />
                      </Box>
                    )}
                  <Container sx={{ pt: 3, px: 0, flex: 1 }}>
                    <Typography
                      variant={smallScreen ? "h3" : "h2"}
                      component="h1"
                    >
                      {mainData.track.name}
                    </Typography>
                    <Typography
                      sx={{ py: 2, textTransform: "uppercase" }}
                      variant={smallScreen ? "h6" : "h5"}
                      component="h2"
                    >
                      <Link href={`/album/${mainData.track.album_id}`}>
                        Album : {mainData.track.album_name}
                      </Link>
                    </Typography>
                  </Container>
                </Container>
                {mainData.track.artists && (
                  <Container sx={{ py: 3, px: 0 }}>
                    <Container
                      className="f-space"
                      sx={{ px: 0, alignItems: "center" }}
                    >
                      <Typography
                        sx={{ textTransform: "uppercase" }}
                        variant="h5"
                        component="h2"
                      >
                        Artist
                      </Typography>
                      {audioUrl && (
                        <IconButton onClick={playAudio}>
                          <RecordVoiceOverIcon sx={{ color: textColor }} />
                        </IconButton>
                      )}
                    </Container>
                    <List>{renderArtistList()}</List>
                  </Container>
                )}
              </Container>
            )}

            <Container sx={{ mb: 15, px: 0 }}>
              <Typography
                sx={{ textTransform: "uppercase", py: 1 }}
                variant="h5"
                component="h2"
              >
                Lyrics
              </Typography>
              {mainData.is_lyric_available && (
                <>
                  <Container sx={{ py: 2, px: 0 }}>
                    <ToggleButtonGroup
                      value={selectedPhonetic}
                      onChange={handlePreference}
                      exclusive
                      sx={{
                        border: `1px solid ${
                          textColor === "#202020" ? "#333" : "#bbb"
                        }`,
                      }}
                    >
                      <ToggleButton
                        value="original"
                        sx={{
                          color: textColor,
                        }}
                      >
                        Original
                      </ToggleButton>
                      <ToggleButton
                        value="pinyin"
                        sx={{
                          color: textColor,
                        }}
                      >
                        Pinyin
                      </ToggleButton>
                      <ToggleButton
                        value="zhuyin"
                        sx={{
                          color: textColor,
                        }}
                      >
                        Zhuyin
                      </ToggleButton>
                      <ToggleButton
                        value="jyutping"
                        sx={{
                          color: textColor,
                        }}
                      >
                        Jyutping
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Container>
                  {lyric.map((line) => (
                    <Container
                      sx={{
                        display: "flex",
                        alignItems: "self-start",
                        flexWrap: "wrap",
                        maxWidth: "100%",
                        px: 0,
                        pb: 1,
                      }}
                    >
                      {line.map((phrase) => {
                        return (
                          <Box sx={{ display: "flex" }}>
                            {phrase.map((word_list) => {
                              return (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    py: 1,
                                    pl: 0,
                                    pr: 2,
                                  }}
                                >
                                  {word_list.map((word) => {
                                    return (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                        }}
                                        style={{
                                          paddingRight: `${
                                            word.length > 1 ? "1.25rem" : "0"
                                          }`,
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            minHeight: "1rem",
                                          }}
                                        >
                                          {word[phoneticIndex]}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: "1.65rem",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {word[0]}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              );
                            })}
                          </Box>
                        );
                      })}
                    </Container>
                  ))}
                </>
              )}
              {!mainData.is_lyric_available && (
                <Typography variant="h6" component="p" sx={{ pt: 3 }}>
                  Looks like this track doesn't have lyrics~
                </Typography>
              )}
            </Container>
          </Container>
        )}
      </Box>
    </Container>
  );
}
