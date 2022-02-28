import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, Spacer, Text, useMediaQuery } from "@chakra-ui/react";

interface PaginationProps {
  resultCount?: number;
  limit?: number;
  cutoff?: number;
  neighbors?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onPageChange: (page: number) => void;
}

interface DirectionButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
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
    <Button onClick={onClick} _hover={isDisabled ? { cursor: 'default' } : undefined} size={!isDesktop ? "sm": undefined}>
      <Text color={active ? "yellow.400" : undefined}>
        {children}
      </Text>
    </Button>
  );
}

function DirectionButton(props: DirectionButtonProps) {
  const { disabled, onClick, direction } = props;
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      size={!isDesktop ? "sm": undefined}
    >
      {direction === 'right' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </Button>
  )
}

export default function Pagination({
  resultCount = 0,
  limit = 25,
  cutoff = 3,
  neighbors = 1,
  currentPage,
  setCurrentPage,
  onPageChange
}: PaginationProps) {

  const pages = [],
    numButtons = ((cutoff * 2) + 1),
    pageCount = Math.ceil(resultCount / limit);

  function increment() {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage * limit);
    }
  }
  function decrement() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      onPageChange(((currentPage - 1) * limit) - limit);
    }
  }
  function navigateTo(pageNum: number) {
    onPageChange((pageNum - 1) * limit);
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
    <Box mb={3} mt={3}>
      <Flex align="center">
        {!!resultCount &&
          <Text isTruncated>
            {`Showing ${(currentPage - 1) * limit + 1} to ${currentPage * limit <= resultCount ? currentPage * limit : resultCount}	of ${resultCount} results`}
          </Text>
        }
        <Spacer />
        <Box>
          <ButtonGroup isAttached>
            <DirectionButton direction='left' disabled={currentPage === 1} onClick={decrement} />
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
            <DirectionButton direction='right' disabled={currentPage === pageCount || resultCount === 0} onClick={increment} />
          </ButtonGroup>
        </Box>
      </Flex>
    </Box>
  );
}
