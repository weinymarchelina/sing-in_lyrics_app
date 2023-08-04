"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { List, ListItem, Typography, Card } from "@mui/material";
import { useRouter } from "next/navigation";

const AlbumTrackList = ({ tracks }) => {
  const router = useRouter();
  return (
    <List>
      {tracks.map((track) => (
        <ListItem
          className="f-col"
          key={track.id}
          sx={{ alignItems: "flex-start", px: 0 }}
          onClick={() => router.push(`/lyric/${track.id}`)}
        >
          <Card
            sx={{
              width: "100%",
              p: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography sx={{ pb: 1 }} noWrap>
              {track.name}
            </Typography>
            <Typography variant="subtitle2" noWrap>
              {track.artists.map((artist) => artist.name).join(", ")}
            </Typography>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default AlbumTrackList;
