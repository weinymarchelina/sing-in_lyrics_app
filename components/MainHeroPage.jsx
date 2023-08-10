import React from "react";
import Image from "next/image";
import { Container, Box } from "@mui/material";

const MainHeroPage = ({
  smallScreen,
  bgColor,
  textColor,
  heroCondition,
  imgUrl,
  imgAlt,
  heroContent,
  mainContent,
}) => {
  return (
    <Container
      sx={{
        p: 3,
        pb: 25,
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "100vh",
        display: `${smallScreen ? "block" : "flex"}`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }} maxWidth={"lg"}>
        <Container sx={{ py: 2, px: 0 }}>
          <Container
            sx={{
              py: 3,
              pb: 10,
              px: 0,
              gap: 5,
              alignItems: "center",
              width: `${smallScreen ? 320 : "auto"}`,
              display: "flex",
              flexDirection: `${smallScreen ? "column" : "row"}`,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {heroCondition && (
              <Box
                sx={{
                  flex: 1,
                  width: 320,
                  height: 320,
                  boxShadow: "0px 0px 1rem 1rem rgba(0,0,0,0.12)",
                }}
              >
                <Image
                  src={imgUrl ? imgUrl : "/load_img.png"}
                  alt={imgAlt}
                  width={300}
                  height={300}
                />
              </Box>
            )}
            <Container sx={{ pt: 3, px: 0, flex: 1 }}>{heroContent}</Container>
          </Container>
          {mainContent}
        </Container>
      </Box>
    </Container>
  );
};

export default MainHeroPage;
