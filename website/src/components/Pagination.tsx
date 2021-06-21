import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {Box, Button, ButtonGroup, Flex, Spacer, Text} from "@chakra-ui/react";
import React from "react";

function PagElement(props) {
	return (
        <Text color={props.active ? "yellow.400" : undefined}>
			{props.children}
		</Text>
	);
}

function PagButton(props) {
	return (
		<Button onClick={props.onClick}>
			<PagElement active={props.active}>{props.children}</PagElement>
		</Button>
	);
}

function PagLeft(props) {
	return (
		<Button
			disabled={props.disabled}
			onClick={props.onClick}
        >
            <ChevronLeftIcon/>
		</Button>
	)
}

function PagRight(props) {
	return (
		<Button
			disabled={props.disabled}
			onClick={props.onClick}
        >
            <ChevronRightIcon/>
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
}) {

	const pages = [],
		  numButtons = ((cutoff * 2) + 1),
		  pageCount = Math.ceil(resultCount / limit);


	function increment() {
		if (currentPage < pageCount) {
			setCurrentPage(currentPage + 1);
			//onPageChange(currentPage + 1);
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
    <Box m={2}>
      <Flex align="center">
        {!!resultCount &&
          <Text isTruncated>
            {`Showing ${(currentPage - 1) * limit + 1} to ${currentPage * limit <= resultCount ? currentPage * limit : resultCount}	of ${resultCount} results`}
          </Text>
        }
        <Spacer />
        <Box>
          <ButtonGroup isAttached>
            <PagLeft disabled={currentPage === 1} onClick={decrement} />
            {
              pages.map((page, index) => {
                return page
                  ? <PagButton key={index} active={currentPage === page} onClick={() => navigateTo(page)}>
                    {page}
                  </PagButton>
                  : <PagButton key={index}>...</PagButton>
              })
            }
            <PagRight disabled={currentPage === pageCount || resultCount === 0} onClick={increment} />
          </ButtonGroup>
        </Box>
      </Flex>
    </Box>
  );
}
