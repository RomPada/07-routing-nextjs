import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationEvent {
  selected: number;
}

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (event: PaginationEvent) => void;
}

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={onPageChange}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
};

export default Pagination;
