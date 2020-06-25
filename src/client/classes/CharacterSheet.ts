import { Console } from "../tools/Console";
import { EventGlobals } from "../tools/EventGlobals";
import { CENTER } from "../tools/Globals";

export class CharacterSheet {

    //member varibles

    //boolean
    /**This keep track of if the character sheet is currently visible */
    ToggleVisible: boolean;

    //sprites
    /**The portrait used in the character sheet */
    Portrait: Phaser.GameObjects.Sprite;
    /**The outline of a man used in the character sheet */
    outlineOfMan: Phaser.GameObjects.Sprite;

    //graphics
    /**This is the backdrop for the character sheet */
    Background: Phaser.GameObjects.Graphics;
    FocusBlock: Phaser.GameObjects.Graphics;
    EnduranceBlock: Phaser.GameObjects.Graphics;
    SpeedBlock: Phaser.GameObjects.Graphics;
    MightBlock: Phaser.GameObjects.Graphics;
    

    //text
    Name: Phaser.GameObjects.Text;
    Level: Phaser.GameObjects.Text;
    EXP: Phaser.GameObjects.Text;
    FocusLabel: Phaser.GameObjects.Text;
    EnduranceLabel: Phaser.GameObjects.Text;
    SpeedLabel: Phaser.GameObjects.Text;
    MightLebel: Phaser.GameObjects.Text;
    FocusText: Phaser.GameObjects.Text;
    EnduranceText: Phaser.GameObjects.Text;
    SpeedText: Phaser.GameObjects.Text;
    MightText: Phaser.GameObjects.Text;
    LifeText: Phaser.GameObjects.Text;
    EnergyText: Phaser.GameObjects.Text;
    BattleSpeedText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene){
        //inital values
        this.ToggleVisible = false;
        this.createCharacterSheet(scene);
    }

    /**Allows the linking of all the sprites and graghics to
     * a given scene, this class will most likely only ever be
     * used in the main hud scene so I doubt I'l need it but just
     * in case.
     */
    link(scene: Phaser.Scene){
        scene.add.existing(this.Background);
        scene.add.existing(this.Portrait);
        scene.add.existing(this.Name);
        scene.add.existing(this.Level);
        scene.add.existing(this.EXP);
        scene.add.existing(this.FocusLabel);
        scene.add.existing(this.EnduranceLabel);
        scene.add.existing(this.SpeedLabel);
        scene.add.existing(this.MightLebel);
        scene.add.existing(this.FocusBlock);
        scene.add.existing(this.EnduranceBlock);
        scene.add.existing(this.SpeedBlock);
        scene.add.existing(this.MightBlock);
        scene.add.existing(this.FocusText);
        scene.add.existing(this.EnduranceText);
        scene.add.existing(this.SpeedText);
        scene.add.existing(this.MightText);
        scene.add.existing(this.LifeText);
        scene.add.existing(this.EnergyText);
        scene.add.existing(this.BattleSpeedText);
        scene.add.existing(this.outlineOfMan);
    }

    createCharacterSheet(scene: Phaser.Scene){
        //create background
        this.Background = scene.add.graphics();
        this.Background.fillStyle(0xb06e27,1);
        this.Background.lineStyle(20,0x915b20,1)
        this.Background.strokeRoundedRect(CENTER.x - 200, CENTER.y - 300, 400, 600,20)
        this.Background.fillRoundedRect(CENTER.x - 200, CENTER.y - 300, 400, 600,20);
        this.Background.setScale(0);
        //create portrait
        this.Portrait = scene.add.sprite(CENTER.x - 180, CENTER.y - 280,"gregThePortrait");
        this.Portrait.setOrigin(0);
        this.Portrait.setScale(0);
        //create text config
        let textConfig = {
            fontSize: "20px",
            color: "#000000",
            fontFamily: 'Courier'
        }
        //create portrait side text
        this.Name = scene.add.text(570,100,"Greg the Test Dummy",textConfig);
        this.Name.setOrigin(0,.5);
        this.Name.setScale(0);
        this.Level = scene.add.text(570,125,"Level: 5",textConfig);
        this.Level.setOrigin(0,.5);
        this.Level.setScale(0);
        this.EXP = scene.add.text(570,150,"EXP: 3,486",textConfig);
        this.EXP.setOrigin(0,.5);
        this.EXP.setScale(0);
        //create stats labels
        this.FocusLabel = scene.add.text(490,215,"Focus:",textConfig);
        this.FocusLabel.setOrigin(.5,.5);
        this.FocusLabel.setScale(0);
        this.FocusLabel.setFontSize(16);
        this.EnduranceLabel = scene.add.text(590,215,"Endurance:",textConfig);
        this.EnduranceLabel.setOrigin(.5,.5);
        this.EnduranceLabel.setScale(0);
        this.EnduranceLabel.setFontSize(16);
        this.SpeedLabel = scene.add.text(690,215,"Speed:",textConfig);
        this.SpeedLabel.setOrigin(.5,.5);
        this.SpeedLabel.setScale(0);
        this.SpeedLabel.setFontSize(16);
        this.MightLebel = scene.add.text(790,215,"Might:",textConfig);
        this.MightLebel.setOrigin(.5,.5);
        this.MightLebel.setScale(0);
        this.MightLebel.setFontSize(16);
        //add blocks for stats
        this.FocusBlock = scene.add.graphics();
        this.FocusBlock.fillStyle(0x915b20,1);
        this.FocusBlock.lineStyle(15,0x784b1a,1)
        this.FocusBlock.strokeRoundedRect(460, 235, 60, 60,10)
        this.FocusBlock.fillRoundedRect(460, 235, 60, 60,10);
        this.FocusBlock.setScale(0);
        this.EnduranceBlock = scene.add.graphics();
        this.EnduranceBlock.fillStyle(0x915b20,1);
        this.EnduranceBlock.lineStyle(15,0x784b1a,1)
        this.EnduranceBlock.strokeRoundedRect(560, 235, 60, 60,10)
        this.EnduranceBlock.fillRoundedRect(560, 235, 60, 60,10);
        this.EnduranceBlock.setScale(0);
        this.SpeedBlock = scene.add.graphics();
        this.SpeedBlock.fillStyle(0x915b20,1);
        this.SpeedBlock.lineStyle(15,0x784b1a,1)
        this.SpeedBlock.strokeRoundedRect(660, 235, 60, 60,10)
        this.SpeedBlock.fillRoundedRect(660, 235, 60, 60,10);
        this.SpeedBlock.setScale(0);
        this.MightBlock = scene.add.graphics();
        this.MightBlock.fillStyle(0x915b20,1);
        this.MightBlock.lineStyle(15,0x784b1a,1)
        this.MightBlock.strokeRoundedRect(760, 235, 60, 60,10)
        this.MightBlock.fillRoundedRect(760, 235, 60, 60,10);
        this.MightBlock.setScale(0);
        //add stat text
        this.FocusText = scene.add.text(490,265,"10",textConfig);
        this.FocusText.setOrigin(.5,.5);
        this.FocusText.setScale(0);
        this.FocusText.setFontSize(24);
        this.FocusText.setColor("white");
        this.EnduranceText = scene.add.text(590,265,"7",textConfig);
        this.EnduranceText.setOrigin(.5,.5);
        this.EnduranceText.setScale(0);
        this.EnduranceText.setFontSize(24);
        this.EnduranceText.setColor("white");
        this.SpeedText = scene.add.text(690,265,"8",textConfig);
        this.SpeedText.setOrigin(.5,.5);
        this.SpeedText.setScale(0);
        this.SpeedText.setFontSize(24);
        this.SpeedText.setColor("white");
        this.MightText = scene.add.text(790,265,"2",textConfig);
        this.MightText.setOrigin(.5,.5);
        this.MightText.setScale(0);
        this.MightText.setFontSize(24);
        this.MightText.setColor("white");
        //indirect stats text
        this.LifeText = scene.add.text(460,330,"Life: 100",textConfig);
        this.LifeText.setOrigin(0,.5);
        this.LifeText.setScale(0);
        this.LifeText.setFontSize(18);
        this.EnergyText = scene.add.text(460,355,"Energy: 100",textConfig);
        this.EnergyText.setOrigin(0,.5);
        this.EnergyText.setScale(0);
        this.EnergyText.setFontSize(18);
        this.BattleSpeedText = scene.add.text(460,380,"Battle Speed: 5",textConfig);
        this.BattleSpeedText.setOrigin(0,.5);
        this.BattleSpeedText.setScale(0);
        this.BattleSpeedText.setFontSize(18);
        //add sprite of the outline of a man
        this.outlineOfMan = scene.add.sprite(CENTER.x, 535,"outlineOfMan");
        this.outlineOfMan.setOrigin(.5,.5);
        this.outlineOfMan.setScale(0);
    }

    toggle(){
        if(this.ToggleVisible){
            this.Background.setScale(0);
            this.Portrait.setScale(0);
            this.Name.setScale(0);
            this.Level.setScale(0);
            this.EXP.setScale(0);
            this.FocusLabel.setScale(0);
            this.EnduranceLabel.setScale(0);
            this.SpeedLabel.setScale(0);
            this.MightLebel.setScale(0);
            this.FocusBlock.setScale(0);
            this.EnduranceBlock.setScale(0);
            this.SpeedBlock.setScale(0);
            this.MightBlock.setScale(0);
            this.FocusText.setScale(0);
            this.EnduranceText.setScale(0);
            this.SpeedText.setScale(0);
            this.MightText.setScale(0);
            this.LifeText.setScale(0);
            this.EnergyText.setScale(0);
            this.BattleSpeedText.setScale(0);
            this.outlineOfMan.setScale(0);
            this.ToggleVisible = false;
        } else {
            this.Background.setScale(1);
            this.Portrait.setScale(2);
            this.Name.setScale(1);
            this.Level.setScale(1);
            this.EXP.setScale(1);
            this.FocusLabel.setScale(1);
            this.EnduranceLabel.setScale(1);
            this.SpeedLabel.setScale(1);
            this.MightLebel.setScale(1);
            this.FocusBlock.setScale(1);
            this.EnduranceBlock.setScale(1);
            this.SpeedBlock.setScale(1);
            this.MightBlock.setScale(1);
            this.FocusText.setScale(1);
            this.EnduranceText.setScale(1);
            this.SpeedText.setScale(1);
            this.MightText.setScale(1);
            this.LifeText.setScale(1);
            this.EnergyText.setScale(1);
            this.BattleSpeedText.setScale(1);
            this.outlineOfMan.setScale(1);
            this.ToggleVisible = true;
        }
    }

}