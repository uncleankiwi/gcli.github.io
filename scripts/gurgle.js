import {Application, ApplicationState} from "./helpers.js";
import {clearLog} from "./bash.js";
import {Dictionary} from "./util/Dictionary.js";
import {GurgleGame} from "./util/GurgleGame.js";

export class gurgle extends Application {
	game;

	constructor() {
		super();
		Dictionary.init();
	}

	redraw() {
		super.redraw();
		this.updateColour(new Date());
	}

	evaluate(command) {
		//super.evaluate(command);
		if (command === "q") {	//Use this to quit instead of "quit/exit", as those words may conflict with the game.
			clearLog();
			this.state = ApplicationState.CLOSE;
			return;
		}

		if (this.game === undefined || this.game.won || this.game.lost) {
			this.game = new GurgleGame(5, 0, 3, 5);
			clearLog();
			this.game.draw();
		}
		else {
			this.game.grade(command.toLowerCase());
			clearLog();
			this.game.draw();
		}


	}

	prompt() {
		let s;
		if (this.game === undefined || this.game.lost || this.game.won) {
			s = "Press enter to start a new game, or 'q' to quit."
		}
		else {
			s = "Guess? ('q' to quit)";
		}
		return s;
	}

}