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

export default function LyricInfo() {
  const [lyricData, setLyricData] = useState(null);
  const [selectedPhonetic, setSelectedPhonetic] = useState(null);
  const [phoneticsOn, setPhoneticsOn] = useState(true);
  const trackId = useParams().id;

  useEffect(() => {
    async function fetchLyricData() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lyric/${trackId}`
        );
        const data = await response.json();
        console.log(data);
        setLyricData(data);
        setSelectedPhonetic(data?.preference || null);
      } catch (error) {
        console.error("Error fetching lyric data:", error);
      }
    }

    fetchLyricData();
  }, [trackId]);

  if (!lyricData) {
    return <div>Loading...</div>;
  }

  const { track, is_lyric_available, bg_color, text_color } = lyricData;

  const originalLyric = lyricData.lyric.original;
  const phoneticsLyric = {
    jyutping: lyricData.lyric.jyutping,
    pinyin: lyricData.lyric.pinyin,
    zhuyin: lyricData.lyric.zhuyin,
  };

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
                src={artist.img[1].url}
                alt={`${artist.name}_img`}
                width={artist.img[1].width}
                height={artist.img[1].height}
              />
              <p>{artist.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <h2>Lyric Information</h2>
      {is_lyric_available ? (
        <div>
          <div>
            {Object.keys(phoneticsLyric).map((phonetic) => (
              <button
                style={phonetic === selectedPhonetic ? selectedBtn : normalBtn}
                key={phonetic}
                onClick={() => handlePreference(phonetic)}
              >
                {phonetic}
              </button>
            ))}
            <button
              style={phoneticsOn ? normalBtn : selectedBtn}
              onClick={handlePhoneticsToggle}
            >
              Off
            </button>
          </div>
          <br />
          <div>
            {/* Display the selected phonetic section if phonetics are turned on */}
            {phoneticsOn && (
              <>
                {phoneticsLyric[selectedPhonetic]?.map((version, index) => (
                  <div key={index}>
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      {version.join(" ")}
                    </li>
                    <li
                      style={{
                        fontSize: "1.75rem",
                        listStyle: "none",
                        letterSpacing: "0.25rem",
                      }}
                    >
                      {originalLyric[index].join(" ")}
                    </li>
                    <br />
                  </div>
                ))}
              </>
            )}
            {/* Always display the original Hanzi lyrics */}
            {!phoneticsOn &&
              originalLyric.map((version, index) => (
                <li
                  style={{
                    fontSize: "1.75rem",
                    listStyle: "none",
                    letterSpacing: "0.25rem",
                  }}
                  key={index}
                >
                  {version.join(" ")}
                </li>
              ))}
          </div>
        </div>
      ) : (
        <p>Lyric not available</p>
      )}
    </div>
  );
}
