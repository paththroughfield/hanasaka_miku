import { CharData } from "./CharData";

/**
 * 現在時刻のデータ
 */
export class PresentData
{
    public now!: number;
    public pre_now: number=0;
    public delta: number=-1;

    public px: number;
    public pz: number;

    public lyrics! :CharData[];
    public model :boolean= false;

    constructor (now:number=-1)
    {
        this.px = 0;
        this.pz = 0;
       
        this.timeupdate(now);
    }

    public charupdate(ldata:CharData[])
    {
        this.lyrics = ldata;
        //console.log(ldata.length);
    }

    public mikumodel(miku:any){
        this.model = miku;
    }

    public timeupdate(now:number)
    {
        if(now<0) return;
        this.pre_now = this.now;
        this.now = now;
        this.delta = this.now - this.pre_now;
    }

    public mikudata(x:number,z:number)
    {
        this.px = x;
        this.pz = z;
    }
}