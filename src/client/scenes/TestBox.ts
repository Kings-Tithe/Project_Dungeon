import { Console } from '../tools/Console';

export class TestBox extends Phaser.Scene {
    create() {
        this.createConsole();
    }

    createConsole() {
        let gameConsole = new Console(this);
        gameConsole.rewireAll();

        for (let i = 0; i < 100; i++) {
            console.log(i);
        }
    }
}