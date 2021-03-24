import React from 'react';

function PagElement(props) {
	return (
		<span className={`inline-flex justify-center items-center px-4 py-2 w-10 text-sm font-medium hover:bg-gray-900 \
						  ${props.active ? 'text-yellow-400' : 'text-gray-300'}`}>
			{props.children}
		</span>
	);
}

function PagButton(props) {
	return (
		<button onClick={props.onClick} className="focus:outline-none justify-self-stretch">
			<PagElement active={props.active}>{props.children}</PagElement>
		</button>
	);
}

function PagLeft(props) {
	return (
		<button
			disabled={props.disabled}
			onClick={props.onClick}
			className={`relative inline-flex items-center px-2 py-2 focus:outline-none \
						rounded-l-md text-sm font-medium text-gray-500 \
						${props.className}`}>

			<svg className={`h-5 w-5 ${props.disabled ? 'opacity-50' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
			</svg>
		</button>
	)
}

function PagRight(props) {
	return (
		<button
			disabled={props.disabled}
			onClick={props.onClick}
			className={`relative inline-flex items-center px-2 py-2 focus:outline-none \
						rounded-r-md text-sm font-medium text-gray-500 \
						${props.className}`}>

			{/* Heroicon name: chevron-right */}
			<svg className={`h-5 w-5 ${props.disabled ? 'opacity-50' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
			</svg>
		</button>
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
		<div className="flex-1 py-3 sm:flex sm:items-center sm:justify-between">
			{ !!resultCount &&
                <p className="text-sm text-gray-700 dark:text-white">
					Showing
					<span className="mx-1 font-medium">{(currentPage - 1) * limit + 1}</span>
					to
					<span className="mx-1 font-medium">{currentPage * limit <= resultCount ? currentPage * limit : resultCount}</span>
					of
					<span className="mx-1 font-medium">{resultCount}</span>
					results
				</p>
			}
			<nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
				<PagLeft disabled={currentPage === 1} onClick={decrement} />
				{
					pages.map((page, index) => {
						return page
							? <PagButton key={index} active={currentPage === page} onClick={() => navigateTo(page)}>
								{page}
							</PagButton>
							: <PagElement key={index}>...</PagElement>
					})
				}
				<PagRight disabled={currentPage === pageCount} onClick={increment} />
			</nav>
		</div>
	);
}
