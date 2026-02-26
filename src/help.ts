import {Application, ApplicationState, spaces} from "./helpers.js";
import {importClass, LogNode, printLine} from "./bash.js";
import {AppOption} from "./util/AppOption.js";
import {cmd} from "./cmd.js";

/*
When displaying help <applicationName>, it should be formatted as below (note indentation).
Options are not hardcoded into the application, instead they are written into options
together with the parameter name, and whether it is hidden (should not appear on help, default false).
They appear here only if the application has options.
===
user:~$ help applicationName
applicationName: optionsString
shortHelp

longHelp

Options:
  -a param	some explanation.
  -b 		more text.
  -c		some more text.
 */
export class help extends Application {
	// static applicationName = "help";
	// static optionsString: string = this.constructor.name;
	static shortHelp: string = "Displays info about bash commands and applications.";
	//static longHelp;	//Loaded later otherwise it'll try to read from cmd when that isn't loaded.

	constructor(args: string[]) {
		super(args);

		help.longHelp = help.getLongHelp();

		if (this.userParams.length > 0) {
			let appToFetch = this.userParams[0];
			if (cmd.directory.has(appToFetch)) {
				try {
					this.fetchAppInfo(appToFetch).then(_ => {});
				}
				catch (e) {
					alert("Error fetching application " + appToFetch + e);
				}
			}
			else {
				printLine("No such application: " + appToFetch);
			}
		}
		else {
			help.printAboutBash().then(_ => {});
		}
		this.state = ApplicationState.CLOSE;
	}

	getAppOptions() {
		return [
			new AppOption(undefined, "App to display help for.", "PARAM")
		];
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
		let output: string[] = [];
		output[0] = "Displays info about bash commands and applications.";
		output[1] = `${cmd.HELP} without parameters gives info about bash.`;
		output[2] = `\`${cmd.HELP} PARAM\` gives info about the application PARAM.`;
		return output;
	}

	static async printAboutBash() {
		printLine("<span style='text-decoration-line: underline;'>Fake JS bash</span>");
		printLine(`Type \`${cmd.HELP}\` to see this list.`);
		printLine(`Type \`${cmd.HELP} PARAM\` for info about PARAM.`);
		printLine(`Available commands in cmd: \`${cmd.RAINBOW}\` and \`${cmd.CLEAR}\`.`)
		printLine(`Available commands in every application: \`${Application.EXIT}\` and \`${Application.QUIT}\`.`);
		printLine("Executable scripts (may not be implemented):");
		printLine("");
		let keys = cmd.directory.keys();
		for (const key of keys) {
			printLine(await help.appendAppToOptionsString(key));
		}
	}

	private async fetchAppInfo(appToFetch: string) {
		let cls = await importClass(appToFetch);
		//app:optionsString
		//shortHelp
		//	-- line break --
		//longHelp
		//	-- line break --
		//Options:
		//optionsArray = AppOptions.listOptions(app)
		//	-- line break --
		//Arguments:
		//argumentsArray = AppOptions.listArguments(app)
		let optionsString = [`${appToFetch}:${await help.appendAppToOptionsString(appToFetch)}`];
		let shortHelp = [spaces(2) + cls.shortHelp];
		let longHelp: string[] = cls.longHelp;
		//Can't indent longHelp directly - have to make a copy.
		let longHelpCopy: string[] = [];
		for (let i = 0; i < longHelp.length; i++) {
			longHelpCopy.push(spaces(2) + longHelp[i]);
		}

		//Options section
		let optionsArrayOrUndefined = AppOption.listOptions(cls.prototype.getAppOptions());
		let optionsArray: string[] = [];
		if (optionsArrayOrUndefined !== undefined) {
			optionsArray.push("");
			optionsArray.push(spaces(2) + "Options:");
			help.indentArray(optionsArrayOrUndefined, 4);
			optionsArray = optionsArray.concat(optionsArrayOrUndefined);
		}

		//Arguments section
		let argArrayOrUndefined = AppOption.listArguments(cls.prototype.getAppOptions());
		let argArray: string[] = [];
		if (argArrayOrUndefined !== undefined) {
			argArray.push("");
			argArray.push(spaces(2) + "Arguments:");
			help.indentArray(argArrayOrUndefined, 4);
			argArray = argArray.concat(argArrayOrUndefined);
		}

		//Putting it together
		let helpTextArr = optionsString.concat(shortHelp, [""], longHelpCopy, optionsArray, argArray);
		for (let i = 0; i < helpTextArr.length; i++) {
			printLine(helpTextArr[i]);
		}
	}

	private static async appendAppToOptionsString(app: string): Promise<string> {
		let cls = await importClass(app);
		let s = AppOption.getOptionsString(cls.prototype.getAppOptions());
		if (s === undefined) {
			s = app;
		}
		else {
			s = app + " " + s;
		}
		return s;
	}

	private static indentArray(arr: string[], width: number) {
		for (let i = 0; i < arr.length; i++) {
			arr[i] = spaces(width) + arr[i];
		}
	}
}