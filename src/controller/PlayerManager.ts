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
            onAppMediaChange: (url) => this._onAppMediaChange(url),
        });
    

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
            // ラテルネ / その心に灯る色は
            this._player.createFromSongUrl("http://www.youtube.com/watch?v=bMtYf3R0zhY", {
                video: {
                    // 音楽地図訂正履歴: https://songle.jp/songs/2121404/history
                    beatId: 3953902,
                    repetitiveSegmentId: 2099660,
                    // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=bMtYf3R0zhY
                    lyricId: 52093,
                    lyricDiffId: 5177
                }
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