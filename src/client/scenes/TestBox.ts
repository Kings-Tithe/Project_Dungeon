import { rewireLoggingToElement } from '../tools/Console';

export class TestBox extends Phaser.Scene {
    create() {
        this.createConsole();
    }

    createConsole() {
        let container: HTMLDivElement = document.createElement('div');
        container.id = 'log-container';
        container.style.overflow = 'auto';
        container.style.height = '150px';
        container.style.backgroundColor = '#222';

        let outputText: HTMLPreElement = document.createElement('pre');
        outputText.id = 'log';
        container.appendChild(outputText);

        this.add.dom(300, 300, container);

        rewireLoggingToElement(() => outputText, () => container, true);

        for (let i = 0; i < 100; i++) {
            console.log(i);
        }
    }
}