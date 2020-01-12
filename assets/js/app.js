// les imports importants;
import React from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import InvoicesPage from './pages/InvoicesPage';
// Hashrouter est un component qui englobe l ensemble de l appli ! et permet de gerer les routes commençant par #
// Switch permet de choisir un affichage selon l url
// Route fait la correpsondance entre url et un component/affichage

// importer le css personnalisé
require('../css/app.css');

// JS
//console.log('Hello Webpack Encore!');

const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage} />
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
}

//dire a reactdom d afficher le rendu de mon component app dans root element
const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
