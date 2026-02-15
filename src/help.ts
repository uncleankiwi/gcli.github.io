import {Application, ApplicationState, wrapCharsWithPastelAndRainbow} from "./helpers.js";
import {clearLog, LogNode, printLine} from "./bash.js";
import type {AppOption} from "./util/AppOption.js";
import {cmd} from "./cmd.js";

export class help extends Application {
	static applicationName = "help";
	static optionsString: string = Application.applicationName;
	static shortHelp: string = ""
	static longHelp = help.getLongHelp();
	static options: AppOption[] = [];

	constructor() {
		super();
		printLine();
	}

	evaluate(command: string) {
		if (command === Application.EXIT || command === Application.QUIT) {
			this.state = ApplicationState.CLOSE;
		}
	}

	redraw() {

	}

	prompt(): (string | LogNode)[] {
		return [""];
	}

	static getLongHelp() {

	}

	static aboutBash() {
		printLine("<span style='text-decoration-line: underline;'>Fake JS bash</span>");
		printLine(`Type \`${cmd.HELP}\` to see this list.`);
		printLine(`Available commands in cmd: \`${cmd.RAINBOW}\` and \`${cmd.CLEAR}\`.`)
		printLine(`Available commands in every application: \`${Application.EXIT}\` and \`${Application.QUIT}\`.`);
		printLine("Executable scripts (may not be implemented):");
		printLine("");
		let keys = cmd.directory.keys();
		for (const key of keys) {
			printLine(key + eval(key));
		}
	}

	static someFunc() {
		//Checking for application-specific help.
		if (commandArgs.length > 1) {
			if (this.directory.has(commandArgs[1])) {
				let helpTextArr = eval(commandArgs[1] + ".help");
				for (let i = 0; i < helpTextArr.length; i++) {
					printLine(helpTextArr[i]);
				}
			}
			else {
				printLine("No such application: " + commandArgs[1]);
			}
		}
		//Printing generic help.

	}
}