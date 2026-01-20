import {Application} from "./helpers.js";
import {printLine} from "./bash.js";

export class mm extends Application {
	evaluate(command) {
		super.evaluate(command);
		printLine("mm");
	}

	prompt() {
		return "mm prefix: ";
	}
}