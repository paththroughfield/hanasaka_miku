import * as THREE from "three";
import { Ref } from "../core/Ref";
//import { MathExt } from "../util/MathExt";
import { PresentData } from "../model/PresentData";
import { MikuManager } from "./MikuManager";
import { CameraManager } from "./CameraManager";
import { ObjManager } from "./ObjManager";

export class ThreeManager
{
    private _view :HTMLElement;

    private _renderer :THREE.WebGLRenderer;
    private _scene    :THREE.Scene;
    private _camera   :THREE.PerspectiveCamera;
    private _light    :THREE.DirectionalLight;
    
    private _mikuMng!   :MikuManager;
    private _cameraMng! :CameraManager;
    private _objMng!    :ObjManager;

    constructor ()
    {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;

        var camera = new THREE.PerspectiveCamera(30, w / h);
        
        // Renderer / Camera
        var scene = new THREE.Scene();
        //scene.background = new THREE.Color(col);
        //scene.fog = new THREE.Fog(col, 50, 80);
        
        var container = this._view =  <HTMLInputElement>document.getElementById("view");
        var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true;
        renderer.setClearColor('#00ffff',0.7)
        container.appendChild(renderer.domElement);

        // Light
        var ambientLight = new THREE.AmbientLight(0xbbbbbb);
        scene.add( ambientLight );
        
        var directionalLight = new THREE.DirectionalLight(0xffffff, 2.3);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true; // 影を落とす設定
        directionalLight.shadow.camera.right = 12;
        directionalLight.shadow.camera.left = -12;
        directionalLight.shadow.camera.top = -12;
        directionalLight.shadow.camera.bottom = 12;
        directionalLight.target.position.set( 0, 0, 0 );
        scene.add(directionalLight);
        scene.add( directionalLight.target );

        /*var directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.3);
        directionalLight2.position.set(0, 10, 0);
        scene.add(directionalLight2);*/

        /*const spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(0, 1000, 0);
        spotLight.castShadow = true; // 影を落とす設定
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        scene.add(spotLight);*/

        // 床のテクスチャー
        const texture = new THREE.TextureLoader().load('/src/assets/floor1.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // リピート可能に
        texture.repeat.set(100, 100); // 10x10マスに設定
        texture.magFilter = THREE.NearestFilter; // アンチエイリアスを外す

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.0,
            metalness: 0.6,
            })
        );
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;
        //floor.receiveShadow = true; // 影の設定
        scene.add(floor);


        //床テクスチャーその２
        /*const ground = new THREE.Mesh(
                    new THREE.PlaneGeometry(500,500,1,1),
                    new THREE.MeshLambertMaterial({
                    color: 0x00ff00
                    }));
        //ground.position.x = -500;
        //ground.position.y = -500;
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);*/

        // Light Helper
        // scene.add(new THREE.DirectionalLightHelper(directionalLight, 3, 0xff0000));

        this._renderer = renderer;
        this._scene    = scene;
        this._camera   = camera;
        this._light    = directionalLight;

    }

    public ready(data:PresentData)
    {
        console.log("Three ready");
        if (! this._cameraMng)
        {
            this._renderer.render(this._scene,this._camera);
            this._mikuMng = new MikuManager(this._scene,data);
            this._cameraMng = new CameraManager(this._camera,this._light);
            this._objMng  = new ObjManager(this._scene,data);

            this._mikuMng.loading();
        }
        
    }

    public update (data :PresentData)
    {
        //console.log(Ref.pdata.model)
        // Scene
        this._renderer.render(this._scene,this._camera);
        this._cameraMng.update(data);
        if(!Ref.pdata.model) return;
        this._mikuMng.update(data);
        this._objMng.update(data);
        console.log(this._scene.children);
    }

    public resize ()
    {
        var w = Ref.stw;
        var h = Ref.sth;
        
        if (w < h) this._camera.fov = 56;
        else       this._camera.fov = 45;

        this._camera.aspect = w / h;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(w, h);
    }

    public flowerRemove()
    {
        //ライト、地面、モデルは残す
        while(this._scene.children[4]){
            this._scene.remove(this._scene.children[4]);
        }
    }

}