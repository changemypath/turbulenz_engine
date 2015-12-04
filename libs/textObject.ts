import g = require('./globals.ts');
import ieventlisteneri = require('./IEventListener.ts');
import tzbehavior = require('./tzBehavior.ts');
import tzgameobjecti = require('./tzGameObject.ts');

export class TextObject extends tzbehavior.TzBehavior implements ieventlisteneri.IEventListener {

	params: any = {};

	constructor(parent: tzgameobjecti.TzGameObject) {
		super(parent);
	}

	ProgramStart() {

		//Set up some basic parameters for the TextObject
		var params = {
			text: "",	//Add a string here to see some default text when this textObj is created
			position: [g.graphicsDevice.width / 2, g.viewport.top],
			fontSize: 10,
			scale: 1,	//calculated from fontSize
			v4Color: [1,1,1,1],
			verticalAlign: g.simpleFont.textVerticalAlign.TOP
		};

		this.params = params;

		this.SetFontSize(this.params.fontSize);
	}

	Update() {
		this.DrawText(this.params);
	}

	//Adds this TextObject to a list of texts to draw, which then get rendered inside simplefonts.js render()
	DrawText(params) {

		var text = params.text;
		if (text.length == 0)
			return;

		//This could be simplified by just saving this info in 'params'
		var v4Color = params.v4Color !== undefined ? params.v4Color : [1, 0, 0, 1];
		var v2Pos = params.position;
		var horizontalAlign = params.horizontalAlign !== undefined ? params.horizontalAlign: g.simpleFont.textHorizontalAlign.CENTER;
		var verticalAlign = params.verticalAlign !== undefined ? params.verticalAlign: g.simpleFont.textVerticalAlign.MIDDLE;
		var fontStyle = params.fontStyle || "regular";

		var fontParams = {
			x : v2Pos[0],
			y : v2Pos[1],

			r : v4Color[0],
			g : v4Color[1],
			b : v4Color[2],
			a : v4Color[3],

			scale : params.scale,
			spacing : params.spacing,
			alignment : horizontalAlign,
			valignment : verticalAlign,
			fontStyle : fontStyle
		};

		//must be called every frame you want to draw the text
		g.simpleFont.drawFont(text, fontParams);
	}

	SetText(text) {
		this.params.text = text;
	}

	SetPos(v2Pos) {
		this.params.position = v2Pos;
	}

	//Should be a number like 6, 24, etc.
	SetFontSize(newFontSize) {
		this.params.fontSize = newFontSize;
		var baseHeight = 720;
		var textScaleFactor = newFontSize * (g.viewport.height / baseHeight);

		this.params.scale = textScaleFactor;
	}

	SetColor(v4Color) {
		this.params.v4Color = v4Color;
	}

	//hAlign should be simpleFont.textHorizontalAlign.LEFT / RIGHT / CENTER
	//vAlign should be simpleFont.textVerticalAlign.TOP / BOTTOM / CENTER
	SetAlignment(hAlign, vAlign) {
		this.params.horizontalAlign = hAlign;
		this.params.verticalAlign = vAlign;
	}
}
