
import * as THREE from "three";
import { PresentData } from "../model/PresentData";
import { Vector3 } from "three";

export class CameraManager
{
    private _camera :THREE.PerspectiveCamera;

    constructor (camera :THREE.PerspectiveCamera)
    {
        this._camera = camera;
        this._camera.up.set(0,20,0);
    }

    public update (data :PresentData)
    {
        //console.log("camera update")
        //console.log (this._camera)
        var camera = this._camera;
    
        camera.position.set(data.px, 20, data.pz+20);
        
        camera.lookAt(new Vector3(data.px,0,data.pz));
        
    }
    
}