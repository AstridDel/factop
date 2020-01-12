import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';

/*gestion couleur des status*/
const STATUS_CLASSES = {
    SENT: "info",
    PAID: "success",
    CANCELLED: "danger"
};

/*gestion traduction status*/
const STATUS_LABELS = {
    SENT: "Envoyée",
    PAID: "Payée",
    CANCELLED: "Annulée"
}


const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    /*recuperation des invoices aupres de l'api */
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    // charger les invoices au chargement du component
    useEffect(() => {
        fetchInvoices();
    }, []);


    /* gestion changement de page */
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    /* gestion recherche invoices*/
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    };


    /* gestion suppression des factures */
    const handleDelete = async id => {

        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try {
            await InvoicesAPI.delete(id)
        } catch (error) {
            console.log(error.response)
            setInvoices(originalInvoices);
        }
    };

    /*reformater l'affichage des dates*/
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    /*filtrage des customers en fct de la recherche*/
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.sentAt.toLowerCase().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase())
    );

    /*pagination des donnees */
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        itemsPerPage,
        currentPage
    );


    return (
        <>
            <h1>Liste des Factures</h1>

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
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(
                        invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span
                                        className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                                    >
                                        {STATUS_LABELS[invoice.status]}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {invoice.amount.toLocaleString()} €
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary mr-2">Editer</button>
                                    <button onClick={() => handleDelete(invoice.id)}
                                        disabled={invoice.length > 0} className="btn btn-sm btn-danger">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                handlePageChange={handlePageChange}
            />
        </>
    );
};

export default InvoicesPage;