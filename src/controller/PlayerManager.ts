import { Player, IVideo} from "textalive-app-api";
import { Ref } from "../core/Ref";
import { PresentData } from "../model/PresentData";
import { CharData } from "../model/CharData";

export class PlayerManager
{
    private _player!: Player;
    //private _video!: IVideo;

    private _presentData!: PresentData;
    private _lyrics! :CharData[];

    private _listeners :any[] = [];

    private _position   :number = 0;
    private _updateTime :number = -1;

    constructor () {}

    public init ()
    {
        this._presentData = Ref.pdata = new PresentData();
        
        if (Ref.isDebug)
        {

        }
        else
        {
            var player = this._player = new Player({
                app: {token: "JTMqa8eKXEi3QWoV"},
                mediaElement: <HTMLInputElement>document.querySelector("#media") 
            });
            
            player.addListener({
                onAppReady  : (app) => this._onAppReady(app),
                onVideoReady: (v) => this._onVideoReady(v),
                onPlay : () => this._onPlay(),
                onPause: () => this._onPause(),
                onStop : () => this._onStop(),
                onMediaSeek : (pos) => this._onMediaSeek(pos),
                onTimeUpdate: (pos) => this._onTimeUpdate(pos),
                //onThrottledTimeUpdate: (pos) => this._onThrottledTimeUpdate(pos),
                //onAppParameterUpdate: (name, value) => this._onAppParameterUpdate(name, value),
                onAppMediaChange: (url) => this._onAppMediaChange(url),
            });
        }

        this._update();

        return this;
    }
    
    private _ready ()
    {
        Ref.three.ready(this._presentData);
        
        this._animate(0);
        setTimeout(() => this._animate(0), 200);
    }

    private _animate (now :number)
    {
        if (isNaN(now)) return;

        //this._presentData = Ref.pdata;
        //console.log("pdata:",this._presentData);
        this._presentData.timeupdate(now);
        Ref.three.update(this._presentData);
    }
    
