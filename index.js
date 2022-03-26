const path = require("path");
const fs = require('fs');
const gameDir = "/home/maxwell/Games/johncena141/";
const terminalRunCommand = "foot %command%";
var gameModels = [];
var gameNames = [];
let sixtyfps = require("sixtyfps");
let ui_main = require(__dirname +"/ui/main.60"); // this is so pkg doesn't break

let GameModel = class {
    constructor(path) { // trailing /
        this.path = path;
        console.log(this.name);
    }
    get startScript() {
        return gameDir + this.path + "/start.sh";
    }
    startGame() {
        exec(this.startScript);
    }
    startGameTerminal() {
        exec(terminalRunCommand.replace("%command%", this.startScript));
    }
    get name() {
        return this.path.replace(/\./g, " ");
    }
}

const { exec } = require("child_process");
let main_window = new ui_main.MainWindow();
var files = fs.readdirSync(gameDir);
files.forEach(file => {
	try {
    var gameFolder = fs.readdirSync(gameDir + file.toString());
    if (gameFolder.includes("start.sh")) { 
        gameModels.push(new GameModel(file.toString()));
        gameNames.push(gameModels[gameModels.length - 1].name);
    }
    } catch (error) {
		console.log(error);
    }
});
var finalGameList = [];
gameModels.forEach(gameModel => {
    finalGameList.push({ text: gameModel.name});
});
console.log(finalGameList);
main_window.playButtonClicked.setHandler(
    function() {
        console.log(main_window.selectedGame);
        console.log(main_window.willRunInTerminal);
        if (main_window.selectedGame != -1) {
            if (main_window.willRunInTerminal) {
                gameModels[main_window.selectedGame].startGameTerminal();
            } else { 
                gameModels[main_window.selectedGame].startGame();
            }
        }
    }
);

main_window.gameList = finalGameList;
main_window.run();
