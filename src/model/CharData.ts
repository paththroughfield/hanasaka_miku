import { IChar } from "textalive-app-api";
import { SeatsObject } from "../object/SeatsObject";

export class CharData
{
    //public id!: number;
    public phraseId :number;

    public startTime :number;
    public endTime   :number;
    public char      :string;

    public options :any = {};

    public x :number=0;
    public z :number=0;
    public isDraw :boolean=false;

    //public next! :CharData;
    //public prev! :CharData;

    public _flower! :THREE.Mesh;
    public _moji! :THREE.Mesh;

    constructor (c :IChar, phraseId :number = 0)
    {
        this.phraseId = phraseId;
        
        this.startTime = c.startTime;
        this.endTime   = c.endTime;
        this.char      = c.text;

        if (c.next && c.next.startTime - this.endTime < 500) this.endTime = c.next.startTime;
        else this.endTime += 500;

        this.init();
    }

    private init()
    {
        this._flower = new SeatsObject().makeFlower();
        this._moji = new SeatsObject().makeLylic(this.char);
    }
}