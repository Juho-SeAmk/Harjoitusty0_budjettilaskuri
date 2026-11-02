Ohjelman käynnistys:
Terminaali 1: npm start
Terminaali 2: npm run frontend

Sovellus on Reactilla toteutettu budjetointisovellus, jonka avulla käyttäjä voi seurata omia menojaan. Sovelluksen käyttöliittymä on toteutettu tiedostossa app.jsx ja ulkoasu App.css.
Toiminnot:
- Uusien menojen lisäys
- Kategorian lisäys
- Suodatus mitä menoaja haluaa nähdä
- Käyttäjä voi antaa menojen lisäämisen päivämäärän
- Onnistumis ja epäonnistumis ilmoitukset
- Poistaa olemassa olevia menoja
- Tarkastella yhteissummaa

Tiedojen tallennus:
React-käyttöliittymä keskustelee Express-palvelimen kanssa HTTP-pyyntöjen avulla. Backend on tiedostossa index.js. Menot tallennetaan JSON tiedostoon, jotta ne säilyvät.
