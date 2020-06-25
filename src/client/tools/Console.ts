import { hookToMethod } from "./Hook";
import { SignalManager } from "./SignalManager";
import { Hud } from "../scenes/overlays/Hud";

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
    private hud: Hud;
    // the phaser dom object that references the html elements
    private dom: Phaser.GameObjects.DOMElement;

    // the <div> container element that holds ALL other console HTML elements
    private consoleEl: HTMLDivElement = null;
    // the <pre> output element which will contain actual logged items and text
    private logsEl: HTMLPreElement = null;
    // the <style> which handles syntax highlighting of the console's output
    private highlightEl: HTMLStyleElement = null;
    // the <style> which handles syntax highlighting of the console's output
    private inputEl: HTMLInputElement = null;
    // the <div> container element for the logs which also handles scrolling
    private outputEl: HTMLDivElement = null;

    // Emitter to communicate commands to scenes
    private signals: SignalManager;

    /**
     * Constructs a Console object
     * @param scene the scene this console object should be attached to
     */
    private constructor(hud: Hud) {
        this.hud = hud;
        // Create the HTML elements forming the game console
        this.create();
        // Add the console to it's scene
        this.dom = this.hud.add.dom(0, 0, this.consoleEl)
            .setScrollFactor(0).setOrigin(0, 0);
        // Starts off invisible
        this.dom.setVisible(false);
        // Rewire the console logging functions
        this.hookToAll();
        // Get an emitter to send commands through
        this.signals = SignalManager.get();
    }

    static get(hud: Hud) {
        //if an instance has not been made yet, create one
        if (instance == null) {
            instance = new Console(hud);
        }
        //as long as we have an instance, return it
        return instance;
    }

    /**
     * Handles creation of the Console HTML elements. These elements are added
     * to the Phaser Game in the constructor, so this shouldn't be confused 
     * with the create method on Phaser.Scene objects.
     * Creation is broken up into several individual create methods, this
     * method should just call those.
     */
    private create() {
        this.createConsoleElement();
        this.createOutputElement();
        this.createInputElement();
        this.createLogsElement();
        this.createHighlightElement();
    }

    /**
     * Creates container div element which the rest of the HTML is appended to.
     */
    private createConsoleElement() {
        // Create the console container if it does not already exist
        if (!this.consoleEl) {
            this.consoleEl = document.createElement('div');
            this.consoleEl.id = 'console-container';
            this.consoleEl.style.textAlign = 'center';
            this.consoleEl.style.width = '100%';
            this.consoleEl.style.height = '30%';
            this.consoleEl.style.borderRadius = '5px';
            this.consoleEl.style.backgroundColor = '#343434';
        }
    }

    /**
     * Creates a style element to handle syntax highlighting in the console.
     */
    private createHighlightElement() {
        // Create style element that handles highlighting if it does not exist
        if (!this.highlightEl) {
            this.highlightEl = document.createElement('style');
            this.highlightEl.type = 'text/css';
            this.highlightEl.innerHTML = ".log-warn { color: orange } \
            .log-error { color: red } \
            .log-info { color: skyblue } \
            .log-log { color: silver } \
            .log-warn, .log-error { font-weight: bold; }";
            this.outputEl.appendChild(this.highlightEl);
        }
    }

    /**
     * Creates an input elements to let the users type into.
     */
    private createInputElement() {
        // Create input element that handles commands if it does not exist
        if (!this.inputEl) {
            this.inputEl = document.createElement('input');
            this.inputEl.style.width = '99%';
            this.inputEl.type = 'text';
            this.consoleEl.appendChild(this.inputEl);

            // When the ENTER/RETURN key is pressed, this event fires.
            this.inputEl.onkeypress = (ev: KeyboardEvent) => {
                // If key is ENTER/RETURN
                if (ev.which == 13) {
                    // Log the command entered
                    console.log(this.inputEl.value);
                    // Handle any command behavior
                    this.onCommand(this.inputEl.value);
                    // Clear the input text
                    this.inputEl.value = '';
                }
            };

        }
    }

    /**
     * Creates an elements which actually displays the text of logged items.
     */
    private createLogsElement() {
        // Create the output text element if it does not already exist
        if (!this.logsEl) {
            this.logsEl = document.createElement('pre');
            this.logsEl.id = 'log';
            this.outputEl.appendChild(this.logsEl);
        }
    }

    /**
     * Creates the container for output logs.
     */
    private createOutputElement() {
        // Create the output container if it does not already exist
        if (!this.outputEl) {
            this.outputEl = document.createElement('div');
            this.outputEl.id = 'log-container';
            // How this element is displayed inside the parent container
            this.outputEl.style.backgroundColor = '#222';
            this.outputEl.style.display = 'inline-block';
            this.outputEl.style.width = '100%';
            this.outputEl.style.height = '86%';
            // How elements inside this container are displayed
            this.outputEl.style.overflow = 'auto';
            this.outputEl.style.textAlign = 'left';
            this.outputEl.style.paddingLeft = '5px';
            // Append this element to it's parent
            this.consoleEl.appendChild(this.outputEl);
        }
    }

    private onCommand(commandLine: String) {
        this.signals.emit('command', commandLine.split(' '));
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
     * Toggles whether or not the console is visible and interactable.
     * @param gameInput An object containing a boolean which can be disabled to
     * disable game inputs. Should stop the character from being moved while
     * typing in the console. This method will eventually be deprecated with
     * better control management schemes.
     */
    toggleDisplay(gameInput: { enabled: Boolean }) {
        // If the dom elements are visible, we're closing the console
        if (this.dom.visible) {
            // Unfocus and clear the text from the input
            this.inputEl.value = '';
            this.inputEl.blur();
            // Hide the dom elements
            this.dom.setVisible(false);
            // Enable game input so that it can capture keys for control
            gameInput.enabled = true;
        }
        // If the dom elements are not visible, we're opening the console
        else {
            // Show the dom elements
            this.dom.setVisible(true);
            // Disable the game input so that it doesn't capture keys
            gameInput.enabled = false;
            // Focus on the input box so the player types in it without having
            // to click on it first. Has to be on a timer b/c it takes a moment
            // to ready the HTML
            setTimeout(() => { this.inputEl.focus() }, 30);
        }
    }

    /**
     * Redirects the output of all major console output functions to
     * HTML game console as well as browser debug console.
     */
    private hookToAll() {
        this.hookToConsoleFunc('log');
        this.hookToConsoleFunc('debug');
        this.hookToConsoleFunc('warn');
        this.hookToConsoleFunc('error');
        this.hookToConsoleFunc('info');
    }

    /**
     * Redirects the output of some console function to appear both in the
     * browser console and some HTML elements which form the game's console
     * @param consoleFuncName the name of the console function to redirect to
     * HTML output
     */
    private hookToConsoleFunc(consoleFuncName: string) {

        // We hook onto the console function with new HTML logging function
        hookToMethod(console, consoleFuncName,
            /**
             * The new console function which outputs to the HTML-elements
             * which form the game console.
             * @param ret the value returned from the original function, this
             * is sent to any hooked functions in case they need it for their
             * additional behavior.
             * @param args the objects to output as log, error, etc...
             */
            (ret: any, ...args: any[]) => {
                // get HTML span tags of the objects
                const output = this.htmlLog(consoleFuncName, args);
                // add the html <span> texts to the <pre> output element
                this.logsEl.innerHTML += output + "<br>";

                // determine if game console is currently scrolled to the bottom
                const bottomed =
                    this.outputEl.scrollHeight
                    - this.outputEl.clientHeight
                    <= this.outputEl.scrollTop + 1;
                // automatically scroll to the bottom when new console output
                // is created
                if (!bottomed) {
                    this.outputEl.scrollTop =
                        this.outputEl.scrollHeight
                        - this.outputEl.clientHeight;
                }
            });

    };

    /**
     * Produces an HTML formatted string of tags containing logged objects
     * @param consoleFunc the console function this output is for (syntax
     * highlighting relies on this)
     * @param args a list of any loggable objects or values
     * @return an HTML formatted string of <span> tags
     */
    htmlLog(consoleFuncName: string, args: any[]): String {
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

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: Console = null;