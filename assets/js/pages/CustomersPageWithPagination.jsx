import React, { useEffect, useState } from 'react';
// hook useEffect met en place un side effect
// hook useState permet de creer un state et une fct de modif du state
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = (props) => {

    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState([1]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    /* recuperation des customers: */
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalItems(response.data['hydra:totalItems']);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    }, [currentPage])

    /* suppression du customer av zero facture: */
    const handleDelete = id => {

        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))

        axios
            .delete("http://localhost:8000/api/customers/" + id)
            .then(response => console.log("suppression ok"))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response)
            });
    }

    /* changement de page */
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    };

    const paginatedCustomers = Pagination.getData(
        customers,
        itemsPerPage,
        currentPage
    );

    return (
        <>
            <h1>Liste des clients (Pagination)</h1>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td>Chargement en cours ...</td>
                        </tr>
                    )}
                    {!loading && customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-pill badge-dark">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0} className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={totalItems}
                handlePageChange={handlePageChange}
            />
        </>
    );
};

export default CustomersPageWithPagination;