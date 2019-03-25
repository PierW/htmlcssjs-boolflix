$(document).ready(init);

function getTitle() {

  var input = $("input");
  var value = input.val();
  getFilm(value);
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

  for (var i = 0; i < results.length; i++) {

    var result = results[i];
    var data = {
      titolo : result.title,
      titolo_originale : result.original_title,
      lingua : result.original_language,
      voto : result.vote_average
    }
    var fullHtml = template(data);
    container.append(fullHtml);
  }
}

function init() {

 var button = $("button");
 button.click(getTitle);

}
