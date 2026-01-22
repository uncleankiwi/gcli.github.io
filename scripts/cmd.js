/*
Default application loaded by bash.
Contains a directory of applications that can be loaded.
 */
import {Application, ApplicationState, makeRainbow, wrapColour} from "./helpers.js";
import {printLine} from "./bash.js";
import {gurgle} from "./gurgle.js";

export class cmd extends Application {

	//Only the keys (the application names) will be used for now.
	//The values could hold application options/a short description in the future?
	directory = new Map([
		["gurgle", ''],
		["mm", ''],
		["suso", '']
	]);
	user= 'user@uncleankiwi.github.io';
	path = '~';
	nextApplication = '';

	constructor() {
		super();
	}

	//Run the function stored in the map if the key matches.
	evaluate(command) {
		super.evaluate(command);
		if (this.state === ApplicationState.CLOSE) {
			return;
		}
		if (this.directory.has(command)) {
			this.nextApplication = command;
			this.state = ApplicationState.OPEN_APPLICATION;
		}
		else {
			printLine(command + ': command not found');
		}
	}

	prompt() {
		//wrapColour(this.user, '#55cc33')
		return makeRainbow(this.user) + ':' + wrapColour(this.path, '#5566ee') + '$ ';
	}
}