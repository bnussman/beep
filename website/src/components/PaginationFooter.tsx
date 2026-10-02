import { Pagination } from "@heroui/react";
import React from "react";

interface Props {
  count?: number;
  results?: number;
  page?: number;
  pages?: number;
  pageSize: number;
  onChange?: (e: React.ChangeEvent<unknown>, page: number) => void;
}

export function PaginationFooter(props: Props) {
  const page = props.page ?? 1;
  const pages = props.count ?? props.pages ?? 0;

  const startIndex = (page - 1) * props.pageSize;
  const endIndex = Math.min(startIndex + props.pageSize, props.results ?? 0);

  const formatter = new Intl.NumberFormat();

  const results = formatter.format(props.results ?? 0);

  return (
    <Pagination>
      <Pagination.Summary>
        {startIndex} to {endIndex} of {results} results
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page === 1}
            onClick={(e) => props.onChange?.(e, page - 1)}
          >
            <Pagination.PreviousIcon />
            Prev
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <Pagination.Item key={p}>
            <Pagination.Link isActive={p === page} onClick={(e) => props.onChange?.(e, p)}>
              {p}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page === pages}
            onClick={(e) => props.onChange?.(e, page + 1)}
          >
            Next
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
