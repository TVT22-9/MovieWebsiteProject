# Elokuvanettisivuprojekti

#

## Linkkejä

Esittelyvideo:
[https://www.youtube.com/watch?v=2IbvGqDV\_Tk
](https://www.youtube.com/watch?v=2IbvGqDV_Tk)Sivun julkaisuosoite:
[https://moviewebsiteproject.onrender.com/
](https://moviewebsiteproject.onrender.com/)Työohje:
[https://drive.google.com/file/d/13bae6h6AbIrqZl0sqQs-OPvNZRkVZzwI/view?usp=sharing
](https://drive.google.com/file/d/13bae6h6AbIrqZl0sqQs-OPvNZRkVZzwI/view?usp=sharing)
Yleisesti projektista sen luonteesta

Tämän projektin tarkoituksena on toimia Oulun ammattikorkeakoulun tietotekniikan opiskelijoiden toisen vuoden syksyn harjoitusprojektina. Ryhmän tehtävänä on tehdä elokuva-arvostelusivu annetun työohjeen mukaan. Projektissa hyödynnetään joustavaa kehitysmenetelmää, jossa hyödynnetään kehityssprinttejä ja Kanban-taulua.

 Tavoitteena on kehittää ryhmätyötaitoja, ohjelmointiosaamista sekä suunnittelutaitoja. Projekti on tehty sillä ajatuksella, että lopullinen julkaisu ei vastaa valmista tuotetta vaan on pikimmiten alfa vaiheen julkaisu. Työ on tehty seitsemän viikon aikana, joista ensimmäiset kaksi viikkoa varattaan ryhmän muodostamiseen, opiskeluun ja suunniteluun. Tätä seuraa neljän viikon työjakso, joka on jaettu kahteen kahden viikon sprintiksi, jonka aikana suurin osa sovelluksen ohjelmoinnista tehdään. Viimeinen viikko on varattu viilausta ja julkaisua varten.

## Tekijät ja työnjako

| NIMI | GITHUB- TUNNUS | MITÄ TEKI |
| --- | --- | --- |
| Roope Huhta | Huhroo | Projektipäällikkö, käyttäjä routet, käyttäjä routen testit, kirjautuminen ja rekisteröityminen komponentit, mypage, pikku sekalaiset hommat esim. nav bar. |
| Petri Kilpeläinen | hunterpete2002 | Elokuvien ja sarjojen haku, elokuva- ja sarjakomponentit, elokuva- ja sarja-routet, elokuva- ja sarja-routejen testaus, uutisten haku, uutissivu, alustava REST-rajapinnan suunnitelma |
| Juuso Korpinen | JuusoKorpinen | Arvostelukomponentit, arvostelu-routet,arvostelu-routen testaus, ER-kaavio |
| Janne Pauna | JanTPau | Ryhmäkomponentit, ryhmä- ja members-routet, ryhmä- ja members-routejen testautus, alustava UI-suunnitelma. |

Lisäksi kaikki osallistuvat projektissa CSS:n tekoon keskittyen omiin komponentteihin.

## Sovelluksen esittely

Meidän sovelluksemme on nettisivu, jonka päätarkoituksena on etsiä ja arvioida elokuvia. Sovelluksessa voi kirjautumalla sisään lisätä arvioita elokuviin ja sarjoihin, jotka kaikki nettisivua katsovat henkilöt voivat nähdä. Sivua on helppo navigoida käyttämällä yläosassa olevaa siirtymispalkkia (kuva 1). Olemme myös lisänneet nettisivulle mahdollisuuden tehdä ryhmiä, jossa näkyy kaikkien ryhmän jäsenien arvioinnit. Lisäsimme myös News-sivun, jossa näkyy uutiset Finnkino-sivulta, joita voi lisätä sitten ryhmiin.

![](RackMultipart20231218-1-7leukj_html_99accefcd3a39bb9.png)

_KUVA 1._ _Kotisivu_

## Sovelluksen käyttöönotto

Sovelluksen käyttöönotto edellyttää seuraavia vaiheita:

1. Asenna Node.js (v18.14.0 tai uudempi) tietokoneellesi, jos sitä ei ole vielä asennettuna.
2. Lataa tarvittavat tiedostot GitHub-repositoriosta.
3. Luo PostgreSQL-tietokanta ER-kaavion mukaisesti ja tallenna yhteystiedot env-tiedostoon connection.js:ää varten.
4. Lisää env-tiedostoon JWT\_SECRET-salasana.
5. Saadaksesi TMDB API:n toimimaan lisää env-tiedostoon tarvittavat API-avaimet.
6. Suorita komento **npm i** asentaaksesi sovelluksen riippuvuudet.
7. Käynnistä sovellus komennolla **node app.js**.

Näiden vaiheiden suorittamisen jälkeen sovelluksesi on käyttövalmis.

## Tietokanta

Projektissa käytetään Renderissä hostattua PostgreSQL tietokantaa. Se koostuu neljästä taulusta: webusers, reviews, groups ja members (kuva 2). Webusers-tauluun tallennetaan perusavain iduser, käyttäjänimi, salanasa ja MyPagen asetukset. Reviews-tauluun tallennetaan perusavain idreview, viiteavain iduser, elokuvan tai sarjan ID, arvostelun sisältö, pistemäärä ja arvostelun tekoaika. Groups-taulussa on pääavain idgroup, viiteavain idowner, ryhmän nimi, kuvaus ja asetukset. Webusers- ja groups-taulun välissä on members-taulu, jossa on viiteavaimet idgroup ja iduser. Taulussa on myös status-kenttä, jonka avulla katsotaan onko käyttäjä vielä hyväksytty ryhmään.

![](RackMultipart20231218-1-7leukj_html_739630d7f8edad21.png)

_KUVA 2. Tietokannan rakenne_

## Käytetyt teknologiat

Sovelluksessamme on käytetty useita ohjelmointikieliä. JavaScriptia käytetään niin projektin etupäässä React-komponenteissa kuin palvelinpään API-koodissa, SQL-kieltä tietokantakyselyjen tekemiseen sekä HTML- ja CSS-kieliä web-sivun rakentamiseen, sisällön määrittelyyn sekä ulkoasun muotoiluun.

React JavaScript-kirjastoa käytetään käyttöliittymän rakentamiseen ja hallintaan, Node.js-ympäristöä käytetään palvelinpuolen logiikan toteuttamiseen sekä tietokantana toimii PostgreSQL. API-kutsut mahdollistavat Axios HTTP-kirjasto ja JSON Web Token on käytössä käyttäjän autentikoinnissa.

Projektiin sisältyy myös testikokoelmia, jotka käyttävät Mocha-testikehystä, Chai assert -kirjastoa ja Supertestia HTTP-väittämien testaamiseen.

## ![](RackMultipart20231218-1-7leukj_html_14f434a2ffa162aa.png)MovieList-komponentti

MovieListComponent on komponentti, jota käytämme yhdistämään meidän TMDB-ohjelmointirajapintaan (API). Tämä komponentti hoitaa elokuvien ja sarjojen haun käyttämällä luomaani reittiä palvelimemme kautta (Kuva 3). Tässä komponentissa on myös kaikki haku asetukset, kuten elokuvan nimen, lajityypin ja vuoden perusteella.

Kuva 3. Kuva MovieListComponent koodista.

## UserControl-komponentti

UserControl-komponentti sisältää käyttäjän rekisteröitymisen sekä sisäänkirjautumisen. Rekisteröitymien vaatii käyttäjältä käyttäjänimen sekä salasanan.

Käyttäjä nimen tulee olla uniikki, eikä järjestelmä anna luoda useaa samannimistä käyttäjää. Salasanat tallentuvat tietokantaan vasta bcrypt-hashayksen jälkeen, jolloin vain käyttäjä itse tietää salasanansa. Sivuilla ei ole salasanan muotoiluun vaatimuksia.

Kirjautuessa käyttäjän tulee syöttää oikea käyttäjätunnus ja salasana, ja jos nämä ovat oikein, käyttäjälle annetaan JSON Web Token, jonka sivu nappaa talteen. JWT:tä käytetään sivulla autentikointiin, ja sen olemassaolon taakse on lukittu sivulla useita ominaisuuksia, kuten arvostelun tekeminen ja ryhmäsivujen toiminta. Täällä kirjautunut käyttäjä voi myös kirjautua ulos tai poistaa käyttäjänsä, jolloin kaikki hänen datansa katoaa sivulta.

##
Reviews-komponentti

Reviews-komponentti on komponentti, joka hoitaa arvostelujen tekemisen ja niiden näyttämisen sivulla. Arvostelun voi tehdä painamalla nappia elokuvan tai sarjan omalla sivulla tai suoraan hakusivulta. Nappi avaa ponnahdusikkunan, jossa käyttäjä voi syöttää arvostelunsa tekstikenttään ja valita antamansa pistemäärän yhdestä viiteen. Käyttäjä voi arvostella tietyn elokuvan tai sarjan vain kerran.

Arvostelujen hakemisen niiden renderöinnin hoitaa ReviewsList-komponentti. Se hakee eri arvosteluita riippuen siitä, minkä muuttujan sille syöttää. Tämä muuttuja voi olla elokuvan ID, sarjan ID tai käyttäjänimi. Jos syöttää elokuvan/sarjan ID:n, komponentti hakee kaikki arvostelut elokuvalle tai sarjalle. Kun syötetään käyttäjänimi, se hakee kaikki tietyn käyttäjän tekemät arvostelut. Komponenttiin voi syöttää myös useita käyttäjänimiä kerralla. Jos mitään muuttujaa ei anneta, se hakee kaikki tietokannassa olevat arvostelut.

Jokainen renderöity arvostelu sisältää pistemäärän tähtinä, arvostelun sisällön, käyttäjänimen, arvostelun tekoajan ja elokuvan/sarjan nimen. Nimeä voi painaa päästäkseen elokuvan tai sarjan omalle sivulle. Arvostelut voi lajitella neljällä eri tavalla: uusin, vanhin, pistemäärä ja elokuvan tai sarjan nimi.

## MyPage-komponentti

MyPage on kunkin käyttäjän oma kotisivu, jota voi sisään kirjautuneena muokata. Julkaisu vaiheessa siellä tulee olemaan käyttäjän arvostelut sekä käyttäjän merkkaama lempi elokuva. Käyttäjä voi halutessaan muokata sivunsa asetuksia, ja päättää että haluaako hän näyttää lempielokuvaansa vai eikö ja sen että haluaako hän, että hänen arvostelunsa näkyy siellä vai ei. MyPagen voi jakaa linkillä, ja ne näkyvät kirjautumatta sovellukseen.

Teknisesti MyPage komponentti on yksinkertainen React komponentti, joka pitkälti hyödyntää muita komponentteja kuten arvostelu komponenttia sekä elokuva kortti komponenttia. Komponentissa itsessään on kuitenkin laajoja tilan hallinta osia, jotka varmistavat haluttujen osien renderöinnin.

## Groups-komponentit

Groups-komponentit sisältävät toiminnallisuudet ryhmien luomiseen, poistamiseen sekä hallinnoimiseen. Ryhmätoiminnat on jaettu kahteen React-komponenttiin: GroupFormiin, johon käyttäjät pääset sivun navigointipalkilla, ja GroupProfileComponentiin, johon ryhmälistassa on linkit (kuva 4). Ryhmien sivuille pääsy vaatii kyseiseen ryhmän jäsenlistaan kuuluvan käyttäjän.

GroupForm-sivulla, käyttäjät voivat selata listaa ryhmistä ja niiden kuvauksista, mutta niihin liittymispyynnön lähettäminen sekä oman ryhmän luonti, vaatii sisäänkirjautumisen. Nimikentän ja halutessaan kuvauskentän täyttämisen jälkeen, käyttäjä luo ryhmän napin painalluksella, joka päivittää uuden ryhmän alla olevaan listaan.

Send join request -painiketta painamalla käyttäjä saa nimensä näkyviin ryhmän sivulla olevaan pending members -listaan, josta ryhmän omistaja voi joko hyväksyä käyttäjän ryhmään tai poistaa kutsun.

GroupProfileComponent-sivulla on jäsenten lisäksi näkyvissä Reviews-osio, jossa on lista kaikkien jäsenten tekemistä arvosteluista, sekä News-osio, jonne ryhmän jäsenet voivat lisätä uutisia uutiskomponentista. Ryhmän profiilissa on myös ryhmän poistamiseen käytettävä delete-painike näkyvissä ryhmän omistajalle.

![Kuva ryhmälistasta.](RackMultipart20231218-1-7leukj_html_d6b8f1b774c14ad0.png)

_Kuva 4. Ruutukaappaus ryhmälistasta, jossa kaksi esimerkki ryhmää ryhmään vievän linkin sekä liittymispyyntö lähetyspainikkeen kanssa._
