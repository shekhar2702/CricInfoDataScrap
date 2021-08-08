let request = require("request");
let cheerio = require("cheerio");
let { registerStatsInFile } = require("./registerStat");

let URL = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(URL, function (err, response, body) {
  if (err) console.log("Error in Main Page Link");
  else if (response.statusCode == 404) console.log("Page Not Found!!");
  else {
    dataExtractor(body);
  }
});
function dataExtractor(body) {
  let $ = cheerio.load(body);
  let allResSelector = $(`a[data-hover="View All Results"]`);
  let link = allResSelector.attr("href");
  let allMatchesFullLink = `https://www.espncricinfo.com/${link}`;
  request(allMatchesFullLink, function (err, response, body) {
    if (err) console.log("Error In Full Match Link");
    else if (response.statusCode == 404) console.log("Page Not Found!!");
    else {
      getAllMatchesData(body);
    }
  });
}
function getAllMatchesData(body) {
  let $ = cheerio.load(body);
  //   let allMatches = $("a[data-hover='Scorecard']");(can't digest the reasoning)
  let allMatches = $(".match-info-link-FIXTURES");
  let uniqueArr = [];
  //   console.log(allMatches.length);
  for (let i = 0; i < allMatches.length; i += 4) {
    uniqueArr.push($(allMatches[i]).attr("href"));
  }
  for (let i = 0; i < uniqueArr.length; i++) {
    let fullScoreCardLink = `https://www.espncricinfo.com/${uniqueArr[i]}`;
    request(fullScoreCardLink, function (err, response, body) {
      if (err) console.log("Error In Scorecard Page");
      else if (response.statusCode == 404) console.log("Page Not Found!!");
      else {
        getScoreCard(body);
      }
    });
  }
}
function getScoreCard(body) {
  let $ = cheerio.load(body);
  let status = $(".status-text span");
  let matchStatus = $(status[status.length - 1]).text();
  let numTeams = $(".Collapsible");
  for (let i = 0; i < numTeams.length; i++) {
    let inning = $(numTeams[i]).find("h5");
    let teamName = $(inning).text().split("INNINGS")[0].trim();
    let opponent = "";
    if (i == 0) {
      let opp = $(numTeams[1]).find("h5");
      opponent = $(opp).text().split("INNINGS")[0].trim();
    } else {
      let opp = $(numTeams[0]).find("h5");
      opponent = $(opp).text().split("INNINGS")[0].trim();
    }
    let batsmanStat = $(numTeams[i]).find(".table.batsman tbody tr");
    for (let j = 0; j < batsmanStat.length; j++) {
      let row = $(batsmanStat[j]).find("td");
      if (row.length == 8) {
        let batsman = $(row[0]).text();
        let runs = $(row[2]).text();
        let balls = $(row[3]).text();
        let fours = $(row[5]).text();
        let sixes = $(row[6]).text();
        let strikeRate = $(row[7]).text();
        registerStatsInFile(
          batsman,
          runs,
          balls,
          fours,
          sixes,
          strikeRate,
          matchStatus,
          teamName,
          opponent
        );
      }
    }
  }
  //   let allBatsmen = $(".table.batsman tbody tr");
  //   for (let i = 0; i < allBatsmen.length; i++) {
  //     let row = $(allBatsmen[i]).find("td");
  //     if (row.length == 8) {
  //       let batsman = $(row[0]).text();
  //       let runs = $(row[2]).text();
  //       let balls = $(row[3]).text();
  //       let fours = $(row[5]).text();
  //       let sixes = $(row[6]).text();
  //       let strikeRate = $(row[7]).text();
  //     }
  //   }
  console.log("````````````````````````````````````````");
}
