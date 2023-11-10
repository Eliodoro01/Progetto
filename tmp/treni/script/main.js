builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:19008")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
var app = builder.Build();
app.UseCors();
var p = document.getElementById("testo");
fetch('https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=napoli', { mode: 'no-cors'})
    .then(data => {
        console.table(data);
        return data;
    })
    .catch(e => {
        console.log(e);
        return e;
    });