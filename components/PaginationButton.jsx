import React from "react";
import { IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const PaginationButton = ({ currentPage, setCurrentPage, isNextPage }) => {
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <>
      {currentPage > 1 && (
        <IconButton onClick={handlePreviousPage}>
          <ArrowBackIosIcon color="secondary" />
        </IconButton>
      )}
      {isNextPage && (
        <IconButton onClick={handleNextPage}>
          <ArrowForwardIosIcon color="secondary" />
        </IconButton>
      )}
    </>
  );
};

export default PaginationButton;
