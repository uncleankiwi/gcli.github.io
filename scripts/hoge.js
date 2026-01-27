import {Application} from "./helpers.js";
import {printLine} from "./bash.js";

let one;
let two;

export class hoge extends Application {
	evaluate(command) {
		super.evaluate(command);
		printLine("hoge eval")
	}

	prompt() {
		return "hoge prompt: ";
	}


	onKeyDown(keyState, e) {
		super.onKeyDown(keyState, e);
		if (keyState["Control"] === true && e.key === 'v') {
			let p = navigator.clipboard.readText();
			if (one === undefined) {
				one = p;
				console.log(p);
			}
			else if (two === undefined) {
				two = p;
				console.log(p);
			}
		}
	}
}