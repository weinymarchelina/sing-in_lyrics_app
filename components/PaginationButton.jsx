import React from "react";
import { IconButton } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const PaginationButton = ({ currentPage, setCurrentPage, isNextPage }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    router.push(`${pathname}?page=${nextPage}`);
    setCurrentPage(nextPage);
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    router.push(`${pathname}?page=${prevPage}`);
    setCurrentPage(prevPage);
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
