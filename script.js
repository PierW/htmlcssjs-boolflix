$(document).ready(init);

function getTitle() {

  var input = $("input");
  var value = input.val();
  getFilm(value);
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

      outputData(data);
    },
    error : function(richiesta, stato, errori) {

      alert("Problemi di connezzione");
    }
  });
}


function outputData(object) {

  var source = $("#li").html();
  var nresults = $("#nresults");
  var template = Handlebars.compile(source);
  var numberResults = object.total_results;
  var results = object.results;
  var container = $("ul");
      nresults.text("Risultati trovati: " + numberResults);

  var li = $(".container li");
      li.remove();

  for (var i = 0; i < results.length; i++) {
// <span class='flag-icon flag-icon-it' title='italia'></span>
    var result = results[i];
    var titleLangue =  result.original_language;
    var iconLangue = getIcon(titleLangue);

    var data = {
      titolo : result.title,
      titolo_originale : result.original_title,
      lingua : "<span class='flag-icon flag-icon-" + iconLangue +  "' title='" + titleLangue + "'></span>",
      voto : result.vote_average
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
