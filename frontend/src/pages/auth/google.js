import AuthService from "meutcc/services/AuthService";
import React from "react";

const AuthGooglePage = () => {
    React.useEffect(() => {

        const fetchGoogleCallback = async () => {
            const urlParams = window.location.search;
            const data = await AuthService.googleCallback(urlParams);
            localStorage.setItem('token', data.token);
            window.location.pathname = ('/submeter-proposta');
        };

        fetchGoogleCallback();
    }, []);

    return (
        <div>
        <h1>Google Auth Page</h1>
        </div>
    );
}

export default AuthGooglePage;