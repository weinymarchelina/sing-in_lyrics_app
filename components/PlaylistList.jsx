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
    <List>
      {playlists.map((playlist) => (
        <ListItem
          sx={{ px: 0, cursor: "pointer" }}
          key={playlist.id}
          onClick={() => router.push(`/playlist/${playlist.id}`)}
        >
          <Card
            variant="outlined"
            sx={{
              alignItems: "center",
              width: "100%",
              maxHeight: "100px",
              backgroundColor: "#181818",
              color: "#eee",
            }}
            className="f-space"
          >
            {playlist?.img && playlist?.img[0]?.url && (
              <Box sx={{ width: "115px" }}>
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
              <Typography variant="h6" component="p" noWrap>
                {playlist.name}
              </Typography>
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ textTransform: "uppercase" }}
              >
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
