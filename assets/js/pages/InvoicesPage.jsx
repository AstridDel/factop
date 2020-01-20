import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

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
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    /*recuperation des invoices aupres de l'api */
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des factures")
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
            toast.success("La facture a bien été supprimée")
        } catch (error) {
            toast.error("Une erreur est survenue")
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
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des Factures</h1>
                <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
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
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                {!loading && (
                    <tbody>
                        {paginatedInvoices.map(
                            invoice => (
                                <tr key={invoice.id}>
                                    <td>{invoice.chrono}</td>
                                    <td>
                                        <Link to={"/customers/" + invoice.customer.id}>
                                            {invoice.customer.firstName} {invoice.customer.lastName}
                                        </Link>
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
                                        <Link
                                            to={"/invoices/" + invoice.id}
                                            className="btn btn-sm btn-primary mr-2"
                                        >
                                            Editer
                                        </Link>
                                        <button onClick={() => handleDelete(invoice.id)}
                                            disabled={invoice.length > 0} className="btn btn-sm btn-danger">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                )}
            </table>

            {loading && (<TableLoader />)}

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