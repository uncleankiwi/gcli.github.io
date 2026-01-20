import {Application} from "./helpers.js";
import {printLine} from "./bash.js";

export class suso extends Application {
	evaluate(command) {
		super.evaluate(command);
		printLine("suso...")
	}

	prompt() {
		return "suso prefix: ";
	}
}