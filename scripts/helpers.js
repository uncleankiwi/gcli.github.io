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

//Animate the "rainbow" span itself, and also any of its children. Grandchildren and onwards aren't animated.
export function animColour(application, lastUpdated) {
	let elements = document.getElementsByClassName("rainbow");
	for (let i = 0; i < elements.length; i++) {
		animateNode(elements[i], application, lastUpdated);
		let children = elements[i].children;
		for (let j = 0; j < children.length; j++) {
			animateNode(children[j], application, lastUpdated);
		}
	}
}

//We need the application since colour is stored per-application.
//Colour has to be stored because it gets overwritten every time the log refreshes -
//by storing the original colour, we can fetch whatever colour it is currently mutated to in the current frame.
//Current time is also a parameter of the method and stored in the map - if multiple nodes have the same colour,
//they should all have the same animation, i.e. the colour should not increment separately for each of them.
//If colour is not in map, put it in.
//If colour is in map and time is current, set colour to the map's value.
//Else, increment colour, then set colour to the map's value.
function animateNode(element, application, lastUpdated) {
	let cssColour = element.style.color;
	if (cssColour === "") {
		cssColour = window.getComputedStyle(element).getPropertyValue("color");
	}

	if (application.colourMap.has(cssColour)) {
		let value = application.colourMap.get(cssColour);
		if (value.time !== lastUpdated) {
			value.colour.increment(10);
			value.time = lastUpdated;
			// console.log(value.colour.raw);
		}
		element.style.color = value.colour.raw;
	}
	else {
		application.colourMap.set(cssColour, {time: lastUpdated, colour: new Colour(cssColour)});
	}

}

export function randomColour() {
	return `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`;
}

export function randomPastelColour() {
	return `rgb(${rand(200, 255)},${rand(128, 255)},${rand(128, 255)})`;
}

//Generates an integer between x and y
export function rand(x, y) {
	return Math.floor(x + Math.random() * (y - x + 1));
}

export function wrapRandomPastelColour(str) {
	return wrapColour(str, randomPastelColour());
}

export function wrapIndividualCharsWithRandomPastelColours(str) {
	let output = "";
	for (let i = 0; i < str.length; i++) {
		output += wrapRandomPastelColour(str.charAt(i));
	}
	return output;
}

export class Application {
	//Stores colours and whatever they're supposed to be transformed into.
	//Could theoretically get expensive if there are many nodes, each with a different colour.
	//But it shouldn't come to that, since this is stored per-application.
	colourMap = new Map();

	state = ApplicationState.OPEN;

	evaluate(command) {
		if (command === 'exit' || command === 'quit') {
			this.state = ApplicationState.CLOSE;
		}
	}

	redraw() {

	}

	prompt() {

	}
}