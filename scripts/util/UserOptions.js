//Stores the VALID options and their respective parameters that the user has entered.
//Invalid options (i.e. those that aren't in the appOptions in the current application aren't stored.)
//Stores one AppOption and the corresponding user state
import { Application } from "../helpers.js";
import { AppOption } from "./AppOption.js";
// import {help} from "../help.js";
// import {gurgle} from "../gurgle.js";
// import {mm} from "../mm.js";
// import {suso} from "../suso.js";
// import {clock} from "../clock.js";
// import {hoge} from "../hoge.js";
class UserOption {
    constructor(ao) {
        this.appOption = ao;
        this.isOn = false;
    }
}
export class UserOptions {
    constructor(application, ...args) {
        //Loading optionsMap
        this.application = application;
        this.optionsMap = new Map();
        // console.log("../" + application.applicationName + ".js <-- import");
        // const importer = (async () => {
        // 	return await import("../" + application.applicationName + ".js");
        // })().then(module => {
        // 	const moduleDefault = new module.default();	//Attempt to load the default exports in the module
        // 	moduleDefault.run();
        //
        // });
        let module;
        (async () => {
            // const {eval(application.applicationName)} = await import("../" + application.applicationName + ".js");
            // eval(`const{${application.applicationName}} = import("../" + application.applicationName + ".js")`);
            // await new Promise(x => {setTimeout(x, 1000)});
            module = await import("../help.js");
            console.log(module.help.getLongHelp() + " hello?");
        })().then(_ => {
            let appName = application.applicationName;
            console.log("../" + application.applicationName + ".js <-- import inside");
            let appOptions = eval(appName + ".appOptions");
            appOptions.forEach(x => {
                if (x.option !== undefined) {
                    this.optionsMap.set(x.option, new UserOption(x));
                }
            });
        });
        // let appName = application.applicationName;
        // console.log("../" + application.applicationName + ".js <-- import inside");
        // let appOptions: AppOption[] = eval(appName + ".appOptions");
        // appOptions.forEach(x => {
        // 	if (x.option !== undefined) {
        // 		this.optionsMap.set(x.option, new UserOption(x));
        // 	}
        // });
        // import("../" + application.applicationName + ".js").then(() => {
        //
        // });
        // import("../help.js").then(this.someMethod);
        // import {hoge} from "../hoge.js";
        //Loading user options and params
        this.parseUserInput(...args);
    }
    someMethod(app) {
        let appName = app.applicationName;
        let appOptions = eval(appName + ".appOptions");
        appOptions.forEach(x => {
            if (x.option !== undefined) {
                this.optionsMap.set(x.option, new UserOption(x));
            }
        });
    }
    parseUserInput(...args) {
        let openParam; //An option that does not yet have a parameter assigned to it
        for (let i = 1; i < args.length; i++) {
            let word = args[i];
            if (word.startsWith("-") && word.length > 1) {
                //This word is an option
                openParam = word.substring(1);
                this.set(openParam);
            }
            else {
                //This word is a param that may or may not belong to an option
                if (openParam !== undefined) {
                    this.setParam(openParam, word);
                    openParam = undefined;
                }
                else {
                    this.application.userParams.push(word);
                }
            }
        }
    }
    set(option) {
        //No error thrown if the param doesn't exist
        if (this.optionsMap.has(option)) {
            this.optionsMap.get(option).isOn = true;
        }
    }
    setParam(option, param) {
        //No error thrown if the param doesn't exist
        if (this.optionsMap.has(option)) {
            this.optionsMap.get(option).param = param;
        }
    }
    get(option) {
        this.checkHasOption(option);
        return this.optionsMap.get(option).isOn;
    }
    getParam(option) {
        this.checkHasOption(option);
        return this.optionsMap.get(option).param;
    }
    checkHasOption(option) {
        if (!this.optionsMap.has(option)) {
            let e = "Application does not have option " + option;
            alert(e);
            throw Error(e);
        }
    }
}
