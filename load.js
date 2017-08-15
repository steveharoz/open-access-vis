var asdf = require("d3");
var dataCSV, dataNested;
var dayNames = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var trackNames = ["InfoVis", "SciVis", "VAST"];
var OADomains = ["osf.io", "arxiv.org", "biorxiv.org", "psyarxiv.org", "hal.inria.fr", "eprints.whiterose.ac.uk"];
var timeParser = d3.timeParse("%H:%M %p");
var style = "col-md-12 col-lg-10 col-lg-offset-1";
var thumbnails;

d3.csv("openaccessvis.csv", d => d, function(error, data) {
  if (error) throw error;
  dataCSV = data;
  
  // nest the data
  dataNested = d3.nest()
    // day
    .key(d => d.ConferenceDay)
    .sortKeys((a,b) => dayNames.indexOf(a) - dayNames.indexOf(b))
    // session
    .key(d => d.ConferenceTrack + "|" + d.ConferenceSession)
    .entries(dataCSV);
  dataNested = dataNested.map(d => {
      // sort papers within each session
      d.values = d.values.map(s => {
          s.values.sort( (a,b) => timeParser(a.ConferenceTimeStart) - timeParser(b.ConferenceTimeStart));
          s.startTime = s.values[0].ConferenceTimeStart;
          return s;
      });
      // sort sessions
      d.values.sort( (a,b) => timeParser(a.startTime) - timeParser(b.startTime) )
      return d;
  });

  var days = d3.select(".container")
    .selectAll(".day")
    .data(dataNested).enter();
  days = days.append("div")
    .classed("day", true)
    .classed("row", true)
    .attr("id", d => d.key)
    .append("div")
        .classed(style, true);
  
  days.append("h2")
    .text(d => d.key);
  
  var sessions = days.selectAll(".session")
    .data(d => d.values).enter()
    .append("div")
        .attr("class", d => d.values[0].ConferenceTrack.toLowerCase())
        .classed("session", true);
  sessions.append("h3").text(d => d.values[0].ConferenceSession);

  var papers = sessions.selectAll(".paper")
    .data(s => s.values).enter()
    .append("div")
        .attr("class", "paper row");
  
  var left = papers.append("div")
    .classed("col-sm-2 col-xs-2 thumbholder", true);
  thumbnails = left.append("img")
        .classed("thumb", true)
        .attr("src", "images/blank.png")
        .on("error", function () {d3.select(this).attr("src", "images/blank.png"); });
        //.attr("src", getThumbnailPath);
  var mid = papers.append("div")
    .classed("col-sm-9 col-xs-10", true);
  mid.append("p")
        .classed("title", true)
        .text(d => d.Title);
  mid.append("p")
        .classed("authors", true)
        .text(d => d.Authors);
  mid.append("p")
        .classed("time", true)
        .text(d => d.ConferenceTimeStart + " - " + d.ConferenceTimeEnd + " " + d.ConferenceDay);
  var abstract = mid.append("p")
        .classed("abstract", true)
        .text(d => d.Abstract);

  var right = papers.append("div")
    .classed("col-sm-1 col-xs-12", true);
  var links = mid.append("div");
  links.appendLink("PDF", "PDF", d => d.AuthorPDF);
  links.appendLink("sourceMaterial", "Material", d => d.SourceMaterials);
  links.appendLink("data", "Data", d => d.Data);
  links.appendLink("projectPage", "Explanation", d => d.ExplanationPage);

  // load thumbnails
  thumbnails.attr("src", getThumbnailPath);
});

function getThumbnailPath(paper) {
  var path = "thumbnails/";
  var title = dropLeadingArticle(paper.Title);
  // make filename
  path += title.split(/[^\w]/, 1)[0].toLowerCase();
  path += "-";
  path += paper.Authors.split(/[^\w]/, 1)[0].toLowerCase();
  path += ".png";
  return path;
}

function dropLeadingArticle (text) {
  if (text.startsWith("A ")) text = text.substring(2);
  if (text.startsWith("An ")) text = text.substring(3);
  if (text.startsWith("The ")) text = text.substring(4);
  return text;
}

function isOpenAccessDomain(href) {
  for (var i = 0; i < OADomains.length; i++) {
     if (href.includes(OADomains[i])) 
      return true;
  }
  return false;
}

d3.selection.prototype.appendLink = function (css, text, href) {
  var link = this.append("a")
    .classed("link " + css, true)
    .attr("target", "_blank")
    .attr("href", href);
  link.attr("tag", d => isOpenAccessDomain(href(d)) ? "Open Access site with permanent URL" : "")
  link.classed("OADomain", d => isOpenAccessDomain(href(d)));
  link.append("span").text(text);
}