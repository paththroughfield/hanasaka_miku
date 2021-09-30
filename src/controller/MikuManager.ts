import * as THREE from "three";
import { PresentData } from "../model/PresentData";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Ref } from "../core/Ref";
import { KeyManager } from "./KeyManager";

export class MikuManager
{
    private px:number;
    private py:number;
    private pz:number;
    private scale: number;

    private speed:number = 0.008;
    private _position:number=0;

    private action: any=[];
    private mixer:any;
    private model!: THREE.Group;
    private _scene:THREE.Scene;
    private _data :PresentData;
    private _keyMng! :KeyManager;
    private clock = new THREE.Clock();

    constructor(scene:THREE.Scene,data:PresentData){  
        this.px = data.px;
        this.pz = data.pz;
        this.py = 3.0;
       
        this.scale = 1.0;
        this._scene = scene;
        this._data = data;
        this._position = 0;
        //this.loading();
    }

    public loading(){
      const loader = new GLTFLoader();
      const url = '/src/assets/miku_miku7_2.glb';
      this._keyMng = new KeyManager();

      loader.load(
        url,
        (gltf) =>{
          this.model =  gltf.scene;
          
          const animations = gltf.animations;
          this.model.scale.set(this.scale,this.scale,this.scale);
          this.model.position.set(this.px,this.py,this.pz);
          this.model.rotation.y = Math.PI;

          if(animations && animations.length) {
  
            //Animation Mixerインスタンスを生成
            this.mixer = new THREE.AnimationMixer(this.model);
  
            //全てのAnimation Clipに対して
            for (let i = 0; i < animations.length; i++) {
              let animation = animations[i];

              console.log(animation)

              //Animation Actionを生成
              this.action[i] = this.mixer.clipAction(animation) ;

              //アニメーションを再生
              this.action[0].play();

            }

          }

          this._scene.add(this.model);
          this._data.mikumodel(this.model);
          console.log("modela",Ref.pdata.model);
        },
        function(error){
          console.log('An error happened');
          console.log(error);
        }
      );
    }

    public update(data:PresentData){
      
        console.log("miku update")

        var vec = this._keyMng.mikuv;
        var tmpv = new THREE.Vector3;
        
        console.log("mikuv:",vec)
        this.model.position.x += this.speed * data.delta * vec.x;
        this.model.position.z += this.speed * data.delta * vec.z;

        if(this.model.position.x>450) this.model.position.x = 450;
        else if(this.model.position.x<-450) this.model.position.x = -450;
        if(this.model.position.z>450) this.model.position.z = 450;
        else if(this.model.position.z<-450) this.model.position.z = -450;
        
        //進行方向
        tmpv.copy(vec);
        tmpv.normalize();
        var angle = Math.atan2(tmpv.x, tmpv.z); 
        
        if(this._keyMng.mflag)
          this.model.rotation.y = angle;

        console.log("pos:",data.delta)
        console.log(data.now)
        console.log("pupdatex:",this.model.position.x);
        console.log("pupdatez:",this.model.position.z);

        data.mikudata(this.model.position.x,this.model.position.z);
        this._position = data.now;
        
        if(!this._keyMng.mflag){
          this.action[0].stop();
          console.log("walkstop");
        }
        else
          this.action[0].play();

        if(this.mixer){
          this.mixer.update(this.clock.getDelta());
        }
    }

}