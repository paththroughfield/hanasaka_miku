import { Ref } from "../core/Ref";
import { Util } from "../util/Util";
import * as THREE from "three";

export class KeyManager
{
    private rx:number;
    private ry:number;

    public mflag: boolean = false;

    constructor(/*data:PresentData*/){
        this.rx = 0;
        this.ry = 0;
        this.keyEvents();
    }

    private keyEvents ()
    {
        var isMobile = Util.checkMobile();

        if (! isMobile)
        {
            document.getElementById("view")!.addEventListener("mousemove",  (e) => this._touchmove(e));
            document.getElementById("view")!.addEventListener("mouseleave", (e) => this._touchend(e));
        }
        else
        {
            document.getElementById("view")!.addEventListener("touchmove", (e) => this._touchmove(e));
            document.getElementById("view")!.addEventListener("touchend",  (e) => this._touchend(e));
        }
    }

    public _touchmove (e: any)
    {
        this.mflag = true;

        var mx = 0;
        var my = 0;
       
        if (e.touches)
        {
            mx = e.touches[0].clientX;
            my = e.touches[0].clientY;
        }
        else
        {
            mx = e.clientX;
            my = e.clientY;
        }

        this.rx = (mx / Ref.stw) * 2 - 1;
        this.ry = (my / Ref.sth) * 2 - 1;
        //console.log("rx:",this.rx);
        //console.log("ry:",this.ry);
    }

    public _touchend (e: any)
    {
        this.mflag = false;
        this.rx = 0;
        this.ry = 0;
    }

    public get mikuv(){
        console.log( "mikuv:",new THREE.Vector3(this.rx,0,this.ry));
        return new THREE.Vector3(this.rx,0,this.ry);
    }
}
