/*
Requirements:
    - Get random word of length d, of rarity r1~r2 with getRandomWord(int d, int r1, int r2)
    - Get random word of random length, of rarity r1~r2 with getRandomLengthWord(int r1, int r2)
        Every word in the range r1~r2 should have an equal chance of getting chosen, independent of word length.
    - Check if word w is present within rarity r1~r2 with isWord(String w, int r1, int r2)
 */
import { WordGroup } from "./WordGroup.js";
import { rand } from "../helpers.js";
export class Dictionary {
    static async init() {
        if (Dictionary.initialized) {
            return;
        }
        let data = await Dictionary.loadDictionary();
        Dictionary.rawDictionary = new Map(Object.entries(data));
        this.wordGroups = [];
        Dictionary.rawDictionary.forEach(function (value, key) {
            let set = new Set(value);
            let rarity = parseInt(key);
            if (Dictionary.wordGroups[rarity] === undefined) {
                Dictionary.wordGroups[rarity] = [];
            }
            set.forEach(w => {
                if (Dictionary.wordGroups[rarity][w.length] === undefined) {
                    Dictionary.wordGroups[rarity][w.length] = new WordGroup();
                }
                Dictionary.wordGroups[rarity][w.length].add(w);
            });
        });
        Dictionary.initialized = true;
    }
    static async loadDictionary() {
        return fetch("./resources/dictionary.json")
            .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}: failed to load dictionary.json`);
            }
            return response.json();
        });
    }
    //Get random word of length l, of rarity c1~c2 with getRandomWord(int d, int c1, int c2)
    static getRandomWord(l, r1, r2) {
        let arrGroups = [];
        let arrCumulative = [];
        let cumulative = 0;
        for (let i = r1; i <= r2; i++) {
            let group = Dictionary.wordGroups[i][l];
            if (group !== undefined) {
                arrGroups.push(group);
                cumulative += group.size();
                arrCumulative.push(cumulative);
            }
        }
        return Dictionary.findRandomWordInArrays(arrGroups, arrCumulative, cumulative);
    }
    // - Get random word of random length, of rarity c1~c2 with getRandomLengthWord(int c1, int c2)
    // 		Every word in the range r1~r2 should have an equal chance of getting chosen, independent of word length.
    static getRandomLengthWord(r1, r2) {
        let arrGroups = [];
        let arrCumulative = [];
        let cumulative = 0;
        for (let i = r1; i <= r2; i++) {
            for (let j = 0; j < Dictionary.wordGroups[i].length; j++) {
                let group = Dictionary.wordGroups[i][j];
                if (group !== undefined) {
                    arrGroups.push(group);
                    cumulative += group.size();
                    arrCumulative.push(cumulative);
                }
            }
        }
        return Dictionary.findRandomWordInArrays(arrGroups, arrCumulative, cumulative);
    }
    //Given an array of WordGroups, an array of cumulative number of words in those groups, and the total
    //number of words in all of them, get a random word.
    static findRandomWordInArrays(arrGroups, arrCumulative, cumulative) {
        let result = rand(0, cumulative - 1); //-1 because it's the array index
        for (let i = 0; i < arrCumulative.length; i++) {
            if (arrCumulative[i] >= result) {
                return arrGroups[i].randomWord();
            }
        }
        throw Error("Error finding a random word using findRandomWordInArrays()");
    }
    //Check if word w is present within rarity r1~r2 with isWord(String w, int r1, int r2)
    static isWord(w, r1, r2) {
        let isWord = false;
        for (let i = r1; i <= r2; i++) {
            isWord = Dictionary.wordGroups[i][w.length]?.isWord(w) ?? false;
            if (isWord) {
                break;
            }
        }
        return isWord;
    }
    //Return the length of the longest word(s) present within range r1~r2. If no words, return undefined.
    static longestLength(r1, r2) {
        let longest = 0;
        for (let rarity = r1; rarity <= r2; rarity++) {
            //NB: subtract 1 because length 1 words go in [1].
            let longestLengthInRarity = Dictionary.wordGroups[rarity].length - 1;
            if (longestLengthInRarity > longest) {
                longest = longestLengthInRarity;
            }
        }
        if (longest === 0) {
            return undefined;
        }
        else {
            return longest;
        }
    }
}
Dictionary.initialized = false;
Dictionary.LOWEST_RARITY = 0;
Dictionary.HIGHEST_RARITY = 7;
