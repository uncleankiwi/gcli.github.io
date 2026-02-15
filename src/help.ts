import {Application} from "./helpers";
import {printLine} from "./bash";
import type {AppOption} from "./util/AppOption";

export class help extends Application {
	static applicationName = "help";
	static optionsString: string = Application.applicationName;
	static shortHelp: string = "No short description available.";
	static longHelp = ["No additional info available for this application."];
	static options: AppOption[] = [];
	static longHelp = help.getLongHelp();


	static getLongHelp() {
		printLine("<span style='text-decoration-line: underline;'>Fake JS bash</span>");
		printLine(`Type \`${cmd.HELP}\` to see this list.`);
		printLine(`Available commands in cmd: \`${cmd.RAINBOW}\` and \`${cmd.CLEAR}\`.`)
		printLine(`Available commands in every application: \`${Application.EXIT}\` and \`${Application.QUIT}\`.`);
		printLine("Executable scripts (may not be implemented):");
		printLine("");
		let keys = this.directory.keys();
		for (const key of keys) {
			printLine(key);
		}
	}
}