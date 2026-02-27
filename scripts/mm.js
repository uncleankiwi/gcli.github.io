import { Application, ApplicationState, wrapColour, wrapCharsWithPastelAndRainbow, parseNumberFromUserOptions, rand } from "./helpers.js";
import { clearLog, LogNode, printLine } from "./bash.js";
import { AppOption } from "./util/AppOption.js";
var MMState;
(function (MMState) {
    MMState[MMState["TITLE"] = 0] = "TITLE";
    MMState[MMState["CHOOSE_COLOURS"] = 1] = "CHOOSE_COLOURS";
    MMState[MMState["CHOOSE_CHANCES"] = 2] = "CHOOSE_CHANCES";
    MMState[MMState["CHOOSE_PLACES"] = 3] = "CHOOSE_PLACES";
    MMState[MMState["IN_PROGRESS"] = 4] = "IN_PROGRESS";
    MMState[MMState["DONE"] = 5] = "DONE";
})(MMState || (MMState = {}));
class MMGameData {
    constructor() {
        this.colours = 4;
        this.chances = 6;
        this.places = 4;
        this.won = false;
        this.lost = false;
        this.answer = []; //Holds the answer.
        this.attemptCount = 0;
        this.attempts = []; //Holds the attempts; each attempt is also a [];
        this.grades = []; //Holds the grades for each attempt; each grade is also a [];
    }
    chancesLeft() {
        return this.chances - this.attemptCount;
    }
    pickNumbers() {
        for (let i = 0; i < this.places; i++) {
            this.answer[i] = rand(1, this.colours);
        }
    }
    //Parse the first 'places' non-space characters and puts them in an array.
    parseDigits(inputString) {
        let output = [];
        let stringIndex = 0;
        for (let arrIndex = 0; arrIndex < this.places; arrIndex++) {
            //If input string is too short for the answer, fill the rest of the places with '?'.
            if (stringIndex >= inputString.length) {
                output[arrIndex] = '?';
            }
            else {
                //Put the character in and skip any spaces.
                if (inputString.charAt(stringIndex) !== ' ') {
                    let k = parseInt(inputString.charAt(stringIndex));
                    if (Number.isNaN(k)) {
                        output[arrIndex] = inputString.charAt(stringIndex);
                    }
                    else {
                        output[arrIndex] = k;
                    }
                }
                else {
                    arrIndex--;
                }
                stringIndex++;
            }
        }
        this.attempts[this.attemptCount - 1] = output;
    }
    //If any character is not a digit within maxColours and minColours, return null.
    //This is for balance purposes - the user could just enter invalid characters to guess particular
    //positions and colours otherwise.
    grade() {
        //Checking if every input is valid
        let previousGrade = [];
        let previousAttempt = this.attempts[this.attemptCount - 1];
        let attemptMap = new Map();
        let answerMap = new Map();
        let correctColourAndPos = 0;
        let correctColour = 0;
        for (let i = 0; i < this.places; i++) {
            let attemptToken = previousAttempt[i];
            if (typeof (attemptToken) === "number" && attemptToken >= 1 && attemptToken <= this.colours) {
                let answerToken = this.answer[i];
                if (attemptToken === answerToken) {
                    //Go through each position, and if it's correct, increment correctColourAndPos.
                    correctColourAndPos++;
                }
                else {
                    //If it's not an exact match, put the token in the attempt and the answer into a map.
                    this.incrementMap(attemptMap, attemptToken);
                    this.incrementMap(answerMap, answerToken);
                }
            }
            else {
                //Bumped into an invalid output, so dump everything.
                previousGrade = null;
                break;
            }
        }
        //Increment correctColour based on the two maps.
        if (previousGrade != null) {
            attemptMap.forEach(function (value, key) {
                if (typeof (key) === "number" && answerMap.has(key)) {
                    correctColour += Math.min(value, answerMap.get(key));
                }
            });
            previousGrade = [correctColourAndPos, correctColour];
        }
        this.grades[this.attemptCount - 1] = previousGrade;
        //Check if round is won.
        if (correctColourAndPos >= this.places) {
            this.won = true;
        }
        //Check if user is out of turns and did not win i.e. round is lost.
        else if (this.attemptCount >= this.chances) {
            this.lost = true;
        }
    }
    incrementMap(map, k) {
        if (map.has(k)) {
            map.set(k, map.get(k) + 1);
        }
        else {
            map.set(k, 1);
        }
    }
}
MMGameData.minColours = 1;
MMGameData.maxColours = 9;
MMGameData.minChances = 1;
MMGameData.maxChances = 18; //Display height 20 - statusRow - prompt
MMGameData.minPlaces = 1;
MMGameData.maxPlaces = 9;
export class mm extends Application {
    get setupStringPossibleColours() {
        return "Enter 'd' to start with default settings, " +
            "or enter a number from 1-9 for the number of token types. " +
            "(Default: " + this.colours + ")";
    }
    get setupStringPlaces() {
        return "Enter a number from 1-9 for the number of tokens. " +
            "(Default: " + this.tokens + ")";
    }
    get setupStringChances() {
        return "Enter a number from 1-20 for the number of tries. " +
            "(Default: " + this.tries + ")";
    }
    constructor(args) {
        super(args);
        this.gameState = MMState.TITLE;
        this.gameData = new MMGameData();
        this.colours = 6;
        this.tries = 10;
        this.tokens = 4;
        this.randomColours = false;
        this.alwaysPrompt = false;
        this.userColours = Array(mm.defaultColours.length);
        this.titleString = "Press Enter to begin, or 'q' to quit.";
        this.inProgressString1 = "Enter "; //+ this.gameData.places
        this.inProgressString2 = " digits from 1 to "; // + this.gameData.colours
        this.inProgressString3 = " : ";
        this.winString = wrapCharsWithPastelAndRainbow("You win!");
        this.loseString = wrapColour("You lose...", "#555555");
        this.nextGameString = "Press Enter to begin another game, or 'q' to quit.";
        this.initColours();
        //Read options set by user
        let parsedColour = parseNumberFromUserOptions(this.userArgs, "c", 0);
        if (parsedColour >= MMGameData.minColours && parsedColour <= MMGameData.maxColours) {
            this.colours = parsedColour;
        }
        let parsedTries = parseNumberFromUserOptions(this.userArgs, "t", 0);
        if (parsedTries >= MMGameData.minChances && parsedTries <= MMGameData.maxChances) {
            this.tries = parsedTries;
        }
        let parsedTokens = parseNumberFromUserOptions(this.userArgs, "w", 0);
        if (parsedTokens >= MMGameData.minPlaces && parsedTokens <= MMGameData.maxPlaces) {
            this.tokens = parsedTokens;
        }
        this.randomColours = this.userArgs.get("r");
        this.alwaysPrompt = this.userArgs.get("p");
        this.newGame(false, false);
    }
    initColours() {
        let i = mm.defaultColours.length;
        while (i--) {
            this.userColours[i] = mm.defaultColours[i];
        }
    }
    //Shuffles the colours between indices 1 and the end of the array.
    //Index 0 isn't shuffled because that's the default grey.
    shuffleColours() {
        for (let i = 1; i < this.userColours.length; i++) {
            let newIndex = rand(1, this.userColours.length - 1);
            let temp = this.userColours[i];
            this.userColours[i] = this.userColours[newIndex];
            this.userColours[newIndex] = temp;
        }
    }
    getAppOptions() {
        return [
            new AppOption("c", "Number of colours (1-" + MMGameData.maxColours + ")", "CLRS"),
            new AppOption("t", "Number of tries (1-" + MMGameData.maxChances + ")", "TRIES"),
            new AppOption("w", "Number of tokens (1-" + MMGameData.maxPlaces + ")", "TOKENS"),
            new AppOption("r", "Randomize token colours every game"),
            new AppOption("p", "Show settings prompt every game")
        ];
    }
    evaluate(command) {
        super.evaluate(command);
        if (this.state === ApplicationState.CLOSE) {
            clearLog();
            printLine("mm closing.");
            return;
        }
        switch (this.gameState) {
            case MMState.TITLE:
                clearLog();
                if (command === 'q') {
                    this.state = ApplicationState.CLOSE;
                    return;
                }
                else {
                    this.gameData = new MMGameData();
                    this.gameState = MMState.CHOOSE_COLOURS;
                }
                break;
            case MMState.CHOOSE_COLOURS:
                if (command === 'd') {
                    this.gameData.pickNumbers();
                    this.gameState = MMState.IN_PROGRESS;
                    clearLog();
                    return;
                }
                let x = parseInt(command);
                if (x >= MMGameData.minColours && x <= MMGameData.maxColours) {
                    this.colours = x;
                }
                this.gameState = MMState.CHOOSE_CHANCES;
                break;
            case MMState.CHOOSE_CHANCES:
                let y = parseInt(command);
                if (y >= MMGameData.minChances && y <= MMGameData.maxChances) {
                    this.tries = y;
                }
                this.gameState = MMState.CHOOSE_PLACES;
                break;
            case MMState.CHOOSE_PLACES:
                let z = parseInt(command);
                if (z >= MMGameData.minPlaces && z <= MMGameData.maxPlaces) {
                    this.tokens = z;
                }
                this.newGame(false, true);
                break;
            case MMState.IN_PROGRESS:
                this.gameData.attemptCount++;
                this.gameData.parseDigits(command);
                this.gameData.grade();
                if (this.gameData.won || this.gameData.lost) {
                    this.gameState = MMState.DONE;
                }
                clearLog();
                this.printState();
                break;
            case MMState.DONE:
                clearLog();
                if (command === 'q') {
                    this.state = ApplicationState.CLOSE;
                    return;
                }
                else {
                    this.newGame(true, false);
                }
                break;
            default:
                throw "Unknown game state at prompt(): " + this.gameState;
        }
    }
    prompt() {
        switch (this.gameState) {
            case MMState.TITLE:
                return [this.titleString];
            case MMState.CHOOSE_COLOURS:
                return [this.setupStringPossibleColours];
            case MMState.CHOOSE_CHANCES:
                return [this.setupStringChances];
            case MMState.CHOOSE_PLACES:
                return [this.setupStringPlaces];
            case MMState.IN_PROGRESS:
                return [this.inProgressString1 + this.gameData.places + this.inProgressString2
                        + this.gameData.colours + this.inProgressString3];
            case MMState.DONE:
                let output = [];
                if (this.gameData.won) {
                    output.push(this.winString);
                }
                else if (this.gameData.lost) {
                    output.push(this.loseString);
                }
                output.push(" ");
                output.push(this.nextGameString);
                return output;
            default:
                throw "Unknown game state at prompt(): " + this.gameState;
        }
    }
    //Creates a new MMGameData object with default settings, sets state to IN_PROGRESS, shuffles colours.
    newGame(createData, mustStartNow) {
        if (createData) {
            this.gameData = new MMGameData();
        }
        this.gameData.colours = this.colours;
        this.gameData.chances = this.tries;
        this.gameData.places = this.tokens;
        if (this.randomColours) {
            this.shuffleColours();
        }
        clearLog();
        if (this.alwaysPrompt && !mustStartNow) {
            this.gameState = MMState.CHOOSE_COLOURS;
        }
        else {
            this.gameData.pickNumbers();
            this.printState();
            this.gameState = MMState.IN_PROGRESS;
        }
    }
    redraw() {
        super.redraw();
    }
    //Print out all attempts so far and their grade, plus the attemptsCount at the bottom.
    printState() {
        for (let i = 0; i < this.gameData.attemptCount; i++) {
            let row = "";
            let attempt = this.gameData.attempts[i];
            let grade = this.gameData.grades[i];
            for (let j = 0; j < attempt.length; j++) {
                row += this.wrapToken(attempt[j]) + " ";
            }
            row += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            if (grade === null) {
                row += "Invalid input";
            }
            else {
                row += grade[0] + "✓ " + grade[1] + "×";
            }
            printLine(row);
        }
        let strStats = this.gameData.chancesLeft() + " chances left.";
        //Print out the rest of the blank rows
        let blankRow = Array(this.gameData.places).fill("-").join(" ");
        for (let i = 0; i < this.gameData.chancesLeft(); i++) {
            printLine(blankRow);
        }
        if (this.gameData.lost) {
            strStats += " Answer: " + this.gameData.answer;
        }
        printLine(strStats);
    }
    wrapToken(k) {
        return wrapColour(k, this.colourFromNumber(k));
    }
    colourFromNumber(k) {
        if (typeof (k) === "number" && k <= MMGameData.maxColours && k >= MMGameData.minColours) {
            return this.userColours[k];
        }
        else {
            return this.userColours[0];
        }
    }
}
mm.shortHelp = "That colour-guessing game.";
mm.longHelp = ["Guess a combination of colours within a number",
    "of tries."];
mm.defaultColours = ["#555555",
    "#aaaa55", "#aa55aa", "#55aaaa",
    "#55aa55", "#aa5555", "#5555aa",
    "#ff00aa", "#aaff00", "#00aaff"];
