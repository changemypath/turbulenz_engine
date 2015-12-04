import {FontDimensions,FontGlyph,FontKerning,FontKerningMap,FontDrawParameters,FontDrawPageContext,Font,FontManagerFonts,FontManager} from '../tslib/fontmanager.ts';

export declare class SimpleFontRenderer {
    textHorizontalAlign: any;
    textVerticalAlign: any;
    scratchPad: any;
    textToDraw: any;
    fontSizes: any;
    fonts: any;
    defaultFont: any;
    fontSizeMax: number;
    fontSizeMin: number;
    fontsList: any;
    technique2D: any;
    technique2Dparameters: any;
    textCacheIndex: number;
    textCache: any;
    

    drawFontDouble: {
        (string: string, inputParams: any): void;
    };
    drawFont: {
        (string: string, inputParams: any): void;
    };
    calculateRectFromInputParams: {
        (font: string, string: string, scale: any, spacing: number, x: number, y: number, align: any, valign: any, rect: any): void;
    };
    calculateScaleFromInputParams: {
        (inputParams: any): void;
    };
    isStandardPointSize: {
        (pointSize: any): void;
    };
    getFontFromPointSize: {
        (pointSize: any, fontType: string): void;
    };
    calculateFontAndScaleFromInputParams: {
        (inputParams: any, outputParams: any): void;
    };
    preload(): void;
    hasLoaded(): boolean;
    render(): void;
    clearFontList(): void;
    allocateParams(): any;



    static create(): SimpleFontRenderer;
}
