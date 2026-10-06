import { Pagination } from "@heroui/react";
import React from "react";
import { DEFAULT_PAGE_SIZE } from "../../../api/src/utilities/constants";

interface Props {
  page: number | undefined;
  pages: number | undefined;
  results: number | undefined;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function PaginationFooter(props: Props) {
  const {
    pageSize = DEFAULT_PAGE_SIZE,
    page = 1,
    pages = 1,
    results = 0
  }  = props;

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, results);

  const getPageNumbers = () => {
    if (pages === 1) {
      return [1];
    }
    const pageItems: (number | "ellipsis")[] = [];
    pageItems.push(1);
    if (page > 3) {
      pageItems.push("ellipsis");
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pageItems.push(i);
    }
    if (page < pages - 2) {
      pageItems.push("ellipsis");
    }
    pageItems.push(pages);
    return pageItems;
  };

  const formatter = new Intl.NumberFormat();

  const formattedResults = formatter.format(results);

  return (
    <Pagination>
      <Pagination.Summary>
        {endIndex === 0 ? 0 : startIndex + 1} to {endIndex} of {formattedResults} results
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={props.results === undefined || page <= 1}
            onClick={() => props.onPageChange?.(page - 1)}
          >
            <Pagination.PreviousIcon />
          </Pagination.Previous>
        </Pagination.Item>
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onClick={(e) => props.onPageChange?.(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={props.results === undefined || page >= pages}
            onClick={(e) => props.onPageChange?.(page + 1)}
          >
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
