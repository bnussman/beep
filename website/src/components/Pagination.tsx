import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Flex, Spacer, Text, useMediaQuery } from "@chakra-ui/react";

interface PaginationProps {
  resultCount?: number;
  limit?: number;
  cutoff?: number;
  neighbors?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

interface DirectionButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  isDisabled: boolean;
}

interface PageButtonProps {
  active?: boolean;
  children?: any;
  onClick?: () => void;
  isDisabled?: boolean;
}

function PageButton(props: PageButtonProps) {
  const { onClick, active, children, isDisabled } = props;
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  return (
    <Button onClick={onClick} isDisabled={active || isDisabled} size={!isDesktop ? "sm": undefined}>
      {children}
    </Button>
  );
}

function DirectionButton(props: DirectionButtonProps) {
  const { isDisabled, onClick, direction } = props;
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  return (
    <Button
      isDisabled={isDisabled}
      onClick={onClick}
      size={!isDesktop ? "sm": undefined}
    >
      {direction === 'right' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </Button>
  )
}

export function Pagination({
  resultCount = 0,
  limit = 25,
  cutoff = 3,
  neighbors = 1,
  currentPage,
  setCurrentPage,
}: PaginationProps) {

  const pages = [],
    numButtons = ((cutoff * 2) + 1),
    pageCount = Math.ceil(resultCount / limit);

  function increment() {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  }
  function decrement() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }
  function navigateTo(pageNum: number) {
    setCurrentPage(pageNum);
  }

  // Small page count - show all numbers
  if (pageCount < numButtons) {
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      pages.push(pageNum);
    }
  }
  // Beginning of sequence
  else if (currentPage <= cutoff) {
    for (let pageNum = 1; pageNum <= numButtons - 2; pageNum++) {
      pages.push(pageNum);
    }
    pages.push(null);
    pages.push(pageCount)
  }
  // End of sequence
  else if (currentPage >= (pageCount - cutoff)) {
    pages.push(1)
    pages.push(null);
    for (let pageNum = pageCount - (numButtons - 3); pageNum <= pageCount; pageNum++) {
      pages.push(pageNum);
    }
  }
  // Middle of sequence
  else {
    pages.push(1);
    pages.push(null);
    for (let pageNum = currentPage - neighbors; pageNum <= currentPage + neighbors; pageNum++) {
      pages.push(pageNum);
    }
    pages.push(null);
    pages.push(pageCount);
  }

  return (
    <Flex alignItems="center" mb={2} mt={2} flexWrap="wrap">
      {!!resultCount &&
        <Text noOfLines={1}>
          {`Showing ${(currentPage - 1) * limit + 1} to ${currentPage * limit <= resultCount ? currentPage * limit : resultCount}	of ${resultCount.toLocaleString()} results`}
        </Text>
      }
      <Spacer />
      <ButtonGroup isAttached>
        <DirectionButton direction='left' isDisabled={currentPage === 1} onClick={decrement} />
        {
          pages.map((page, index) =>
            page ? (
              <PageButton
                key={index}
                active={currentPage === page}
                onClick={() => navigateTo(page)}
              >
                {page}
              </PageButton>
            )
              : <PageButton key={index} isDisabled>...</PageButton>
          )
        }
        <DirectionButton direction='right' isDisabled={currentPage === pageCount || resultCount === 0} onClick={increment} />
      </ButtonGroup>
    </Flex>
  );
}
