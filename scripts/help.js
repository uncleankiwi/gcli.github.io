import { Application, ApplicationState, spaces, wrapCharsWithPastelAndRainbow } from "./helpers.js";
import { clearLog, LogNode, printLine } from "./bash.js";
import { AppOption } from "./util/AppOption.js";
import { cmd } from "./cmd.js";
import { UserOptions } from "./util/UserOptions.js";
import { gurgle } from "./gurgle.js";
import { mm } from "./mm.js";
import { suso } from "./suso.js";
import { clock } from "./clock.js";
import { hoge } from "./hoge.js";
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
    //static longHelp;	//Loaded later otherwise it'll try to read from cmd when that isn't loaded.
    constructor(args) {
        super(args);
        help.longHelp = help.getLongHelp();
        if (this.userParams.length > 0) {
            let appToFetch = this.userParams[0];
            if (cmd.directory.has(appToFetch)) {
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
                let optionsString = [`${appToFetch}:${help.appendAppToOptionsString(appToFetch)}`];
                let shortHelp = [spaces(2) + eval(appToFetch + ".shortHelp")];
                let longHelp = eval(appToFetch + ".longHelp");
                help.indentArray(longHelp, 2);
                //Options section
                let optionsArrayOrUndefined = AppOption.listOptions(eval(appToFetch + ".prototype.getAppOptions()"));
                let optionsArray = [];
                if (optionsArrayOrUndefined !== undefined) {
                    optionsArray.push("");
                    optionsArray.push(spaces(2) + "Options:");
                    help.indentArray(optionsArrayOrUndefined, 4);
                    optionsArray = optionsArray.concat(optionsArrayOrUndefined);
                }
                //Arguments section
                let argArrayOrUndefined = AppOption.listArguments(eval(appToFetch + ".prototype.getAppOptions()"));
                let argArray = [];
                if (argArrayOrUndefined !== undefined) {
                    argArray.push("");
                    argArray.push(spaces(2) + "Arguments:");
                    help.indentArray(argArrayOrUndefined, 4);
                    argArray = argArray.concat(argArrayOrUndefined);
                }
                //Putting it together
                let helpTextArr = optionsString.concat(shortHelp, [""], longHelp, optionsArray, argArray);
                for (let i = 0; i < helpTextArr.length; i++) {
                    printLine(helpTextArr[i]);
                }
            }
            else {
                printLine("No such application: " + appToFetch);
            }
        }
        else {
            help.printAboutBash();
        }
        this.state = ApplicationState.CLOSE;
    }
    getAppOptions() {
        return [
            new AppOption(undefined, "App to display help for.", "PARAM")
        ];
    }
    evaluate(command) {
        if (command === Application.EXIT || command === Application.QUIT) {
            this.state = ApplicationState.CLOSE;
        }
    }
    redraw() {
    }
    prompt() {
        return [""];
    }
    static getLongHelp() {
        let output = [];
        output[0] = "Displays info about bash commands and applications.";
        output[1] = `${cmd.HELP} without parameters gives info about bash.`;
        output[2] = `\`${cmd.HELP} PARAM\` gives info about the application PARAM.`;
        return output;
    }
    static printAboutBash() {
        printLine("<span style='text-decoration-line: underline;'>Fake JS bash</span>");
        printLine(`Type \`${cmd.HELP}\` to see this list.`);
        printLine(`Available commands in cmd: \`${cmd.RAINBOW}\` and \`${cmd.CLEAR}\`.`);
        printLine(`Available commands in every application: \`${Application.EXIT}\` and \`${Application.QUIT}\`.`);
        printLine("Executable scripts (may not be implemented):");
        printLine("");
        let keys = cmd.directory.keys();
        for (const key of keys) {
            printLine(help.appendAppToOptionsString(key));
        }
    }
    static appendAppToOptionsString(app) {
        let s = AppOption.getOptionsString(eval(app + ".prototype.getAppOptions()"));
        if (s === undefined) {
            s = app;
        }
        else {
            s = app + " " + s;
        }
        return s;
    }
    static indentArray(arr, width) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = spaces(width) + arr[i];
        }
    }
}
// static applicationName = "help";
// static optionsString: string = this.constructor.name;
help.shortHelp = "Displays info about bash commands and applications.";
