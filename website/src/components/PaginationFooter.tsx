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
  const totalPages = Math.max(props.count ?? props.pages ?? 1, 1);

  const startIndex = (page - 1) * props.pageSize;
  const endIndex = Math.min(startIndex + props.pageSize, props.results ?? 0);

  const getPageNumbers = () => {
    if (totalPages === 1) {
      return [1];
    }

    const pages: (number | "ellipsis")[] = [];
    pages.push(1);
    if (page > 3) {
      pages.push("ellipsis");
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }
    pages.push(totalPages);
    return pages;
  };

  const formatter = new Intl.NumberFormat();

  const results = formatter.format(props.results ?? 0);

  return (
    <Pagination>
      <Pagination.Summary>
        {endIndex === 0 ? 0 : startIndex + 1} to {endIndex} of {results} results
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page <= 1}
            onClick={(e) => props.onChange?.(e, page - 1)}
          >
            <Pagination.PreviousIcon />
            Prev
          </Pagination.Previous>
        </Pagination.Item>
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onClick={(e) => props.onChange?.(e, p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPages}
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
