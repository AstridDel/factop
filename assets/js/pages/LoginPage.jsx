import React, { useState, useContext } from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';


const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    // gestion des champs
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setCredentials({ ...credentials, [name]: value });
    }

    // gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault(); //evite de recharger la page

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Identifiant inconnu");
        }
    };

    return (
        <>
            <h1>Connexion à facTop</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse e-mail"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Votre e-mail"
                    error={error}
                />

                <Field
                    label="Mot de passe"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    type="password"
                    error=""
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Connexion
                            </button>
                </div>
            </form>
        </>);
}

export default LoginPage;