    private _onAppReady(app: any)
    {
        console.log("app:", app);
        
        if (! app.managed)
        {
            // 再生コントロール表示
            document.getElementById("footer")!.style.display = "block";
            document.getElementById("bt_play")!.addEventListener("click", () => this._player.requestPlay());
            document.getElementById("bt_pause")!.addEventListener("click", () => this._player.requestPause());
            document.getElementById("bt_rewind")!.addEventListener("click", () => this._player.requestMediaSeek(0));

        }
        if (! app.songUrl)
        {
            this._player.createFromSongUrl("https://www.youtube.com/watch?v=-6oxY-quTOA", {
                altLyricsUrl: "data:text/plain;base64,44G744KT44Go44Gu44Kz44OI44CA44G744KT44Go44Gu44Kt44Oi44OB44Gg44GR44CA5Lyd44GI44KJ44KM44Gf44KJ44GE44GE44Gu44Gr44Gt44CA44Gq44KT44GmCuOBqOOBjeOBqeOBjeOAgOiAg+OBiOOBn+OCiuOBmeOCi+OBkeOBqeOAgOOBneOBhuOBneOBhuOAgOOBhuOBvuOBj+OBr+OBhOOBi+OBquOBhOOBv+OBn+OBhOOBrQoK44Gf44Go44GI44Gw44CA44Gd44GG44CA5oSb5oOz44KI44GP56yR44GG44GC44Gu5a2Q44Gu55yf5Ly844Go44GL44GX44Gf44KK44KC44GZ44KL44GR44GpCuOBn+OBhOOBpuOBhOOAgOOBhuOCj+OBueOBoOOBkeOBp+OAgOOBqeOBhuOBq+OCguOAgOOBk+OBhuOBq+OCguOAgOOBquOCk+OBqOOCguOAgOOBquOCieOBquOBhOOCguOBruOBpwoK44Gd44KM44Gn44KC44CA44G744KJ44CA44Kt44Of44GM56yR44Gj44Gm44KL44CA44G+44KP44KK44Gv44GE44Gk44KC5Yil5LiW55WM44GnCuOBteOBqOOBl+OBn+OBqOOBjeOAgOebruOBqOebruOBjOOBguOBo+OBn+OCieOAgOOCveODr+OCveODr+OBl+OBoeOCg+OBhuOAgOOCreODn+OBruOBm+OBhOOBoOOBi+OCiQoK5oGL44Gu44Ot44Oz44Oq55qE44Gr44CA6KqH5aSn5aaE5oOz44CA6ZuG5Lit56Cy54Gr44GnCuOCreODn+OBruOCs+ODiOODkOOBruOBsuOBqOOBpOOBsuOBqOOBpOOBq+OAgOaSg+OBoeaKnOOBi+OCjOOBn+ODj+ODvOODiOOBrwrjgZ/jgYjjgZrjgIDkuI3lronlrprjgafjgIDjgajjgY3jganjgY3jgIDou6LjgbPjgZ3jgYbjgavjgoLjgarjgovjgZHjgakK44Gd44Gj44Go44CA5pSv44GI44Gm44GP44KM44KL44CA44Gd44GG44GE44GG44Go44GT44KN44GM5aW944GN44Gq44Gu44GVCgoK44GE44Gk44KC44Gu44Kz44OI44CA44GC44KK44G144KM44Gf44Kz44OI44OQ44GV44GI44CA5Ye644Gm44GT44Gq44GP44Gm44CA44Oi44Ok44Oi44Ok44GX44Gf44KK44GtCuOBquOCk+OBpuOBreOAgOaCqeOCk+OBoOOCiuOCguOBmeOCi+OBkeOBqeOAgOOBneOBhuOBneOBhuOAgOetlOOBiOOBr+OBv+OBpOOBi+OCieOBquOBhOOBruOBrQoK44Gf44Go44GI44Gw44CA44Gd44GG44CA5puy44GM44KK6KeS5puy44GM44Gj44Gm44CA5YG254S244Kt44Of44Go5Ye65Lya44Gj44Gf44Go44GN44Gr44GvCuOCouOCv+ODleOCv+OBl+OBpuOBsOOBi+OCiuOBp+OAgOOBqeOBhuOBq+OCguOAgOOBk+OBhuOBq+OCguOAgOOBquOCk+OBqOOCguOAgOOBquOCieOBquOBhOOCguOBruOBpwoK44Gd44KM44Gn44KC44CA44G744KJ44CA44Kt44Of44GM6KaL44Gk44KB44Gm44KL44CA44G+44KP44KK44Gv44GE44Gk44KC5Yil5qyh5YWD44GnCuOBquOBq+OCguOBi+OCguOBjOOAgOOBoeOBo+OBveOBkeOBq+imi+OBiOOCi+OAgOacuuOBruS4iuOBq+etlOOBiOOBr+eEoeOBhOOBi+OCiQoK5oGL44Gu44Kr44Ks44Kv55qE44Gr44CA6I2S5ZSQ54Sh56i944CA57W156m65LqL44Gn44KCCuOCreODn+OBruWCjeOBq+OBhOOBn+OBhOOBruOAgOOCs+ODiOODkOOBquOCk+OBpuOBhOOCieOBquOBhOOBj+OCieOBhOOBqwrjgZ/jgYjjgZrjgIDpmqPjgavjgYTjgabjgIDmjIHjgaHjgaTmjIHjgZ/jgozjgaTjgIDjgoLjgZ/jgozjgYvjgYvjgorjgaTjgacK44Gd44Gj44Go44CA5omL44Go5omL5Y+W44KK5ZCI44GG44CA44Gd44GG44GE44GG5LqM5Lq644Gr44Gq44KK44Gf44GE44Gu44GVCgoK5oGL44Gu44Ot44Oz44Oq55qE44Gr44CA55+b55u+44Gg44KJ44GR44Gu44CA5aSi54mp6Kqe44GnCuOCreODn+OBruWPs+aJi+W3puaJi+OAgOOBpOOBi+OBvuOBiOOBpumbouOBleOBquOBhOOBj+OCieOBhOOBrwrjgZ/jgYjjgZrjgIDnqbrlm57jgorjgafjgIDjgajjgY3jganjgY3jgIDou6LjgbPjgZ3jgYbjgavjgoLjgarjgovjgZHjgakK44Gd44Gj44Go44CA5oqx44GI44Gm44GP44KM44KL44CA44Gd44GG44GE44GG44Go44GT44KN44GM5aW944GN44Gq44Gu44GV"
            });
        }
    }
    
    private _onVideoReady (v: IVideo) 
    {
        console.log("video:", v);

        //this._video = v;

        this._lyrics = [];

        if (v.firstChar)
        {
            var cid = 0;
            var c = v.firstChar;
            while (c)
            {
                var cd = new CharData(c, cid);
                this._lyrics.push(cd);
                c = c.next;
                cid++;
            }
        }
        this._presentData.charupdate(this._lyrics);
        this._ready();
    }

    private _update ()
    {
        if (this._player && this._player.isPlaying && 0 < this._updateTime)
        {
            var t = (Date.now() - this._updateTime) + this._position;
            this._animate(t);
            console.log("player update")
        }
        //window.requestAnimationFrame(() => this._update());
    }

    private _contorlChange (playing: boolean)
    {
        if (playing)
        {
            document.getElementById("bt_play")!.style.display = "none";
            document.getElementById("bt_pause")!.style.display = "inline";
        }
        else
        {
            document.getElementById("bt_play")!.style.display = "inline";
            document.getElementById("bt_pause")!.style.display = "none";
        }
    }

    private _onPlay ()
    {
        this._contorlChange(true);
        this._updateTime = Date.now();
        console.log("play");
    }
    private _onPause ()
    {
        this._contorlChange(false);
        console.log("pause");
    }
    private _onStop ()
    {
        this._contorlChange(false);
        console.log("stop");
    }
    private _onMediaSeek (position :number)
    {
        console.log("seek", position);
    }
    private _onTimeUpdate (position :number)
    {
        this._position   = position;
        this._updateTime = Date.now();

        //console.log("timeupdate");
        this._animate(position);
    }
    /*private _onThrottledTimeUpdate (position :number)
    {

    }*/
    private _onAppMediaChange (url :string)
    {
        this._player.requestMediaSeek(0);
        this._player.requestPause();
    }
    
    public addParameterUpdateListener (listener: any)
    {
        this._listeners.push(listener);
    }
    
}