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
      }}
      className={smallScreen ? "" : "f-row"}
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
              maxWidth: `${smallScreen ? 320 : "auto"}`,
            }}
            className={smallScreen ? "f-col" : "f-row"}
          >
            {heroCondition && (
              <Box
                sx={{
                  flex: 1,
                  maxWidth: 320,
                  maxHeight: 320,
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
