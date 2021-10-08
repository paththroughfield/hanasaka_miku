import * as THREE from "three";

let col=[
    '#ff2222',//red
    '#2222ff',
    '#22ffff',
    '#ff22ff',
    '#ffff22',
    '#ffffff',
    "#000000"
];

export class SeatsObject{

    private makecolor()
    {
        var random =  Math.floor( Math.random() * 6);
        return random;
    }

    public makeFlower(){
        var mcolor = this.makecolor();
        const loader = new THREE.TextureLoader();
        const picture = loader.load("/src/assets/flower1a.png");

        var flower = this.makeMesh(picture,mcolor);
        return flower;
    }

    public makeLylic(c:string){

        // キャンバスの作成
        var canvas = document.createElement('canvas');
        var context : CanvasRenderingContext2D = canvas.getContext('2d')!;
        // キャンバスサイズの設定
        canvas.width = 128;
        canvas.height = 128;

        // 文字の描画開始
        context.beginPath();
        // 文字色指定
        context.fillStyle = '#000000';
        // フォントサイズとスタイルの定義
        context.font= '100px sans-serif';
        // 文字の表示位置指定
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // 文字、文字の開始位置、最大幅
        context.fillText(c,64, 64, 230);
        context.fill();

        var imagetexture = new THREE.CanvasTexture(canvas);
        imagetexture.needsUpdate = true; 

        var lylic = this.makeMesh(imagetexture,6);
        
        return lylic;
    }

    public makeMesh(texture:any,clr:number){
        
        //texture->mesh
        var textground = new THREE.Mesh(
                          new THREE.PlaneGeometry(2,2,1,1),
                          new THREE.MeshLambertMaterial({
                            transparent: true,
                            map: texture,
                            color:col[clr],
                            side: THREE.DoubleSide}    
          ));
  
        textground.position.y = 0.3;
        textground.rotation.x = -Math.PI / 2;
        
        return textground;
    }
}