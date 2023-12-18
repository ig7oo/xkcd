// Ladda den senaste seriestrippen när fönstret är helt laddat
window.onload = function () {
    getComic('latest');
}

// Funktion för att hämta och visa XKCD-seriestrippar
function getComic(which) {
    fetch('https://xkcd.vercel.app/?comic=' + which)
        .then(function (response) {
            // Kontrollera om begäran var framgångsrik (statuskod 200)
            if (response.status == 200) {
                return response.json();
            } else {
                console.error('Felaktig statuskod:', response.status);
                return null;
            }
        })
        .then(function (data) {
            // Kontrollera om data är tillgänglig
            if (data !== null) {
                // Använd data för att skapa och visa seriestripen
                appendComic(data);
            } else {
                console.error('Data är odefinierad.');
            }
        })
        .catch(function (error) {
            console.error('Något gick fel:', error);
        });
}

// Funktion för att lägga till seriestripen till DOM
function appendComic(data) {
    let mainComic = document.getElementById('mainComic');
    mainComic.innerHTML = '';

    // Skapa och lägg till titel
    let title = document.createElement('h1');
    title.innerHTML = data.title || "Ingen titel tillgänglig"; 
    // Använd titeln om tillgänglig, annars en standardtext

    // Skapa och lägg till datum
    let date = document.createElement('p');
    let comicDate = new Date(data.year, data.month - 1, data.day);
    date.innerHTML = 'Datum: ' + comicDate.toLocaleDateString();

    // Skapa och lägg till figure-elementet med bild + bildtext
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    img.src = data.img;
    img.alt = data.alt;

    let caption = document.createElement('figcaption');
    caption.innerHTML = 'Nummer: ' + data.num;

    figure.appendChild(img);
    figure.appendChild(caption);

    mainComic.appendChild(title);
    mainComic.appendChild(date);
    mainComic.appendChild(figure);
}

// Funktion för att navigera mellan olika seriestrippar
function navigate(direction) {
    let currentComicNumElement = document.getElementById('mainComic').querySelector('figcaption');

    if (currentComicNumElement) {
        let currentComicNum = parseInt(currentComicNumElement.innerText.split(': ')[1]);

        switch (direction) {
            case 'first':
                // Kontrollera att det inte är den första seriestrippen innan du hämtar den första
                if (currentComicNum > 1) {
                    getComic('1');
                }
                break;
            case 'prev':
                // Kontrollera att det inte är den första seriestrippen innan du hämtar den föregående
                if (currentComicNum > 1) {
                    getComic(currentComicNum - 1);
                }
                break;
            case 'random':
                // Hämta den senaste seriestrippen och slumpa ett nummer inom intervallet
                fetch('https://xkcd.vercel.app/?comic=latest')
                    .then(function (response) {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            console.error('Felaktig statuskod vid hämtning av senaste serien:', response.status);
                            return null;
                        }
                    })
                    .then(function (latestData) {
                        if (latestData !== null) {
                            let randomComicNum = Math.floor(Math.random() * latestData.num) + 1;
                            getComic(randomComicNum);
                        } else {
                            console.error('Data för senaste serien är odefinierad. Kan inte slumpa serien.');
                        }
                    })
                    .catch(function (error) {
                        console.error('Något gick fel vid hämtning av senaste serien:', error);
                    });
                break;
            case 'next':
                // Kontrollera att det inte är den sista seriestrippen innan du hämtar nästa
                if (currentComicNum < latestComicNum) {
                    getComic(currentComicNum + 1);
                }
                break;
            case 'latest':
                // Kontrollera att det inte är den sista seriestrippen innan du hämtar senaste
                if (currentComicNum < latestComicNum) {
                    getComic('latest');
                }
                break;
            default:
                console.error('Ogiltig navigeringsriktning');
        }
    }
}

// Hämta det senaste serienumret en gång när sidan laddas
let latestComicNum;

fetch('https://xkcd.vercel.app/?comic=latest')
    .then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            console.error('Felaktig statuskod vid hämtning av senaste serien:', response.status);
            return null;
        }
    })
    .then(function (latestData) {
        if (latestData !== null) {
            latestComicNum = latestData.num;
        } else {
            console.error('Data för senaste serien är odefinierad.');
        }
    })
    .catch(function (error) {
        console.error('Något gick fel vid hämtning av senaste serien:', error);
    });