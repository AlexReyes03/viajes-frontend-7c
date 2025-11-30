import React from 'react';
import { Dropdown } from 'primereact/dropdown';

// Pagination component with page size selector
export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 15, 20, 50],
}) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const paginationStyle = {
    cursor: 'pointer',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  };

  const activeStyle = {
    ...paginationStyle,
    fontWeight: '700',
    color: 'var(--color-blue-tint-1)',
  };

  const inactiveStyle = {
    ...paginationStyle,
    color: '#6c757d',
  };

  return (
    <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
      {/* First page button */}
      <span
        style={inactiveStyle}
        onClick={() => handlePageClick(1)}
        className="hoverable"
      >
        «
      </span>

      {/* Previous page button */}
      <span
        style={inactiveStyle}
        onClick={() => handlePageClick(currentPage - 1)}
        className="hoverable"
      >
        ‹
      </span>

      {/* Page numbers */}
      <div className="d-flex align-items-center gap-1">
        {getPageNumbers().map((page) => (
          <span
            key={page}
            style={page === currentPage ? activeStyle : inactiveStyle}
            onClick={() => handlePageClick(page)}
            className="hoverable"
          >
            {page}
          </span>
        ))}
      </div>

      {/* Next page button */}
      <span
        style={inactiveStyle}
        onClick={() => handlePageClick(currentPage + 1)}
        className="hoverable"
      >
        ›
      </span>

      {/* Last page button */}
      <span
        style={inactiveStyle}
        onClick={() => handlePageClick(totalPages)}
        className="hoverable"
      >
        »
      </span>

      {/* Page size selector */}
      <Dropdown
        value={pageSize}
        options={pageSizeOptions.map((size) => ({ label: size.toString(), value: size }))}
        onChange={(e) => onPageSizeChange(e.value)}
        className="ms-3"
        style={{ minWidth: '80px' }}
      />
    </div>
  );
}

