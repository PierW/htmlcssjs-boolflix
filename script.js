$(document).ready(init);

//INIZIO FUNZIONE CHE INDIRIZZA L'INPUT DELL'UTENTE ALLE FUNZIONI GIUSTE
function getTitle() {

  firstEffect(); //AGGIUNGO EFFETTI ALLA PRIMA RICERCA
  var input = $("input");
  var type = $("select");
  var counter = $("#nresults");
  var li = $(".container li");
      li.remove();        //CANCELLO TUTTI GLI LI DELLE RICERCHE PASSATE A PRESCINDERE
      counter.text("");   //RESETTO CONTATORE
      counter.html("Risultati trovati: <span id='counter'>0</span>"); //INIZIO CONTATOTORE A 0 PRIMA DELLE CHIAMATE AJAX COSì NON SI RESETTA AD OGNI LANCIO DI FUNZIONE

  var typeVal = type.val(); //PRENDO CATEGORIA
  var value = input.val(); //PRENDO VALORE INPUT


  if (typeVal === "film") {
    getFilm(value);
  }
  else if (typeVal === "serie"){
    getSerie(value);
  } else {
    getFilm(value);
    getSerie(value);
  }

  input.val(""); //RESETTO SOLO ALLA FINE IL VALORE NELL'INPUT
}

//INIZIO FUNZIONE PER TRIGGERARE IL PULSANTE PREMUTO
function pressEnter(e) {

  var me = $(this);
  if (e.which == 13) {

    getTitle();
  }
}

// INIZIO FUNZIONE PER OTTENERE I FILM
function getFilm(string) {

  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    data : {
      api_key : "5a8d10395cbc81449d13da7027ca58cc",
      language : "it-IT",
      query : string
    },
    method : "GET",
    success : function(data, stato) {

      var type = "film";   //IMPORTANTE: QUI RICREO IO LA STRINGA "FILM" PER EVITARE CHE PASSI IL VALORE "TUTTI" DEL SELECT DIFFICILMENTE GESTIBILE NEL CASO DELLA STAMPA DI ENTRAMBE LE CATEGORIE.
      outputData(data, type); //MI PASSO I DATI E LA CATEGORIA NELLA MIA FUNZIONE DI STAMPA
    },
    error : function(richiesta, stato, errori) {

      alert("Problemi di connessione");
    }
  });
}

// INIZIO FUNZIONE PER SERIE TV
function getSerie(string) {

  $.ajax({
    url: "https://api.themoviedb.org/3/search/tv",
    data : {
      api_key : "5a8d10395cbc81449d13da7027ca58cc",
      language : "it-IT",
      query : string
    },
    method : "GET",
    success : function(data, stato) {

      var type = "serie"; //UGUALE COME IN GETFILM
      outputData(data, type);
    },
    error : function(richiesta, stato, errori) {

      alert("Problemi di connessione");
    }
  });
}

// INIZIO FUNZIONE PER ARROTONDARE PER ECCESSO IL VOTO E DIVIDERLO PER 2
function transformNumber(number) {

    return Math.ceil(number/2);//I NUMERI VANNO DA 0 A 5
}

// INIZIO FUNZIONE DI STAMA DELLE STELLE
function fillStars(number) {

  var voteIndexDOM = transformNumber(number);

  var empty = "far";
  var full = "fas";
  var stars = $(".container li .check");

  if (voteIndexDOM !== 0) { //SE è 0 LO BUTTO (COSì HO VALORI DA 1 A 5)
    voteIndexDOM -= 1; // COSì HO VALORI DA 0 A 4 CHE CORRISPONDONO AGLI INDICI DELLE 5 STELLE
    for (var i = 0; i <= voteIndexDOM; i++) {

      stars.eq(i).removeClass(empty);
      stars.eq(i).addClass(full);
    }
  }
  stars.removeClass("check") //CLASSE DI CONTROLLO - MI GARANTISCO CHE AD OGNI GIRO HO SOLO IL TEMPLATE CHE STO PER SCRIVERE
}

//INIZIO FUNZIONE PER SOSTITUIRE LA STRINGA IN INPUT CON QUELLA CORRETTA PER LE FLAGS
function getIcon(string) {

var res = "";

  switch (string) {

    case "en":
      res = "gb";
      break;
    case "it":
      res = "it";
      break;
    default:
      res = "unknown";
  }
  return res;
}

// INIZIO MAXI FUNZIONE PER MANDARE IN OUTPUT TUTTO
function outputData(object, type) {

  var source = $("#li").html();
  var template = Handlebars.compile(source);

  var numberResults = object.total_results;
  var results = object.results;

  var container = $("ul");
  var countElement = $("#counter");
  var counter = Number(countElement.text());
      countElement.text(counter + numberResults);

  for (var i = 0; i < results.length; i++) {

    var result = results[i];
    var titleLangue =  result.original_language;
    var iconLangue = getIcon(titleLangue);

      if (result.poster_path == null) {
        var poster = "https://zadroweb.com/wp-content/uploads/2013/07/page-not-found-300x270.jpg"
      } else {
        var poster = "https://image.tmdb.org/t/p/w185" + result.poster_path;
      }

      if (type === "film") {

        var data = {
          titolo : result.title,
          titolo_originale : result.original_title,
          lingua : "<span class='flag-icon flag-icon-" + iconLangue +  "' title='" + titleLangue + "'></span>",
          voto : result.vote_average,
          urlimg : poster
        };
      } else if (type === "serie") {

        var data = {
          titolo : result.name,
          titolo_originale : result.original_name,
          lingua : "<span class='flag-icon flag-icon-" + iconLangue +  "' title='" + titleLangue + "'></span>",
          voto : result.vote_average,
          urlimg : poster
        };
      }

    var fullHtml = template(data);
    container.append(fullHtml);

    fillStars(data.voto); //UNA VOLTA CARICATO NEL DOM LANCIO FILLSTARS CHE CAMBIA
  }                       //LE CLASSI (STELLA PIENA STELLA VUOTA) GRAZIE ALLA CLASSE DI CONTROLLO .CHECK
}


function firstEffect() {

  var bool = $("#title").hasClass("start");
  if (bool) {
      $("#title").removeClass("start");
      $(".container-home").removeClass("start");
      $(".ajaxcontainer").fadeIn(2000);
  }
}

function init() {

// AL CLICK SUL BOTTONE LANCIO GETTITLE
 var button = $("button");
 button.click(getTitle);

// TRIGGERO PULSANTI PREMUTI SU TASTIERA E LI PASSO A PRESSENTER, SE UGUALE A 13(ENTER) LANCIO GETTITLE
 var input = $("input");
 input.keyup(pressEnter);
}
