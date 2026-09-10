import React from "react";
import { Pagination, PaginationProps, Stack, Typography } from "@mui/material";

interface Props extends PaginationProps {
  pageSize: number;
}

export function PaginationFooter({ pageSize, ...props }: Props) {
  const page = props.page ?? 1;

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, props.results ?? 0);

  const formatter = new Intl.NumberFormat();

  const results = formatter.format(props.results ?? 0);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: "flex-end"
      }}>
      <Typography>
        {startIndex + 1}-{endIndex} of {results}
      </Typography>
      <Pagination {...props} />
    </Stack>
  );
}
