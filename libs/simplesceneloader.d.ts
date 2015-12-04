import scenenodei = require('../tslib/scenenode.ts');

export declare class SimpleSceneLoader {
    globals: any;
    loadAssetCounter: number;
    loadingAssetCounter: number;
    debugEnableWireframe: boolean;
    doVisibleNodeCheck: boolean;
    createdNodes: number;
    assetCache: {
        [path: string]: string;
    };
    dontChildPreLoaded: boolean;
    uniqueMeshes: number;
    pathRemapping: {
        [path: string]: string;
    };
    pathPrefix: string;
    isLoadingMesh: {
        (inputAssetPath: string): void;
    };
    isLoading: {
        (inputAssetPath: string): void;
    };
    load: {
        (inputAssetPath: string, locationMatrix: any, stationary: boolean, parentNode: scenenodei.SceneNode): scenenodei.SceneNode;
    };
    static create(): SimpleSceneLoader;
}
