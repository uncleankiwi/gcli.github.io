import {Colour} from "./util/Colour.js";

export function wrapColour(str, colour) {
	return '<span style="color: ' + colour + '">' + str + '</span>';
}

export function makeRainbow(str) {
	return '<span class="rainbow">' + str + '</span>';
}

export const ApplicationState = Object.freeze({
	CLOSE: 0,
	OPEN: 1,
	OPEN_APPLICATION: 2
})

export function animColour() {
	let element = document.getElementsByClassName("rainbow");
	console.log(element.length);	//todo rm
	for (let i = 0; i < element.length; i++) {
		let colourString = window.getComputedStyle(element[i]).getPropertyValue("color");
		let colour = new Colour(colourString);
		// console.log(colourString);
		// console.log(colour.hex + " obj");
		// colour.stringToRGB();
		element[i].color = colour.increment(5);
	}
}

export class Application {
	state = ApplicationState.OPEN;

	evaluate(command) {
		if (command === 'exit' || command === 'quit') {
			this.state = ApplicationState.CLOSE;
		}
	}

	prompt() {

	}
}