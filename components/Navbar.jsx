"use client";

import Link from "next/link";
import PlayerBar from "./PlayerBar";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <PlayerBar />
        <br />
        <li>
          <Link href="/library">Library</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        {/*
        <li>
          <Link href="/api/logout">Logout</Link>
        </li>
       */}

        {/*
        <li>
          <Link href="/currentTrackLyrics">Current Track Lyrics</Link>
        </li>
        <li>
          <Link href="/previousTrack">Previous Track</Link>
        </li>
        <li>
          <Link href="/api/pauseTrack">Pause</Link>
        </li>
        <li>
          <Link href="/api/playTrack">Play</Link>
        </li>
        <li>
          <Link href="/nextTrack">Next Track</Link>
        </li>
        */}
      </ul>
    </nav>
  );
};

export default Navbar;
