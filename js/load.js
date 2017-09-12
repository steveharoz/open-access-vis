var asdf = require("d3"); // dummy call for vscode
var dataCSV, dataNested; // keep data global
var thumbnails, abstracts; // set the big things last
var dayNames = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var dayAbrevs = {"Saturday morning": "Sa AM", "Saturday afternoon": "Sa PM", 
                 "Sunday morning": "Su AM", "Sunday afternoon": "Su PM", 
                 "Monday morning": "M AM", "Monday afternoon": "M PM", 
                 "Tuesday morning": "Tu AM", "Tuesday afternoon": "Tu PM", 
                 "Wednesday morning": "W AM", "Wednesday afternoon": "W PM", 
                 "Thursday morning": "Th AM", "Thursday afternoon": "Th PM", 
                 "Friday morning": "F AM", "Friday afternoon": "F PM"};
var OADomains = ["osf.io", "arxiv.org", "biorxiv.org", "psyarxiv.org", "/hal.", "/eprints.", "/openaccess."];
var linkImages = {"PDF": "file-text", "Materials": "materials", "Data": "data", "Explanation": "info"};
var timeParser = d3.timeParse("%I:%M %p");
var style = "col-md-12 col-lg-10 col-lg-offset-1";
var untouched = true;


// load and parse the data
d3.csv(dataSource, d => d, function(error, data) {
  if (error) throw error;
  dataCSV = data;
  
  // make some extra properties
  dataCSV = dataCSV.map(d => { 
    d.PM = timeParser(d.ConferenceTimeStart).getHours() > 12; 
    d.closedAccess = d.AuthorPDF == ""; 
    d.simpleName = getSimpleName(d);
    return d; 
  });

  // nest the data
  dataNested = d3.nest()
    // day
    .key(d => (dayNames.indexOf(d.ConferenceDay) + (+d.PM * 0.5)) + "|" + d.ConferenceDay + " " + (d.PM ? "afternoon" : "morning"))
    .sortKeys((a,b) => a.split("|")[0] - b.split("|")[0])
    // session
    .key(d => d.ConferenceTrack + "|" + d.ConferenceSession)
    .sortKeys((a,b) => a.localeCompare(b))
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

  buildPage();
});

// use the data to construct the page elements
function buildPage() {
  ///// Day /////
  var days = d3.select(".container")
    .selectAll(".day")
    .data(dataNested).enter();
  days = days.append("div")
    .classed("day", true)
    .classed("row", true)
    .attr("id", d => d.key.split("|")[1].replace(" ", "_"))
    .append("div")
        .classed(style, true);
  
  days.append("h2")
    .text(d => d.key.split("|")[1]);

  makeDayButtons();
  
  ///// session /////
  var sessions = days.selectAll(".session")
    .data(d => d.values).enter()
    .append("div")
        .attr("class", d => d.values[0].ConferenceTrack.toLowerCase())
        .classed("session", true);
  sessions.append("h3").text(d => d.values[0].ConferenceSession);

  ///// paper /////
  var papers = sessions.selectAll(".paper")
    .data(s => s.values).enter()
    .append("div")
        .attr("id", d => d.simpleName)
        .attr("class", "paper row")
        .classed("fullOpenAccess", d => isOpenAccessDomain(d.AuthorPDF))
        .classed("closedAccess", d => d.closedAccess);
  
  ///// thumbnail /////
  var left = papers.append("div")
    .classed("col-sm-3 col-sm-2 hidden-xs thumbExpander", true);
  left.append("img")
    .classed("spacer", true)
    .attr("src", "images/blank.png");

  ///// expander button  /////
  var expander = left.append("div").classed("thumbExpanderContainer", true);
  thumbnails = expander.append("div").classed("thumbContainer", true).append("img")
    .classed("thumb", true)
    .on("error", (d,i,nodes) => d3.select(nodes[i]).attr("src", "images/no_thumbnail.png" ))
    .attr("src", "images/Closed_Access_Research.svg");
  expander.append("img").classed("expander", true).attr("src", "images/chevron-circle-down.svg");
  left.on("click", (d,i) => expandEventHandler(left, d));

  ///// basic info /////
  var mid = papers.append("div")
    .classed("col-sm-8 col-xs-12", true);
  mid.append("h4")
        .classed("title", true)
        .text(d => d.Title);
  mid.append("p")
        .classed("authors", true)
        .text(d => d.Authors);
  mid.append("p")
        .classed("time", true)
        .text(d => formatTimeRange(d.ConferenceTimeStart, d.ConferenceTimeEnd) + "  " + d.ConferenceDay + "  " + d.ConferenceRoom);
  mid.append("p")
        .classed("closedAccessMessage", true)
        .html("This paper does not appear to be available. Please encourage the authors to post their work.");

  ///// links /////
  var right = papers.append("div")
    .classed("col-sm-2 col-xs-12 links", true);
  var mobileExpander = right.append("div").classed("expanderContainer", true)
    .append("img")
      .classed("expander", true)
      .attr("src", "images/chevron-circle-down.svg");
    mobileExpander.on("click", (d,i) => expandEventHandler(left, d));
  right.appendLink("PDF", "PDF", d => d.AuthorPDF);
  right.appendLink("sourceMaterial", "Materials", d => d.SourceMaterials);
  right.appendLink("data", "Data", d => d.Data);
  right.appendLink("projectPage", "Explanation", d => d.ExplanationPage);


  ///// expander content  /////
  var expandInfo = papers.append("div")
    .attr("id", d => d.simpleName + "_expandInfo")
    .classed("col-xs-12 col-sm-8 col-sm-offset-2 expandInfo collapse", true);
  var mobileThumbnails = expandInfo.append("img").classed("mobileThumb", true);
  abstracts = expandInfo.append("p")
    .classed("abstract", true);
  videos = expandInfo.append("div")
    .classed("videoWrapper empty", true);
  expandInfo.append("pre")
    .classed("citation", true)
    .text(makeCitation);

  // load thumbnails last
  thumbnails.attr("src", getThumbnailPath);
  mobileThumbnails.attr("src", getThumbnailPath);
} // end buildPage()



