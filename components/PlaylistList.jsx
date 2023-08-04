"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  List,
  ListItem,
  Box,
  Typography,
  Container,
  Card,
} from "@mui/material";
import { useRouter } from "next/navigation";

const PlaylistItem = ({ playlists }) => {
  const router = useRouter();

  return (
    <List sx={{ mb: 15 }}>
      {playlists.map((playlist) => (
        <ListItem
          sx={{ px: 0, cursor: "pointer" }}
          key={playlist.id}
          onClick={() => router.push(`/playlist/${playlist.id}`)}
        >
          <Card
            className="f-space"
            variant="outlined"
            sx={{
              alignItems: "center",
              width: "100%",
              maxHeight: "100px",
            }}
          >
            {playlist?.img && playlist?.img[0]?.url && (
              <Box sx={{ minWidth: "100px" }}>
                <Image
                  src={playlist.img[0].url}
                  alt={`${playlist.name}_img`}
                  width={100}
                  height={100}
                />
              </Box>
            )}
            <Container
              sx={{ p: 2, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              <Typography noWrap>{playlist.name}</Typography>
              <Typography variant="subtitle2">
                {playlist.total_tracks} tracks
              </Typography>
            </Container>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default PlaylistItem;
