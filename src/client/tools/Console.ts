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
    // the <div> container element that holds ALL other console HTML elements
    static consoleEl: HTMLDivElement = null;
    // the <pre> output element which will contain actual logged items and text
    static logsEl: HTMLPreElement = null;
    // the <style> which handles syntax highlighting of the console's output
    static highlightEl: HTMLStyleElement = null;
    // the <style> which handles syntax highlighting of the console's output
    static inputEl: HTMLInputElement = null;
    // the <div> container element for the logs which also handles scrolling
    static outputEl: HTMLDivElement = null;

    /**
     * Constructs a Console object
     * @param scene the scene this console object should be attached to
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        // Create the HTML elements forming the game console
        this.create();
        // Add the console to it's scene
        this.dom = this.scene.add.dom(0, 0, Console.consoleEl)
            .setScrollFactor(0).setOrigin(0, 0);
    }

    create() {
        this.createConsoleElement();
        this.createOutputElement();
        this.createInputElement();
        this.createLogsElement();
        this.createHighlightElement();
    }

    createConsoleElement() {
        // Create the console container if it does not already exist
        if (!Console.consoleEl) {
            Console.consoleEl = document.createElement('div');
            Console.consoleEl.id = 'console-container';
            Console.consoleEl.style.textAlign = 'center';
            Console.consoleEl.style.width = '100%';
            Console.consoleEl.style.height = '30%';
            Console.consoleEl.style.borderRadius = '5px';
            Console.consoleEl.style.backgroundColor = '#343434';
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
            Console.outputEl.appendChild(Console.highlightEl);
        }
    }

    createInputElement() {
        // Create input element that handles commands if it does not exist
        if (!Console.inputEl) {
            Console.inputEl = document.createElement('input');
            Console.inputEl.style.width = '99%';
            Console.inputEl.type = 'text';
            Console.consoleEl.appendChild(Console.inputEl);
            document.onkeypress = (ev: KeyboardEvent) => {
                if (ev.which == 13) {
                    console.log(Console.inputEl.value);
                    Console.inputEl.value = '';
                }
            };
        }
    }

    createLogsElement() {
        // Create the output text element if it does not already exist
        if (!Console.logsEl) {
            Console.logsEl = document.createElement('pre');
            Console.logsEl.id = 'log';
            Console.outputEl.appendChild(Console.logsEl);
        }
    }

    createOutputElement() {
        // Create the output container if it does not already exist
        if (!Console.outputEl) {
            Console.outputEl = document.createElement('div');
            Console.outputEl.id = 'log-container';
            // How this element is displayed inside the parent container
            Console.outputEl.style.backgroundColor = '#222';
            Console.outputEl.style.display = 'inline-block';
            Console.outputEl.style.width = '100%';
            Console.outputEl.style.height = '86%';
            // How elements inside this container are displayed
            Console.outputEl.style.overflow = 'auto';
            Console.outputEl.style.textAlign = 'left';
            Console.outputEl.style.paddingLeft = '5px';
            // Append this element to it's parent
            Console.consoleEl.appendChild(Console.outputEl);
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
            Console.logsEl.innerHTML += output + "<br>";

            // determine if game console is currently scrolled to the bottom
            const bottomed =
                Console.outputEl.scrollHeight
                - Console.outputEl.clientHeight
                <= Console.outputEl.scrollTop + 1;
            // automatically scroll to the bottom when new console output
            // is created
            if (!bottomed) {
                Console.outputEl.scrollTop =
                    Console.outputEl.scrollHeight
                    - Console.outputEl.clientHeight;
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