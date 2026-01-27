import {Application} from "./helpers.js";
import {printLine} from "./bash.js";

export class gurgle extends Application {
	evaluate(command) {
		super.evaluate(command);
		printLine("gurg: eval");
	}

	prompt() {
		return "gurgle: prompt: ";
	}
}