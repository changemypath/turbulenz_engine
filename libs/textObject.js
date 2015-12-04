var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TextObject = (function (_super) {
    __extends(TextObject, _super);
    function TextObject(parent) {
        _super.call(this, parent);
        this.params = {};
    }
    TextObject.prototype.ProgramStart = function () {
        //Set up some basic parameters for the TextObject
        var params = {
            text: "",
            position: [graphicsDevice.width / 2, viewport.top],
            fontSize: 10,
            scale: 1,
            v4Color: [1, 1, 1, 1],
            verticalAlign: simpleFont.textVerticalAlign.TOP
        };
        this.params = params;
        this.SetFontSize(this.params.fontSize);
    };
    TextObject.prototype.Update = function () {
        this.DrawText(this.params);
    };
    //Adds this TextObject to a list of texts to draw, which then get rendered inside simplefonts.js render()
    TextObject.prototype.DrawText = function (params) {
        var text = params.text;
        if (text.length == 0)
            return;
        //This could be simplified by just saving this info in 'params'
        var v4Color = params.v4Color !== undefined ? params.v4Color : [1, 0, 0, 1];
        var v2Pos = params.position;
        var horizontalAlign = params.horizontalAlign !== undefined ? params.horizontalAlign : simpleFont.textHorizontalAlign.CENTER;
        var verticalAlign = params.verticalAlign !== undefined ? params.verticalAlign : simpleFont.textVerticalAlign.MIDDLE;
        var fontStyle = params.fontStyle || "regular";
        var fontParams = {
            x: v2Pos[0],
            y: v2Pos[1],
            r: v4Color[0],
            g: v4Color[1],
            b: v4Color[2],
            a: v4Color[3],
            scale: params.scale,
            spacing: params.spacing,
            alignment: horizontalAlign,
            valignment: verticalAlign,
            fontStyle: fontStyle
        };
        //must be called every frame you want to draw the text
        simpleFont.drawFont(text, fontParams);
    };
    TextObject.prototype.SetText = function (text) {
        this.params.text = text;
    };
    TextObject.prototype.SetPos = function (v2Pos) {
        this.params.position = v2Pos;
    };
    //Should be a number like 6, 24, etc.
    TextObject.prototype.SetFontSize = function (newFontSize) {
        this.params.fontSize = newFontSize;
        var baseHeight = 720;
        var textScaleFactor = newFontSize * (viewport.height / baseHeight);
        this.params.scale = textScaleFactor;
    };
    TextObject.prototype.SetColor = function (v4Color) {
        this.params.v4Color = v4Color;
    };
    //hAlign should be simpleFont.textHorizontalAlign.LEFT / RIGHT / CENTER
    //vAlign should be simpleFont.textVerticalAlign.TOP / BOTTOM / CENTER
    TextObject.prototype.SetAlignment = function (hAlign, vAlign) {
        this.params.horizontalAlign = hAlign;
        this.params.verticalAlign = vAlign;
    };
    return TextObject;
})(TzBehavior);
