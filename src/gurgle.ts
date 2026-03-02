import {Application, ApplicationState, parseNumberFromUserOptions} from "./helpers.js";
import {AppOption} from "./util/AppOption.js";
import {clearLog, printLine} from "./bash.js";
import {Dictionary} from "./util/Dictionary.js";
import {GurgleGame} from "./util/GurgleGame.js";

export class gurgle extends Application {
	game: GurgleGame | undefined;
	loading: boolean = true;
	wordLength: number | undefined = 5;
	randomLength = false;
	answerRarity = 3;
	guessRarity = 5;
	// static applicationName = "gurgle";
	static shortHelp = "A clone of that famous word puzzle.";
	// noinspection HttpUrlsUsage
	static longHelp = [
		"Credits: SCOWL (<a href='http://wordlist.aspell.net/'>http://wordlist.aspell.net/</a>) ",
		"for the list of English and Canadian words.",
		"The lists for commonality 10~~80 were loaded into ",
		"(but not necessarily used in) this application."];

	constructor(args: string[]) {
		super(args);
		this.init().catch((e: Error) => {
			this.state = ApplicationState.CLOSE;
			printLine(e.message);
		});


	}

	getAppOptions() {
		return [
			new AppOption("l", "length of word, random when param unspecified", "len"),
			new AppOption("a",
				`rarity of word to use as answer (${Dictionary.LOWEST_RARITY}-${Dictionary.HIGHEST_RARITY})`,
				"aLimit"),
			new AppOption("g",
				`rarity of word to use as guess (${Dictionary.LOWEST_RARITY}-${Dictionary.HIGHEST_RARITY})`,
				"gLimit")
		];
	}

	redraw() {
		super.redraw();
	}

	evaluate(command: string) {
		//super.evaluate(command);
		if (command === "q") {	//Use this to quit instead of "quit/exit", as those words may conflict with the game.
			clearLog();
			this.state = ApplicationState.CLOSE;
			return;
		}

		if (this.loading) {
			return;
		}
		if (this.game === undefined || this.game.won || this.game.lost) {
			this.game = new GurgleGame(this.wordLength, Dictionary.LOWEST_RARITY,
				this.answerRarity, this.guessRarity);
			clearLog();
			this.game.draw();
		}
		else {
			this.game.grade(command.toLowerCase());
			clearLog();
			this.game.draw();
		}
	}

	prompt() {
		let s;
		if (this.loading) {
			s = "Loading...";
		}
		else if (this.game === undefined || this.game.lost || this.game.won) {
			s = "Press enter to start a new game, or 'q' to quit. "
		}
		else {
			s = "Guess? ('q' to quit) ";
		}
		return [s];
	}

	private async init() {
		try {
			await Dictionary.init();

			//Read options set by user
			if (this.userArgs!.get("l")) {
				let l = this.userArgs!.getParam("l");
				if (this.userArgs!.getParam("l") === undefined) {
					this.randomLength = true;
					this.wordLength = undefined;
				}
				else {
					this.wordLength = Number.parseInt(l!);
				}
			}

			if (this.userArgs!.get("a")) {
				let parsedAnswerRarity = parseNumberFromUserOptions(this.userArgs!, "a", -1);
				if (parsedAnswerRarity < Dictionary.LOWEST_RARITY || parsedAnswerRarity > Dictionary.HIGHEST_RARITY) {
					throw new Error("Answer rarity needs to be in the range " + Dictionary.LOWEST_RARITY + "-" +
						Dictionary.HIGHEST_RARITY);
				}
				else {
					this.answerRarity = parsedAnswerRarity;
				}
			}

			if (this.userArgs!.get("g")) {
				let parsedGuessRarity = parseNumberFromUserOptions(this.userArgs!, "g", -1);
				if (parsedGuessRarity < Dictionary.LOWEST_RARITY || parsedGuessRarity > Dictionary.HIGHEST_RARITY) {
					throw new Error("Guess rarity needs to be in the range " + Dictionary.LOWEST_RARITY + "-" +
						Dictionary.HIGHEST_RARITY);
				}
				else {
					this.guessRarity = parsedGuessRarity;
				}
			}

			if (this.guessRarity < this.answerRarity) {
				throw new Error(`Guess rarity (${this.guessRarity}) cannot be lower` +
					` than answer's (${this.answerRarity})`);
			}

			//Perform length check if not using random word length
			if (this.wordLength !== undefined) {
				let longestLength = Dictionary.longestLength(Dictionary.LOWEST_RARITY, this.answerRarity);
				if (longestLength === undefined) {
					throw new Error
					(`There are no words between rarity ${Dictionary.LOWEST_RARITY} and ${this.answerRarity}`);
				}
				if (longestLength < this.wordLength) {
					throw new Error
					(`Longest word length between rarity ${Dictionary.LOWEST_RARITY}-${this.answerRarity}: ${longestLength}`);
				}
			}

			this.loading = false;
		}
		catch (e) {
			throw await e;
		}
	}

}