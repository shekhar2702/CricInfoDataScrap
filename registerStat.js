let fs = require("fs");
let path = require("path");

let registerStatsInFile = function (
  batsman,
  runs,
  balls,
  fours,
  sixes,
  strikeRate,
  matchStatus,
  teamName,
  opponent
) {
  let rootFolder = path.join(process.cwd(), "ipl");
  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder);
  }
  let teamFolder = path.join(rootFolder, teamName);
  if (!fs.existsSync(teamFolder)) {
    fs.mkdirSync(teamFolder);
  }
  let playerFile = path.join(teamFolder, `${batsman}.json`);
  if (!fs.existsSync(playerFile)) {
    let obj = [
      {
        player: batsman,
        runsScored: runs,
        balls: balls,
        fours: fours,
        sixes: sixes,
        strikeRate: strikeRate,
        result: matchStatus,
        myTeam: teamName,
        opponent: opponent,
      },
    ];
    let jsonData = JSON.stringify(obj);
    fs.writeFileSync(playerFile, jsonData);
  } else {
    let obj = {
      player: batsman,
      runsScored: runs,
      balls: balls,
      fours: fours,
      sixes: sixes,
      strikeRate: strikeRate,
      result: matchStatus,
      myTeam: teamName,
      opponent: opponent,
    };
    let fileContent = fs.readFileSync(playerFile);
    let content = JSON.parse(fileContent);
    content.push(obj);
    let jsonData = JSON.stringify(content);
    fs.writeFileSync(playerFile, jsonData);
  }
};

module.exports = {
  registerStatsInFile,
};
