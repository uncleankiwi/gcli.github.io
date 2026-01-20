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
	minColours = 1;
	maxColours = 9;
	colours = 4;
	minChances = 1;
	maxChances = 20;
	chances = 6;
	minPlaces = 1;
	maxPlaces = 9;
	places = 4;
	won = false;
	lost = false;
	answer = [];	//Holds the answer.
	attemptCount = 0;
	attempts = [];	//Holds the attempts; each attempt is also a [];
	grades = [];	//Holds the grades for each attempt; each grade is also a [];

	chancesLeft() {
		return this.chances - this.attemptCount;
	}

	pickNumbers() {
		for (let i = 0; i < this.places; i++) {
			this.answer[i] = 1 + Math.floor(Math.random() * (this.colours - 1));
		}
	}

	//Parse the first 'places' non-space characters and puts them in an array.
	parseDigits(inputString) {
		let s = "test";
		let output = [];
		let stringIndex = 0;
		for (let arrIndex = 0; arrIndex < this.places; arrIndex++) {
			//If input string is too short for the answer, fill the rest of the places with '?'.
			if (stringIndex >= inputString.length) {
				output[arrIndex] = '?';
			}
			else {
				//Put the character in and skip any spaces.
				if (inputString.charAt(stringIndex) !== ' ') {
					output[arrIndex] = inputString.charAt(stringIndex);
				}
				stringIndex++;
			}
		}
		this.attempts[this.attemptCount] = output;
	}

	//If any character is not a digit within maxColours and minColours, return null.
	//This is for balance purposes - the user could just enter invalid characters to guess particular
	//positions and colours otherwise.
	grade() {
		//Checking if every input is valid
		let previousGrade = [];
		let previousAttempt = this.attempts[this.attemptCount];
		let attemptMap = new Map();
		let answerMap = new Map();
		let correctColourAndPos = 0;
		let correctColour = 0;
		for (let i = 0; i < this.places; i++) {
			if (previousAttempt[i] >= this.minColours && previousAttempt[i] <= this.maxColours) {
				let attemptToken = previousAttempt[i];
				let answerToken = this.answer[i];
				if (attemptToken === answerToken) {
					//Go through each position, and if it's correct, increment correctColourAndPos.
					correctColourAndPos++;
				}
				else {
					//If it's not an exact match, put the token in the attempt and the answer into a map.
					this.incrementMap(attemptMap, attemptToken);
					this.incrementMap(answerMap, attemptToken);
				}
			}
			else {
				//Bumped into an invalid output, so dump everything.
				previousGrade = null;
				break;
			}
		}
		//Increment correctColour based on the two maps.
		attemptMap.forEach(x, y => {})	//todo
		this.grades[this.attemptCount] = previousGrade;
	}

	incrementMap(map, k) {
		if (map.has(k)) {
			map.set(k, map.get(k) + 1);
		}
		else {
			map.set(k, 1);
		}
	}
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
					this.state = ApplicationState.CLOSE;
					return;
				}
				else {
					this.gameData = new GameData();
					this.gameState = MMState.CHOOSE_COLOURS;
				}
				break;
			case MMState.CHOOSE_COLOURS:
				let x = parseInt(command);
				if (x >= this.gameData.minColours && x <= this.gameData.maxColours) {
					this.gameData.colours = x;
				}
				this.gameState = MMState.CHOOSE_CHANCES;
				break;
			case MMState.CHOOSE_CHANCES:
				let y = parseInt(command);
				if (y >= this.gameData.minChances && y <= this.gameData.maxChances) {
					this.gameData.chances = y;
				}
				this.gameData.chancesLeft = this.gameData.chances;
				this.gameState = MMState.CHOOSE_PLACES;
				break;
			case MMState.CHOOSE_PLACES:
				let z = parseInt(command);
				if (z >= this.gameData.minPlaces && z <= this.gameData.maxPlaces) {
					this.gameData.places = z;
				}
				this.gameData.pickNumbers();
				this.gameState = MMState.IN_PROGRESS;
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
