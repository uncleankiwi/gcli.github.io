//Stores the VALID options and their respective parameters that the user has entered.
//Invalid options (i.e. those that aren't in the appOptions in the current application aren't stored.)
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
    constructor(application, args) {
        //Loading optionsMap
        this.application = application;
        this.optionsMap = new Map();
        application.getAppOptions().forEach(x => {
            if (x.option !== undefined) {
                this.optionsMap.set(x.option, new UserOption(x));
            }
        });
        //Loading user options and params
        this.parseUserInput(args);
    }
    parseUserInput(args) {
        console.log(args[0] + " hoo " + args[1]);
        try {
            console.log("barsing above... args length:" + args[0].length + " ");
        }
        catch (e) {
            console.log(e);
        }
        let openParam; //An option that does not yet have a parameter assigned to it
        for (let i = 1; i < args.length; i++) {
            let word = args[i];
            console.log(word + " in barse, index:" + i);
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
