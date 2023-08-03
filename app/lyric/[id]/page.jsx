"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function setPreference(preference) {
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

function isChineseWord(word) {
  const regex = /^[\u4e00-\u9fff]+$/;
  return regex.test(word);
}

function createWordPairs(hanziList, phoneticList) {
  const wordPairs = [];

  for (let i = 0; i < hanziList.length; i++) {
    const hanziWord = hanziList[i];
    const phoneticWord = phoneticList[i];

    if (isChineseWord(hanziWord)) {
      const hanziChars = hanziWord.split(" ");
      const phoneticChars = phoneticWord.split(" ");
      for (let j = 0; j < hanziChars.length; j++) {
        wordPairs.push([hanziChars[j], phoneticChars[j]]);
      }
    } else {
      wordPairs.push([hanziWord, null]);
    }
  }

  return wordPairs;
}

export default function LyricInfo() {
  const [mainData, setMainData] = useState(null);
  const [selectedPhonetic, setSelectedPhonetic] = useState("pinyin");
  const [phoneticsOn, setPhoneticsOn] = useState(true);
  const [audioUrl, setAudioUrl] = useState(null);
  const trackId = useParams().id;
  const [lyric, setLyric] = useState([]);

  useEffect(() => {
    async function fetchLyricData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lyric/${trackId}`
        );
        const data = await response.json();
        console.log(data);
        setMainData(data);
        setSelectedPhonetic(data?.preference || null);

        const script = {
          name: data?.track.name,
          album_name: data?.track.album_name,
          artists: data?.track.artists.map((artist) => artist.name).join(", "),
        };
        console.log(script);
        const audioUrl = await getAudio(script);
        setAudioUrl(audioUrl);

        setLyric(data.lyric.original);
      } catch (error) {
        console.error("Error fetching lyric data:", error);
      }
    }

    fetchLyricData();
  }, [trackId]);

  if (!mainData) {
    return <div>Loading...</div>;
  }

  const { track, is_lyric_available, bg_color, text_color } = mainData;

  const handlePreference = async (phonetic) => {
    await setPreference(phonetic);
    setSelectedPhonetic(phonetic);
  };

  const handlePhoneticsToggle = () => {
    setPhoneticsOn((prev) => !prev);
  };

  const selectedBtn = {
    filter: "brightness(0.8)",
    backgroundColor: bg_color,
    border: `3px solid ${bg_color}`,
    color: text_color,
  };

  const normalBtn = {
    cursor: "pointer",
  };

  return (
    <div
      style={{
        backgroundColor: bg_color,
        color: text_color,
        padding: "2rem",
      }}
    >
      <h2>Track Information</h2>
      <div>
        <div
          style={{
            padding: "2rem",
            width: "300px",
          }}
        >
          <Image
            src={track.album_img[1].url}
            alt={`${track.album_name}_img`}
            width={track.album_img[1].width}
            height={track.album_img[1].height}
            style={{
              boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
            }}
          />
        </div>

        <p>Track Name: {track.name}</p>
        <p>
          Album Name:{" "}
          <Link href={`/album/${track.album_id}`}>{track.album_name}</Link>
        </p>
        <p>Artists:</p>
        <ul>
          {track.artists.map((artist) => (
            <li key={artist.id}>
              <Image
                src={artist.img[1]?.url}
                alt={`${artist.name}_img`}
                width={artist.img[1]?.width}
                height={artist.img[1]?.height}
              />
              <p>{artist.name}</p>
            </li>
          ))}
        </ul>
        {audioUrl && <audio controls src={audioUrl} />}
      </div>
      <h2>Lyric Information</h2>
      {is_lyric_available ? (
        <div>
          <div></div>
        </div>
      ) : (
        <p>Lyric not available</p>
      )}
    </div>
  );
}
