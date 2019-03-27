$(document).ready(init);


function getTitle() {

  var input = $("input");
  var type = $("select");
  var counter = $("#nresults");
  var li = $(".container li");
      li.remove();
      counter.text("");
      counter.html("Risultati trovati: <span id='counter'>0</span>");

  var typeVal = type.val();
  var value = input.val();


  if (typeVal === "film") {
    getFilm(value);
  }
  else if (typeVal === "serie"){
    getSerie(value);
  } else {
    getFilm(value);
    getSerie(value);
  }

  input.val("");
}

function pressEnter(e) {

  var me = $(this);
  if (e.which == 13) {

    getTitle();
  }
}

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

      var type = "film";
      outputData(data, type);
    },
    error : function(richiesta, stato, errori) {

      alert("Problemi di connessione");
    }
  });
}

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

      var type = "serie";
      outputData(data, type);
    },
    error : function(richiesta, stato, errori) {

      alert("Problemi di connessione");
    }
  });
}

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

    if (type === "film") {

      var data = {
        titolo : result.title,
        titolo_originale : result.original_title,
        lingua : "<span class='flag-icon flag-icon-" + iconLangue +  "' title='" + titleLangue + "'></span>",
        voto : result.vote_average,
        urlimg : result.poster_path
      };
    } else if (type === "serie") {

      var data = {
        titolo : result.name,
        titolo_originale : result.original_name,
        lingua : "<span class='flag-icon flag-icon-" + iconLangue +  "' title='" + titleLangue + "'></span>",
        voto : result.vote_average,
        urlimg : result.poster_path
      };
    }

    var fullHtml = template(data);
    container.append(fullHtml);
    fillStars(data.voto);
    console.log(transformNumber(data.voto))
  }
}

function transformNumber(number) {

    return Math.ceil(number/2);//I NUMERI VANNO DA 0 A 5
}

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




function init() {

 var button = $("button");
 button.click(getTitle);

 var input = $("input");
 input.keyup(pressEnter);
}
