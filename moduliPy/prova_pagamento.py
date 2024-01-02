import requests


def chiamata_url(url, dati=None, metodo='POST', intestazioni=None):
    """
    Esegue una richiesta HTTP all'URL specificato.

    Parametri:
    - url: URL di destinazione
    - dati: Dati da inviare con la richiesta (opzionale, utilizzato per POST)
    - metodo: Metodo HTTP da utilizzare ('GET' o 'POST', predefinito: 'GET')
    - intestazioni: Intestazioni HTTP personalizzate (opzionale)

    Restituisce:
    - Risposta dell'URL
    """
    try:
        if metodo.upper() == 'GET':
            response = requests.get(url, params=dati, headers=intestazioni)
        elif metodo.upper() == 'POST':
            response = requests.post(url, data=dati, headers=intestazioni)
        else:
            raise ValueError("Metodo non supportato. Utilizzare 'GET' o 'POST'.")

        response.raise_for_status()  # Solleva un'eccezione per errori HTTP

        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Errore nella richiesta: {e}")
        return None


# Esempio di utilizzo:
url_da_chiamare = "http://localhost:5000/esito"
risposta = chiamata_url(url_da_chiamare, metodo='POST')
print(risposta)
