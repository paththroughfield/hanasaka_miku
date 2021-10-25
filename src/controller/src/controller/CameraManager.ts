
import * as THREE from "three";
import { PresentData } from "../model/PresentData";
import { Vector3 } from "three";

export class CameraManager
{
    private _camera :THREE.PerspectiveCamera;
    private _light  :THREE.DirectionalLight;

    constructor (camera :THREE.PerspectiveCamera,light : THREE.DirectionalLight)
    {
        this._camera = camera;
        this._light = light;
        this._camera.up.set(0,20,0);
    }

    public update (data :PresentData)
    {
        //console.log("camera update")
        //console.log (this._camera)
        var camera = this._camera;
    
        camera.position.set(data.px, 20, data.pz+20);
        this._light.position.set(data.px+20,40,data.pz+20);
        this._light.target.position.set(data.px , 0,  data.pz);
        camera.lookAt(new Vector3(data.px,0,data.pz));
        
    }
    
}