// make a simple name for the paper
function getSimpleName(paper, sep = "_") {
  var title = dropLeadingArticle(paper.Title);
  return title.split(/[^\w]/, 1)[0].toLowerCase()
         + sep
         + paper.Authors.split(/[^\w]/, 1)[0].toLowerCase();
}
function dropLeadingArticle (text) {
  if (text.startsWith("A ")) text = text.substring(2);
  if (text.startsWith("An ")) text = text.substring(3);
  if (text.startsWith("The ")) text = text.substring(4);
  // numerical leads are bad too
  if (!isNaN(parseInt(text[0])))
    text = text.substring(text.indexOf(" ") + 1);
  return text;
}

// get thumbnail image
function getThumbnailPath(paper) {
  if (paper.closedAccess)
    return "images/Closed_Access_Research.svg";
  return thumbnailFolder + paper.simpleName + ".png";
}

// is the pdf on a true open access repository
function isOpenAccessDomain(href) {
  for (var i = 0; i < OADomains.length; i++) {
     if (href.includes(OADomains[i])) 
      return true;
  }
  return false;
}

// time to string converter
var timeFormatterShort = d3.timeFormat("%-I:%M");
var timeFormatterLong = d3.timeFormat("%-I:%M %p");
function timeFormatter(time, AMPM) {
  return AMPM ? timeFormatterLong(time) : timeFormatterShort(time);
}

// time range to string
function formatTimeRange(start, end) {
  start = timeParser(start);
  end = timeParser(end);
  // if both AM or both PM
  if ((start.getHours() >= 12)  ==  (end.getHours() >= 12))
    return timeFormatterShort(start) + "-" + timeFormatterLong(end);
  return timeFormatterLong(start) + "-" + timeFormatterLong(end);
}

// add a link and icon
d3.selection.prototype.appendLink = function (css, text, href) {
  var link = this.append("a")
    .classed("link " + css, true)
    .attr("target", "_blank")
    .attr("href", href)
    .attr("title", d => isOpenAccessDomain(href(d)) ? "Open access repository with permanent URL" : "Personal/Institutional site")
    .classed("OADomain", d => isOpenAccessDomain(href(d)));

  link.append("img")
    .attr("src", d => 
      "images/" +
      linkImages[text] + 
      (isOpenAccessDomain(href(d)) ? ".svg" : "-o.svg"));

  link.append("span")
    .text(text);
}

