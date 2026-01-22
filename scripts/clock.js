import {Application, ApplicationState} from "./helpers.js";
import {printLine} from "./bash.js";

export class clock extends Application {
    evaluate(command) {
        this.state = ApplicationState.CLOSE;
    }

    prompt() {

        return "";
    }
}