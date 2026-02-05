import {Application} from "./helpers.js";
import {printLine} from "./bash.js";
import {Dictionary} from "./util/Dictionary.js";

export class gurgle extends Application {
	static dictionary;

	constructor() {
		super();
		Dictionary.init();
	}

	evaluate(command) {
		super.evaluate(command);
		printLine("gurg: eval");
		for (let i = 0; i < 5; i++) {
			let w = Dictionary.getRandomWord(5, 0, 3);
			console.log(w + " some word of length 5. repeat: " + i + " Is word: " + Dictionary.isWord(w, 0, 3));
		}

		for (let i = 0; i < 5; i++) {
			let w = Dictionary.getRandomLengthWord(0, 6);
			console.log(w + " <- word of rand length, repeat " + i + ". Is word: " + Dictionary.isWord(w, 0, 6));
		}

	}

	prompt() {
		return "gurgle: prompt: ";
	}

}