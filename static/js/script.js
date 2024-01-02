function addBootstrapLink() {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    link.integrity = 'sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65';
    head.appendChild(link);
};
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("La geolocalizzazione non è supportata dal tuo browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Aggiorna i valori nascosti nel form con le coordinate
    document.getElementById("userLatitude").value = latitude;
    document.getElementById("userLongitude").value = longitude;
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Recupera i valori di email e password dal form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simulazione di un processo di autenticazione (da sostituire con la tua logica di autenticazione)
        if (validateLogin(email, password)) {
            alert('Login riuscito!'); // Modifica questo messaggio con l'azione desiderata
        } else {
            alert('Credenziali non valide. Riprova.'); // Modifica questo messaggio con l'azione desiderata
        }
    });

    function validateLogin(email, password) {
        // Simula una logica di autenticazione (puoi implementare la tua logica qui)
        // Restituisci true se le credenziali sono valide, altrimenti restituisci false
        return email === 'utente@example.com' && password === 'passwordsegreta';
    }
});
const URL_AMBIENTE_DI_PRODUZIONE = "https://int-ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet\n";

function reidirect() {

}


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw').then(function (registration) {

            // Service worker registered correctly.
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        },
            function (err) {

                // Troubles in registering the service worker. :(
                console.log('ServiceWorker registration failed: ', err);
            });
    }
}
