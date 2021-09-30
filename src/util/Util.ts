export class Util
{
    /** モバイルかどうか */
    public static checkMobile ()
    {
        var ua = navigator.userAgent;
        return (0 <= ua.indexOf('iPhone') || 0 <= ua.indexOf('iPod') || (0 <= ua.indexOf('iPad')) || (0 < ua.indexOf("Mac OS") && document.ontouchstart !== undefined) || 
            0 <= ua.indexOf('Android') || 0 <= ua.indexOf('BlackBerry') || 0 <= ua.indexOf('Windows Phone'));
    }
}