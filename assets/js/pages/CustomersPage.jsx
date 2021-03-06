import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';


const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState([1]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    /* recuperation des customers: */
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data)
            setLoading(false)
        } catch (error) {
            toast.error("Erreur lors du chargement des clients")
        };
    }

    /*au chargement du component, recup des customers*/
    useEffect(() => {
        fetchCustomers()
    }, []);


    /* gestion suppression du customer av zero facture: */
    const handleDelete = async id => {

        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))

        try {
            await CustomersAPI.delete(id)
            toast.success("Le client a bien été supprimé")
        } catch (error) {
            setCustomers(originalCustomers);
            toast.error("Erreur lors de la suppression du client")
        }
    };


    /* gestion changement de page */
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    /* gestion recherche de client*/
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    /*filtrage des customers en fct de la recherche*/
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    /*pagination des donnees */
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        itemsPerPage,
        currentPage
    );


    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary" replace>Créer un nouveau client</Link>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    onChange={handleSearch}
                    value={search}
                    className="form-control"
                    placeholder="Rechercher.."
                />
            </div>

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

                {!loading && (
                    <tbody>{/* transformer chq customer en tr */}
                        {paginatedCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <Link to={"/customers/" + customer.id}>
                                        {customer.firstName} {customer.lastName}
                                    </Link>
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
                )}
            </table>

            {loading && (<TableLoader />)}

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                handlePageChange={handlePageChange}
            />
        </>
    );
};

export default CustomersPage;