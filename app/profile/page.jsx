"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/profile");
        const data = await response.json();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <Image
        src={userData.img[1].url} // Replace with the actual image URL
        alt={`${userData.name}_img`}
        width={userData.img[1].width} // Specify the width of the image
        height={userData.img[1].height} // Specify the height of the image
      />
      <h2>Your Top Artists This Month</h2>
      <ul>
        {userData.top_artists.map((artist, index) => (
          <li key={artist.id}>
            <h3>{`${index + 1}. ${artist.name}`}</h3>
            <Image
              src={artist.img[1].url} // Replace with the actual image URL
              alt={`${artist.name}_img`}
              width={artist.img[1].width} // Specify the width of the image
              height={artist.img[1].height} // Specify the height of the image
            />
            {/*
            <span>Popularity: {artist.popularity}</span>
            */}
          </li>
        ))}
      </ul>
      <h2>Your Top Tracks This Month</h2>
      <ul>
        {userData.top_tracks.map((track, index) => (
          <li key={track.id}>
            <h3>{`${index + 1}. ${track.name}`}</h3>
            <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
            <Image
              src={track.album_img[1].url} // Replace with the actual image URL
              alt={`${track.album_name}_img`}
              width={track.album_img[1].width} // Specify the width of the image
              height={track.album_img[1].height} // Specify the height of the image
            />

            {/* <span>Popularity: {track.popularity}</span> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
