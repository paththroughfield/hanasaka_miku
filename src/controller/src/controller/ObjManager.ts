import { CharData } from "../model/CharData";
import { PresentData } from "../model/PresentData";

export class ObjManager{

    private _scene!:THREE.Scene;
    private _lyrics!:CharData[];

    private height:number = 1.0;
    private omote:number = -Math.PI / 2;

    private space:number = 2;
    private subtime:number = 200;

    constructor (scene :THREE.Scene,data: PresentData)
    {
        this._scene  = scene;
        this._lyrics = data.lyrics;
        //this.update(data);
    }

    public update(data :PresentData)
    {
        if (! this._lyrics) return;
        var position = data.now;

        // 全歌詞を走査
        for (var i = 0, l = this._lyrics.length; i < l; i ++)
        {
            var lyric = this._lyrics[i];

            if (lyric.startTime - this.subtime < position) // 開始タイム < 再生位置
            {
                // 描画が有効な場合、歌詞を描画する
                if (lyric.isDraw)
                {
                    //var px = lyric.x * space;
                    //var pz = lyric.z * space;

                    this.fontsize(data,lyric);

                    // 文字が画面外にある場合は除外
                    //if (px + space < - this._px || - this._px + this._stw < px) continue;
                    //if (py + space < - this._py || - this._py + this._sth < py) continue;

                    //px = this._px + px + space / 2;
                    //pz = this._pz + pz + space / 2;
                    
                    /*fontSize = space * 0.5 * prog;
                    ctx.font = "bold " + fontSize + "px sans-serif";
                    ctx.fillText(lyric.text, px, py + fontSize * 0.37);*/
                }

                if (position < lyric.endTime) // 再生位置 < 終了タイム
                {
                    if (/*! isNaN(this._mouseX) &&*/ ! lyric.isDraw)
                    {
                        // グリッド座標の計算
                        //console.log("obj")
                        var nx = Math.floor( data.px / this.space);
                        var ny = Math.floor( data.pz / this.space);

                        var tx = 0, ty = 0, isOk = true;

                        // 他の歌詞との衝突判定
                        hitcheck: for (var n = 0; n <= 100; n ++)
                        {
                            tx = n;
                            ty = 0;
                            var mx = -1;
                            var my =  1;
                            var rn = (n == 0) ? 1 : n * 4;

                            // 周囲を走査
                            for (var r = 0; r < rn; r ++)
                            {
                                isOk = true;
                                for (var j = 0; j < this._lyrics.length; j ++)
                                {
                                    var tl = this._lyrics[j];
                                    
                                    // 他の歌詞と衝突している
                                    if (tl.isDraw && tl.x == nx + tx && tl.z == ny + ty)
                                    {
                                        isOk = false;
                                        break;
                                    }
                                }
                                if (isOk) break hitcheck;

                                // 次のグリッドへ
                                tx += mx; if (tx == n || tx == -n) mx = - mx;
                                ty += my; if (ty == n || ty == -n) my = - my;
                            }
                        }
                        // グリッド座標をセット＆描画を有効に
                        lyric.x = nx + tx;
                        lyric.z = ny + ty;
                    
                        this.addScene(data,lyric,lyric.x*this.space,lyric.z*this.space)
                        lyric.isDraw = true;
                    }
                }
                
                
            }
            else lyric.isDraw = false;
        }
    }
    
    public addScene(data:PresentData,c:CharData,x:number,z:number)
    {
        c._flower.position.y = this.height;
        c._flower.rotation.x = this.omote;
        c._flower.position.x = x;
        c._flower.position.z = z;

        c._moji.position.y = this.height;
        c._moji.rotation.x = this.omote;
        c._moji.position.x = x;
        c._moji.position.z = z;

        this.fontsize(data,c);

        //console.log("addscene:",c._flower);
        c._flower.receiveShadow = true;
        this._scene.add(c._flower);
        this._scene.add(c._moji);
    }

    public fontsize(data:PresentData,c:CharData)
    {
        var prog = this._easeOutBack(Math.min((data.now - c.startTime + this.subtime) / 200, 1));
        c._flower.scale.set(prog,prog,prog);
        c._moji.scale.set(prog,prog,prog);
    }

    _easeOutBack (x:number) 
    { 
        return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2); 
    }
    
}