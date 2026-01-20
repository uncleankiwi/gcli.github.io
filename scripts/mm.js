import {Application, ApplicationState} from "./helpers.js";
import {clearLog, printLine} from "./bash.js";

const MMState = Object.freeze({
	TITLE: 0,
	CHOOSE_COLOURS: 1,
	CHOOSE_CHANCES: 2,
	CHOOSE_PLACES: 3,
	IN_PROGRESS: 4,
	DONE: 5
})

class GameData {
	colours = 4;
	chances = 6;
	places = 4;
	chancesLeft;
	won = false;
	lost = false;
}


export class mm extends Application {
	titleString = "Press Enter to begin, or 'q' to quit."
	setupStringPossibleColours = "Enter 'd' to start with default settings, " +
		"or enter a number from 1-9 for the number of possible different tokens at each location. " +
		"(Default: 4)'";
	setupStringChances = "Enter a number from 1-20 for the number of tries you get. " +
		"(Default: 6)";
	setupStringPlaces = "Enter a number from 1-9 for the number of tokens you have to guess. " +
		"(Default: 4)";
	inProgressString = "Enter " + this.gameData.places + " numbers as your next guess: ";
	winString = "You win!";
	loseString = "You lose...";
	nextGameString = "Press Enter to begin another game, or 'q' to quit."

	gameState = MMState.TITLE;
	gameData = new GameData();

	constructor() {
		super();
	}

	evaluate(command) {
		super.evaluate(command);
		if (this.state === ApplicationState.CLOSE) {
			clearLog();
			printLine("mm closing.")
			return;
		}
		switch (this.gameState) {
			case MMState.TITLE:
				if (command === 'q') {

				}
				break;
			case MMState.CHOOSE_COLOURS:
				break;
			case MMState.CHOOSE_CHANCES:
				break;
			case MMState.CHOOSE_PLACES:
				break;
			case MMState.IN_PROGRESS:
				break;
			case MMState.DONE:
				break;
			default:
				throw "Unknown game state at prompt(): " + this.gameState;
		}
	}

	prompt() {
		switch (this.gameState) {
			case MMState.TITLE:
				return this.titleString;
			case MMState.CHOOSE_COLOURS:
				return this.setupStringPossibleColours;
			case MMState.CHOOSE_CHANCES:
				return this.setupStringChances;
			case MMState.CHOOSE_PLACES:
				return this.setupStringPlaces;
			case MMState.IN_PROGRESS:
				return this.inProgressString;
			case MMState.DONE:
				let output = "";
				if (this.gameData.won) {
					output += this.winString;
				}
				else if (this.gameData.lost) {
					output += this.loseString;
				}
				return output + " " + this.nextGameString;
			default:
				throw "Unknown game state at prompt(): " + this.gameState;
		}
	}
}
