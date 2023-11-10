var p = document.getElementById("testo");
const URL = new Request("https://lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=%22napoli%22&limit=100000");
fetch(URL, {
        method: "GET",
        mode: "no-cors"
    }
).then(async response => {
    p.innerHTML = await response.json().then(data => {
        data.text();
    });
}).catch((err) => {
        p.innerHTML = "<h1>errore nel caricamento delle tuple</h1>";
    });