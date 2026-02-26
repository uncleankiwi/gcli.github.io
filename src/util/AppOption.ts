import {spaces} from "../helpers.js";

export class AppOption {
	option: string | undefined;
	param: string | undefined;
	description: string;	//Explains this option in help.
	hidden: boolean;		//Should this option be listed in `help <appName>` in bash?

	constructor(option: string | undefined, description: string, param?: string, hidden: boolean = false) {
		this.option = option;
		this.description = description;
		this.param = param;
		this.hidden = hidden;
	}

	//Gets a short one-liner version of the options.
	// [-bc] [-a param] PARAM
	static getOptionsString(options: AppOption[]): string | undefined {
		if (options === undefined || options.length === 0) {
			return undefined;
		}
		let noParamOptions:string = "";
		let paramOptions: AppOption[] = [];
		let onlyParam: string[] = [];
		options.forEach(x => {
			if (x.param === undefined && x.option !== undefined) {
				noParamOptions += x.option;
			}
			else if (x.option !== undefined && x.param !== undefined) {
				paramOptions.push(x);
			}
			else if (x.option === undefined && x.param !== undefined) {
				onlyParam.push(`[${x.param}]`);
			}
		});
		let output: string[] = [];
		if (noParamOptions.length > 0) {
			output.push(`[-${noParamOptions}]`);
		}
		paramOptions.forEach(x => {
			output.push(`[-${x.option} ${x.param}]`);
		});
		output = output.concat(onlyParam);
		return output.join(" ");
	}

	/*
	Lists them like this (starting indentation is handled by help application):
	Note that params are omitted - those are handled by listArguments()
	  -a param	some explanation.
	  -b 		more text.
	  -c		some more text.
	Between option and description should be space + longestParam worth of spaces + tab
	 */
	static listOptions(options: AppOption[]): string[] | undefined {
		if (options === undefined || options.length === 0) {
			return undefined;
		}
		//Finding longest param to see how many spaces should be padded in between option and description.
		//Also, find out how many non-argument options there are.
		let longestParam = 0;
		let nonArgOptionCount = 0;
		options.forEach(x => {
			if (x.option === undefined ) {
				return;
			}
			else {
				nonArgOptionCount++;
			}
			if (x.param !== undefined && x.param.length > longestParam) {
				longestParam = x.param.length;

			}
		});

		if (nonArgOptionCount === 0) {
			return undefined;
		}

		//Now actually building options list
		let output: string[] = [];
		options.forEach(x => {
			if (x.option === undefined) {
				return;	//This is an argument.
			}
			let paramString = x.param ?? "";
			let paramSpaces = spaces(longestParam - paramString.length + 2);
			output.push(`-${x.option} ${paramString}${paramSpaces}${x.description}`);
		});
		return output;
	}

	/*
	Lists them like this (starting indentation is handled by help application):
	As before, note that options are omitted - those are handled by listOptions()
	  PARAM1	some explanation.
	  PARAM2	more text.
	Between PARAM and description should be space + longestParam worth of spaces + tab
	 */
	static listArguments(options: AppOption[]): string[] | undefined {
		if (options === undefined || options.length === 0) {
			return undefined;
		}
		//Finding longest param to see how many spaces should be padded in between option and description.
		let longestParam = 0;
		let argOptionCount = 0;
		options.forEach(x => {
			if (x.option !== undefined) {
				return;
			}
			else {
				argOptionCount++;
			}
			if (x.param !== undefined && x.param.length > longestParam) {
				longestParam = x.param.length;
			}
		});

		if (argOptionCount === 0) {
			return undefined;
		}

		//Now actually building options list
		let output: string[] = [];
		options.forEach(x => {
			if (x.option !== undefined) {
				return;
			}
			let paramString = x.param ?? "";
			let paramSpaces = spaces(longestParam - paramString.length + 2);
			output.push(`${paramString}${paramSpaces}${x.description}`);
		});
		return output;
	}
}