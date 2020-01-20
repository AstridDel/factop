import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({ history, match }) => {

    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })

    const [customers, setCustomers] = useState([])
    const [editing, setEditing] = useState(false)
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })

    // Recuperation des donnees des customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data)

            if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id })
        } catch (error) {
            history.replace("/invoices")
        }
    }

    // recuperation d une facture
    const fetchInvoice = async id => {
        try {
            const { amount, status, customer } = await InvoicesAPI.find(id)
            setInvoice({ amount, status, customer: customer.id })
        } catch (error) {
            history.replace("/invoices")
        }
    }

    // recuperation de la liste des clients a chq chargement du component
    useEffect(() => {
        fetchCustomers()
    }, [])

    // Recuperation de la bonne facture lsq l'identifiant de l'url change
    useEffect(() => {
        if (id !== "new") {
            setEditing(true)
            fetchInvoice(id)
        }
    }, [id])


    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await InvoicesAPI.update(id, invoice)
            } else {
                await InvoicesAPI.create(invoice)
                history.replace("/invoices")
            }
        } catch ({ response }) {
            if (response.data.violations) {
                const { violations } = response.data;

                if (violations) {
                    const apiErrors = {};
                    violations.forEach(({ propertyPath, message }) => {
                        apiErrors[propertyPath] = message
                    })
                    setErrors(apiErrors)
                }
            }
        }
    }

    return (
        <>
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}
                    </option>
                    )}
                </Select>

                <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
                    <option value="SENT">ENVOYEE</option>
                    <option value="PAID">PAYEE</option>
                    <option value="CANCELLED">ANNULEE</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                        </button>
                    <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
                </div>
            </form>
        </>
    );
}

export default InvoicePage;