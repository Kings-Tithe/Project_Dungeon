import { rewireLoggingToElement } from '../tools/Console';
import { px, py } from '../tools/PercentCoords';

export class TestBox extends Phaser.Scene {
    create() {
        this.createConsole();
    }

    createConsole() {
        let container: HTMLDivElement = document.createElement('div');
        container.id = 'log-container';
        container.style.overflow = 'auto';
        container.style.width = '300px';
        container.style.height = '150px';
        container.style.backgroundColor = '#222';

        let highlighting: HTMLStyleElement = document.createElement('style');
        highlighting.type = 'text/css';
        highlighting.innerHTML = ".log-warn { color: orange } \
        .log-error { color: red } \
        .log-info { color: skyblue } \
        .log-log { color: silver } \
        .log-warn, .log-error { font-weight: bold; }"
        container.appendChild(highlighting)

        let outputText: HTMLPreElement = document.createElement('pre');
        outputText.id = 'log';
        container.appendChild(outputText);

        this.add.dom(px(100) - 150, py(100) - 75, container);

        rewireLoggingToElement(() => outputText, () => container, true);

        for (let i = 0; i < 100; i++) {
            console.log(i);
        }
    }
}