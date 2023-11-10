var p = document.getElementById("testo");
file_get_contents("https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=napoli")
function file_get_contents(filename) {
    fetch(filename,{mode : "no-cors"}).then((resp) => resp.text()).then(function(data) {
        p.innerHTML = data;
    });
}