// 
function makeVideoFrame(video) {
  if (video == "")
    return "";
  if (video.startsWith("youtube ")) {
    var videoID = video.split(" ")[1];
    return `<iframe src="https://www.youtube-nocookie.com/embed/${videoID}?rel=0&amp;showinfo=0" width="1080" height="608" frameborder="0" allowfullscreen></iframe>`;
  }
  if (video.startsWith("vimeo ")) {
    var videoID = video.split(" ")[1];
    return `<iframe src="https://player.vimeo.com/video/${videoID}?byline=0" width="1080" height="608" frameborder="0" allowfullscreen></iframe>`;
  }
  if (video.startsWith("video ")) {
    var videoID = video.split(" ")[1];
    return `<video width="100%" controls=""><source src="${videoID}" type="video/mp4"></video>`;
  }
  return video;
}

// make text that can be copied for a citation
function makeCitation(paper) {
  var IEEE = "";
  var authors = paper.Authors.split(", ");
  authors = authors.map(convertName2Reference);
  IEEE = authors[0];
  if (authors.length == 2)
    IEEE += " and " + authors[1];
  if (authors.length > 2) {
    for (var a = 1; a < authors.length - 1; a++)
      IEEE += ", " + authors[a];
    IEEE += ", and " + authors[authors.length - 1];
  }
  IEEE += ". \"" + paper.Title + "\". ";
  IEEE += journals[paper.PublicationVenue] + ". ";
  IEEE += paper.PublicationYear + ". ";
  IEEE += paper.DOI ? "DOI:" + paper.DOI + "." : "";

  var bibtex = "@Article{" + paper.simpleName + ",\n";
  bibtex += "  author = " + paper.Authors.split(", ").join(" and ") + "\n";
  bibtex += "  title = " + paper.Title + "\n";
  bibtex += "  journal = " + journals[paper.PublicationVenue] + "\n";
  bibtex += "  year = " + paper.PublicationYear + "\n";
  bibtex += "  DOI = " + paper.DOI + "\n";
  bibtex += "}";

  return IEEE + "\n\n" + bibtex;
}

// make a reference-style initial name
var particles = [" von der ", " van der ", " van den ", " van het ", " op het ", " van ", " von ", " de ", " di ", " d’ "]; // more?
function convertName2Reference(name) {
  var shortName = "";
  var particle = particles.map(p => name.includes(p) ? p : "").filter(p => p != "");
  particle = particle.length == 0 ? "" : particle[0];
  if (particle != "")
    name = name.replace(particle, " ");
  var tokens = name.split(" ");
  var lastName = tokens.pop();
  var firstInitials = tokens.map(t => {
    if (!t.includes("-"))
      return t.trim()[0] + ".";
    return t.split("-").map(t => t[0]).join(".-") + ".";
  }).join(" ");
  return firstInitials + particle.trimRight() + " " + lastName;
}

// show/hide the expand region
function expandEventHandler(left, paper) {
  if (untouched) {
    abstracts.html(d => d.Abstract);
    untouched = false;
  }
  if (paper.closedAccess) 
    return;
  var id = '#' + paper.simpleName;
  if (paper.Video != "" && d3.select(id + " .videoWrapper").html() == "")
    d3.select(id + " .videoWrapper").classed("empty", false).html(makeVideoFrame(paper.Video));
  d3.select(id).classed("isExpanded", !d3.select(id).classed("isExpanded"));
  $(id + "_expandInfo").collapse('toggle');
}

// make button to show/hide each day
function makeDayButtons() {
  d3.select("#dayToggles")
    .selectAll("button")
    .data(dataNested).enter()
    .append("button")
      .attr("type", "button")
      .classed("btn active btn-day", true)
      .attr("data-toggle", "button") 
      .attr("data-subset", d => "#" + d.key.split("|")[1].replace(" ", "_"))
      .attr("aria-pressed", "true")
      .attr("autocomplete", "off")
      .append("span").text(d => dayAbrevs[d.key.split("|")[1]]);
  
  // set up button events handlers
  d3.selectAll('button').on("click", function() {
    var subset = d3.select(this).node().dataset["subset"];
    var isPressed = d3.select(this).attr("aria-pressed");
    d3.selectAll(subset).style("display", isPressed == "false" ? "block" : "none");
  });
}

// just for dev
function checkImageSizes() {
  d3.selectAll(".thumb").each(function(d) {
    var a = d3.select(this).node();
    if (a.naturalHeight < a.naturalWidth * .75 && !a.src.includes("Closed_Access"))
    console.log(a.naturalHeight + " x " + a.naturalWidth + ": " + a.src);
  });
}

// just for dev
function checkCompleteness() { 
  return d3.nest()
    .key(d => d.ReviewVenue)
    .rollup(rv => rv.filter(p => p.AuthorPDF!="").length / rv.length )
    .entries(dataCSV);
    console.log(completeness);
}