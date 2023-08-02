"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlbumTrackList from "../../../components/AlbumTrackList";

async function getAlbumTrack(albumId) {
  try {
    const url = `http://localhost:3000/api/album/${albumId}`;
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

export default function AlbumTrack() {
  const [albumInfo, setAlbumInfo] = useState({});
  const [tracks, setTracks] = useState([]);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const albumId = useParams().id;

  const fetchData = async () => {
    const newData = await getAlbumTrack(albumId);
    console.log(newData);
    setTracks(newData?.track_list || []);
    setAlbumInfo(newData?.base_album_info || {});
    setBgColor(newData?.bg_color);
    setTextColor(newData?.text_color);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      {albumInfo && (
        <div
          style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: "1rem",
          }}
        >
          <div key={albumInfo.id}>
            <h1>Album Track</h1>
            <h2>{albumInfo.name}</h2>
            {albumInfo?.img && albumInfo.img[1]?.url && (
              <Image
                src={albumInfo.img[1].url}
                alt={`${albumInfo.name}_img`}
                width={albumInfo.img[1].width}
                height={albumInfo.img[1].height}
              />
            )}
            <h3>Artist</h3>
            {albumInfo?.artists &&
              albumInfo.artists.map((artist) => (
                <li key={artist.id}>
                  <p>{artist.name}</p>
                  <Image
                    src={artist.img[1].url}
                    alt={`${artist.name}_img`}
                    width={artist.img[1].width}
                    height={artist.img[1].height}
                  />
                </li>
              ))}

            <p>{albumInfo.total_tracks} tracks</p>
            <br />
          </div>
          <br />
          {tracks.length > 0 && (
            <div>
              <h1>All tracks</h1>
              <AlbumTrackList tracks={tracks} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
