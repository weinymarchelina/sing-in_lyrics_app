"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  List,
  ListItem,
  Container,
  Typography,
  IconButton,
  Card,
  ToggleButtonGroup,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import MuiToggleButton from "@mui/material/ToggleButton";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useMediaQuery from "@mui/material/useMediaQuery";
import MainHeroPage from "../../../components/MainHeroPage";

async function savePreference(preference) {
  try {
    await fetch(`/api/setPreference?preference=${preference}`);
  } catch (error) {
    console.log("Error setting preference: ", error);
  }
}

async function getAudio(textList) {
  try {
    const response = await fetch("/api/getAudio", {
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
  const [bgColor, setBgColor] = useState("#202020");
  const [textColor, setTextColor] = useState("#eee");
  const [audioUrl, setAudioUrl] = useState(null);
  const [phoneticIndex, setPhoneticIndex] = useState(-1);
  const trackId = useParams().id;
  const status = useSearchParams().get("status");
  const router = useRouter();
  const [mainImageData, setMainImageData] = useState([]);
  const [lyric, setLyric] = useState([]);
  const [isLyricAvailable, setIsLyricAvailable] = useState(false);
  const [joinedLyrics, setJoinedLyrics] = useState([]);
  const [trackInfoPhonetics, setTrackInfoPhonetics] = useState([]);
  const [artistsPhonetics, setArtistsPhonetics] = useState([]);
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

  const combineWords = (line, index) => {
    let fullLine = "";

    for (const phrase of line) {
      let fullPhrase = "";

      for (const word of phrase) {
        let fullWord = "";

        for (const letter of word) {
          if (!letter[index]) {
            continue;
          }

          fullWord += letter[index];

          if (index !== 0) {
            fullWord += " ";
          }
        }

        fullPhrase += fullWord + " ";
      }

      fullLine += fullPhrase;
    }

    return fullLine;
  };

  useEffect(() => {
    async function fetchLyricData() {
      let additional = "";

      if (status) {
        additional = "?status=next";
      }

      try {
        const url = `/api/lyric/${trackId}${additional}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data?.redirect) {
          router.push("/lyric/current");
          return;
        }

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
        setIsLyricAvailable(data?.is_lyric_available);

        setMainImageData(data?.track.album_img);

        setTrackInfoPhonetics(data?.track_phonetics);
        setArtistsPhonetics(data?.artist_phonetics);

        const trackInfoPhoneticsList = [];

        for (let i = 0; i < 4; i++) {
          const phoneticVersion = [];

          for (const line of data?.track_phonetics) {
            const fullLine = combineWords(line, i);
            phoneticVersion.push(fullLine);
          }

          trackInfoPhoneticsList.push(phoneticVersion);
        }

        const fullLyricsList = [];

        for (let i = 0; i < 4; i++) {
          const phoneticLyrics = [];

          for (const line of data?.lyric) {
            const fullLine = combineWords(line, i);
            phoneticLyrics.push(fullLine);
          }

          fullLyricsList.push(phoneticLyrics);
        }

        setJoinedLyrics(fullLyricsList);
      } catch (error) {
        console.error("Error fetching lyric data:", error);
      }
    }

    fetchLyricData();
  }, [trackId]);

  const playAudio = (event) => {
    event.stopPropagation();
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleCopyLyric = (index) => {
    let text = "";

    if (phoneticIndex > 0) {
      const phoneticLyric = joinedLyrics[phoneticIndex][index];

      if (phoneticLyric !== " ") {
        text += phoneticLyric + "\n";
      }

      text += joinedLyrics[0][index];
    } else text = joinedLyrics[0][index];

    navigator.clipboard.writeText(text);
  };

  const copyAllLyrics = (event) => {
    event.stopPropagation();

    let text = "";

    for (const lines of joinedLyrics[0]) {
      const linesIndex = joinedLyrics[0].indexOf(lines);

      if (phoneticIndex > 0) {
        const phoneticLyric = joinedLyrics[phoneticIndex][linesIndex];

        if (phoneticLyric !== " ") {
          text += phoneticLyric + "\n";
        }
      }
      text += lines + "\n";
    }

    navigator.clipboard.writeText(text);
  };

  const renderLines = (
    line,
    phoneticFontSize = "1rem",
    letterPadding = null
  ) => {
    return line.map((phrase) => {
      return (
        <>
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
                          cursor: "pointer",
                        }}
                        style={{
                          paddingRight: letterPadding
                            ? letterPadding
                            : `${word.length > 1 ? "1.25rem" : "0"}`,
                        }}
                      >
                        <Typography
                          sx={{
                            minHeight: "1rem",
                            fontSize: phoneticFontSize,
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
        </>
      );
    });
  };

  const renderLyrics = (lyric) => {
    return lyric.map((line, index) => (
      <Container
        key={index}
        sx={{
          display: "flex",
          alignItems: "self-start",
          flexWrap: "wrap",
          maxWidth: "100%",
          px: 0,
          pb: 1,
        }}
        onClick={() => handleCopyLyric(index)}
      >
        {renderLines(line)}
      </Container>
    ));
  };

  const renderArtistName = (name, index) => {
    const chineseRegExp = /[\u4e00-\u9fff]/;
    const fullName = combineWords(artistsPhonetics[index], 0);

    if (chineseRegExp.test(fullName) && phoneticIndex > 0) {
      return renderLines(artistsPhonetics[index], "0.9rem", "0.5rem");
    } else {
      return (
        <Typography variant="h5" component="p">
          {name}
        </Typography>
      );
    }
  };

  const renderArtistList = () => {
    return mainData?.track?.artists?.map((artist, index) => (
      <ListItem sx={{ px: 0 }} key={artist.id}>
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            maxHeight: "100px",
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            color: textColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "115px" }}>
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
            {artistsPhonetics.length > 0 &&
              renderArtistName(artist.name, index)}
          </Container>
        </Card>
      </ListItem>
    ));
  };

  const heroContent = mainData?.track && (
    <>
      <Typography variant={smallScreen ? "h3" : "h2"} component="h1">
        {mainData?.track.name}
      </Typography>
      <Typography
        sx={{ py: 2, textTransform: "uppercase" }}
        variant={smallScreen ? "h6" : "h5"}
        component="h2"
      >
        <Link href={`/album/${mainData?.track.album_id}`}>
          Album : {mainData?.track.album_name}
        </Link>
      </Typography>
    </>
  );

  const mainContent = (
    <>
      {trackInfoPhonetics.length > 0 && (
        <Accordion
          sx={{
            px: 0,
            backgroundColor: bgColor,
            color: textColor,
            border: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AccordionSummary
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                flex: 1,
                alignSelf: "flex-end",
              }}
              variant="h5"
              component="h2"
            >
              Track Info
            </Typography>

            {audioUrl && (
              <Container
                sx={{
                  flex: 1,
                  gap: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={playAudio}>
                  <RecordVoiceOverIcon sx={{ color: textColor }} />
                </IconButton>
              </Container>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Container sx={{ px: 0, py: 2 }}>
              <Typography sx={{ textTransform: "uppercase", py: 1 }}>
                Track Name :{" "}
              </Typography>
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
                {renderLines(trackInfoPhonetics[0])}
              </Container>
            </Container>
            <Container sx={{ px: 0, py: 2 }}>
              <Typography sx={{ textTransform: "uppercase", py: 1 }}>
                Album Name :{" "}
              </Typography>
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
                {renderLines(trackInfoPhonetics[1])}
              </Container>
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
      {mainData?.track.artists && (
        <Accordion
          sx={{
            backgroundColor: bgColor,
            color: textColor,
            border: "none",
          }}
          defaultExpanded={true}
        >
          <AccordionSummary
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ textTransform: "uppercase", flex: 1 }}
              variant="h5"
              component="h2"
            >
              Artist
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>{renderArtistList()}</List>
          </AccordionDetails>
        </Accordion>
      )}

      {mainData?.track?.name && (
        <Accordion
          sx={{
            mb: 15,
            px: 0,
            backgroundColor: bgColor,
            color: textColor,
            border: "none",
          }}
          defaultExpanded={true}
        >
          <AccordionSummary
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ textTransform: "uppercase", py: 1, flex: 1 }}
              variant="h5"
              component="h2"
            >
              Lyrics
            </Typography>
            {smallScreen && isLyricAvailable && (
              <Button
                onClick={copyAllLyrics}
                endIcon={<ContentCopyIcon />}
                variant="outlined"
                sx={{
                  color: textColor,
                  borderColor: textColor,
                  ":hover": {
                    borderColor: textColor,
                    color: textColor,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                Copy Lyrics
              </Button>
            )}
          </AccordionSummary>
          <AccordionDetails>
            {isLyricAvailable && (
              <>
                <Container
                  sx={{
                    py: 2,
                    px: 0,
                    width: "100%",
                    display: "flex",
                    gap: 2,
                  }}
                >
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
                        fontSize: "calc(0.6rem + 0.35vw)",
                      }}
                    >
                      Original
                    </ToggleButton>
                    <ToggleButton
                      value="pinyin"
                      sx={{
                        color: textColor,
                        fontSize: "calc(0.6rem + 0.35vw)",
                      }}
                    >
                      Pinyin
                    </ToggleButton>
                    <ToggleButton
                      value="zhuyin"
                      sx={{
                        color: textColor,
                        fontSize: "calc(0.6rem + 0.35vw)",
                      }}
                    >
                      Zhuyin
                    </ToggleButton>
                    <ToggleButton
                      value="jyutping"
                      sx={{
                        color: textColor,
                        fontSize: "calc(0.6rem + 0.35vw)",
                      }}
                    >
                      Jyutping
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {!smallScreen && (
                    <Button
                      onClick={copyAllLyrics}
                      endIcon={<ContentCopyIcon />}
                      variant="outlined"
                      sx={{
                        color: textColor,
                        borderColor: textColor,
                        ":hover": {
                          borderColor: textColor,
                          color: textColor,
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      Copy Lyrics
                    </Button>
                  )}
                </Container>
                {renderLyrics(lyric)}
              </>
            )}
            {!isLyricAvailable && (
              <Typography variant="h6" component="p" sx={{ pt: 3 }}>
                Looks like this track doesn't have lyrics~
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );

  return (
    <MainHeroPage
      smallScreen={smallScreen}
      bgColor={bgColor}
      textColor={textColor}
      heroCondition={mainData?.track.name}
      imgUrl={smallScreen ? mainImageData[1]?.url : mainImageData[0]?.url}
      imgAlt={`${mainData?.track.name}_img`}
      heroContent={heroContent}
      mainContent={mainContent}
    />
  );
}
