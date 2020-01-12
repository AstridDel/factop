import React from 'react';

//<Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length} handlePageChange={handlePageChange} />
const Pagination = ({ currentPage, itemsPerPage, length, handlePageChange }) => {

    /*math.ceil permet d arrondir à un entier superieur le nbre de client sur la page*/
    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return (
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        &laquo;
                        </button>
                </li>

                {pages.map(page => (
                    <li key={page} className={"page-item" + (currentPage === page && " active")}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        &raquo;
                        </button>
                </li>
            </ul>
        </div>);
};

Pagination.getData = (items, itemsPerPage, currentPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
}

export default Pagination;