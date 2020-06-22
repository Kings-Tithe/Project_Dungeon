import { px, py } from "./PercentCoords";
import { hookToMethod } from "./Hook";

/**
 * In game console with output of error messages, feedback, and command inputs
 * for development (or cheating I guess)
 * Contains methods to manipulate the game console and rewire output from
 * the browser console to the game console.
 * 
 * Credit:
 * I used a solution made by Stack Overflow user Benny Bottema for redirecting
 * console output to HTML elements. Linked below is the question on
 * Stack Overflow, and the user's profile.
 * https://stackoverflow.com/questions/20256760/javascript-console-log-to-html
 * https://stackoverflow.com/users/441662/benny-bottema
 */
export class Console {

    // the scene this console object should be attached to
    scene: Phaser.Scene;
    // the phaser dom object that references the html elements
    dom: Phaser.GameObjects.DOMElement;

    // static HTML elements that are created once and re-used
    // the <pre> output element which will contain console output
    static outputEl: HTMLPreElement = null;
    // the <div> which contains the output element, handles scrolling, and
    // determines the consoles size and stlying in game
    static containerEl: HTMLDivElement = null;
    // the <style> which handles syntax highlighting of the console's output
    static highlightEl: HTMLStyleElement = null;
    // the <style> which handles syntax highlighting of the console's output
    static inputEl: HTMLInputElement = null;

    /**
     * Constructs a Console object
     * @param scene the scene this console object should be attached to
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        // Create the HTML elements forming the game console
        this.create();
        // Add the console to it's scene
        this.dom = this.scene.add.dom(px(100), py(100), Console.containerEl)
            .setScrollFactor(0).setOrigin(1, 1);
    }

    create() {
        this.createContainerElement();
        this.createOutputElement();
        this.createInputElement();
        this.createHighlightElement();
    }

    createContainerElement() {
        // Create the output container if it does not already exist
        if (!Console.containerEl) {
            Console.containerEl = document.createElement('div');
            Console.containerEl.id = 'log-container';
            Console.containerEl.style.overflow = 'auto';
            Console.containerEl.style.width = '300px';
            Console.containerEl.style.height = '150px';
            Console.containerEl.style.backgroundColor = '#222';
        }
    }

    createHighlightElement() {
        // Create style element that handles highlighting if it does not exist
        if (!Console.highlightEl) {
            Console.highlightEl = document.createElement('style');
            Console.highlightEl.type = 'text/css';
            Console.highlightEl.innerHTML = ".log-warn { color: orange } \
            .log-error { color: red } \
            .log-info { color: skyblue } \
            .log-log { color: silver } \
            .log-warn, .log-error { font-weight: bold; }";
            Console.containerEl.appendChild(Console.highlightEl);
        }
    }

    createInputElement() {
        // Create input element that handles commands if it does not exist
        if (!Console.inputEl) {
            Console.inputEl = document.createElement('input');
            Console.inputEl.type = 'text';
            Console.containerEl.appendChild(Console.inputEl);
            document.onkeypress = (ev: KeyboardEvent) => {
                if (ev.which == 13) {
                    console.log(Console.inputEl.value);
                    Console.inputEl.value = '';
                }
            };
        }
    }

    createOutputElement() {
        // Create the output text element if it does not already exist
        if (!Console.outputEl) {
            Console.outputEl = document.createElement('pre');
            Console.outputEl.id = 'log';
            Console.containerEl.appendChild(Console.outputEl);
        }
    }

    /**
     * Sets the origin point of the DOM elements
     * @param x coordinate
     * @param y coordinate
     */
    setPosition(x: number, y: number) {
        this.dom.setPosition(x, y);
    }

    /**
     * Scales the DOM elements by a given factor
     * @param scale the factor to scale by
     */
    setScale(scale: number) {
        this.dom.setScale(scale);
    }

    /**
     * Redirects the output of all major console output functions to
     * HTML game console as well as browser debug console.
     */
    rewireAll() {
        this.rewireConsoleFunc('log');
        this.rewireConsoleFunc('debug');
        this.rewireConsoleFunc('warn');
        this.rewireConsoleFunc('error');
        this.rewireConsoleFunc('info');
    }

    /**
     * Redirects the output of some console function to appear both in the
     * browser console and some HTML elements which form the game's console
     * @param consoleFuncName the name of the console function to redirect to
     * HTML output
     */
    rewireConsoleFunc(consoleFuncName: string) {
        // store the old version of the console function
        console['_old_' + consoleFuncName] = console[consoleFuncName];

        /**
         * The new console function which outputs to both the browser console
         * and to the game console (in HTML)
         * @param args the objects to output as log, error, etc...
         */
        console[consoleFuncName] = function (...args: any[]) {
            // get HTML span tags of the objects
            const output = Console.htmlLog(consoleFuncName, args);
            // add the html <span> texts to the <pre> output element
            Console.outputEl.innerHTML += output + "<br>";

            // determine if game console is currently scrolled to the bottom
            const bottomed =
                Console.containerEl.scrollHeight
                - Console.containerEl.clientHeight
                <= Console.containerEl.scrollTop + 1;
            // automatically scroll to the bottom when new console output
            // is created
            if (!bottomed) {
                Console.containerEl.scrollTop =
                    Console.containerEl.scrollHeight
                    - Console.containerEl.clientHeight;
            }

            // run the old function too, to print to the console
            console['_old_' + consoleFuncName].apply(undefined, args);
        };

    };

    /**
     * Produces an HTML formatted string of tags containing logged objects
     * @param consoleFunc the console function this output is for (syntax
     * highlighting relies on this)
     * @param args a list of any loggable objects or values
     * @return an HTML formatted string of <span> tags
     */
    static htmlLog(consoleFuncName: string, args: any[]): String {
        // reduce runs a provided function on each element of an array, with
        // the intention that that function should return a merge of each of
        // the two.
        // ['a','b','c','d'] => ['ab','c','d'] => ['abc', 'd'] => 'abcd'
        let combinedOutput = args.reduce((previousValue, currentValue) => {
            // we are adding to the previous value passed in (the current
            // combined total)
            let outputThisIteration = previousValue +
                // span tag, class corresponding with the type of variable
                "<span class=\"log-" + (typeof currentValue)
                // and logging function (consoleFuncName)
                + " log-" + consoleFuncName + "\">" +
                // check if the value is an object or primitive data
                (typeof currentValue === "object" && (JSON || {}).stringify ?
                    // add either json strings of objects or directly add
                    // primitive data to the resulting html string
                    JSON.stringify(currentValue) : currentValue) +
                // close the tag and spaces are nice
                "</span>&nbsp;";
            // send this current total to the next iteration of the reduction
            return outputThisIteration;
        }, '');
        // return the final output, an html string of span tags
        return combinedOutput;
    }
}