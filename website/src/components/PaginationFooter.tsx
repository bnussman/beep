import React from "react";
import { Pagination, PaginationProps, Stack, Typography } from "@mui/material";

interface Props extends PaginationProps {
  pageSize: number;
}

export function PaginationFooter(props: Props) {
  const page = props.page ?? 1;

  const startIndex = (page - 1) * props.pageSize;
  const endIndex = Math.min(startIndex + props.pageSize, props.results ?? 0);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography>
        Showing {startIndex} to {endIndex} of {props.results} results
      </Typography>
      <Pagination {...props} />
    </Stack>
  );
}
