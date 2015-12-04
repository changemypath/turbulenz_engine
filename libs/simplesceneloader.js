// Copyright (c) 2013 Turbulenz Limited
//
//  SimpleSceneLoader
//  ===========
//
//  Helper class to load into a scene with a single line call and an instant return scene node.
//  also deals with multiple calls to the same asset and clones appropriately.
//

/*global SceneLoader: false*/
/*global SceneNode: false*/

var SceneLoader = require('sceneloader').SceneLoader;
var SceneNode = require('scenenode').SceneNode;
var g = require('globals');

function SimpleSceneLoader() {}

SimpleSceneLoader.prototype =
{
    isLoadingMesh : function isLoadingMeshFn(inputAssetPath)
    {
        return this.assetCache[inputAssetPath] !== undefined;
    },

    isLoading : function isLoadingFn()
    {
        return this.loadingAssetCounter > 0;
    },

    load : function loadFn(inputAssetPath, additionalLoadingParams, locationMatrix, stationary, parentNode)
    {
        var md       =   g.mathDevice;
        var localMatrix;
        var new_child;
        var new_child_name;

        var parameters;

        var that     = this;

        var thisLocationMatrix  =   locationMatrix ? locationMatrix : md.m43BuildIdentity();

        parameters =
        {
            name: inputAssetPath + this.loadAssetCounter.toString(),
            local: thisLocationMatrix,
            dynamic: stationary !== undefined ? !stationary : true,
            disabled: false,
            keepVertexData : this.debugEnableWireframe
        };

        var shouldAdd   =   false;

        var toReturn = parentNode;

        var buildToReturn = function ()
        {
            if (toReturn === undefined)
            {
                toReturn          =   SceneNode.create(parameters);
                this.createdNodes +=  1;
                shouldAdd         =   true;
            }
        }.bind(this);

        var thisAssetCache = this.assetCache[inputAssetPath];
        localMatrix = parentNode ? md.m43Copy(thisLocationMatrix) : md.m43BuildIdentity();
        if (thisAssetCache !== undefined)
        {
            if (!thisAssetCache.loaded)
            {
                buildToReturn();

                thisAssetCache.Queue.push({node : toReturn, localMatrix : localMatrix});
            }
            else
            {
                that.cloneAssetCounter += 1;
                new_child_name         =   thisAssetCache.loaded.name + '_copy' + that.cloneAssetCounter.toString();
                new_child              =   g.scene.cloneRootNode(thisAssetCache.loaded, new_child_name);

                if (this.dontChildPreLoaded && !parentNode)
                {
                    toReturn           =   new_child;
                    toReturn.setLocalTransform(thisLocationMatrix);
                }
                else
                {
                    buildToReturn();
                    new_child.setLocalTransform(localMatrix);
                    toReturn.addChild(new_child);
                }

                this.createdNodes      +=  1;
            }
        }
        else
        {
            this.uniqueMeshes   +=  1;

            buildToReturn();

            thisAssetCache = this.assetCache[inputAssetPath] =
            {
                rootNode    :   SceneNode.create(parameters),
                loaded      :   null
            };
            thisAssetCache.Queue = [];
            thisAssetCache.Queue.push({node : toReturn, localMatrix : localMatrix});

            var loadAssetFinished = function loadAssetFinishedFn()
            {
                var loadedChild =   thisAssetCache.rootNode; //.children[0];

                var index;
                var thisAssetCacheNodeQueue = thisAssetCache.Queue;
                for (index = 0; index < thisAssetCacheNodeQueue.length; index += 1)
                {
                    that.cloneAssetCounter += 1;
                    new_child_name         =   loadedChild.name + '_copy' + that.cloneAssetCounter.toString();
                    new_child              =   g.scene.cloneRootNode(loadedChild, new_child_name);
                    new_child.setLocalTransform(thisAssetCacheNodeQueue[index].localMatrix);

                    thisAssetCacheNodeQueue[index].node.addChild(new_child);

                    this.createdNodes      +=  1;
                }

                thisAssetCache.loaded = loadedChild;
                thisAssetCacheNodeQueue.length = 0;
                that.loadingAssetCounter -= 1;
            };

            var loadingParameters =
            {
                scene           : g.scene,
                append          : true,
                assetPath       : inputAssetPath,
                keepLights      : false,
<<<<<<< HEAD:turbulenz/libs/simplesceneloader.js
                graphicsDevice  : g.graphicsDevice,
                mathDevice      : g.mathDevice,
                textureManager  : g.textureManager,
                shaderManager   : g.shaderManager,
                effectManager   : g.effectManager,
                requestHandler  : g.requestHandler,
=======
                graphicsDevice  : graphicsDevice,
                mathDevice      : mathDevice,
                textureManager  : textureManager,
                shaderManager   : shaderManager,
                effectManager   : effectManager,
                animationManager: animationManager,
                requestHandler  : requestHandler,
>>>>>>> 6d0ca73e5a6295eea34e6faaf40212d48b0d09d7:libs/simplesceneloader.js
                shapesNamePrefix: inputAssetPath,
                dynamic         : true,
                postSceneLoadFn : loadAssetFinished,
                parentNode      : thisAssetCache.rootNode,
                name            : inputAssetPath + this.loadAssetCounter.toString() + "_child",
                keepVertexData  : this.debugEnableWireframe
            };

            //Tack on additional loading parameters
            if (additionalLoadingParams !== undefined) {
                for (p in additionalLoadingParams) {
                    loadingParameters[p] = additionalLoadingParams[p];
                }
            }

            var scratchSceneLoader = SceneLoader.create();
            scratchSceneLoader.setPathRemapping(this.pathRemapping, this.pathPrefix);
            scratchSceneLoader.load(loadingParameters);
            scratchSceneLoader = null;
            this.loadingAssetCounter += 1;
        }

        this.loadAssetCounter += 1;

        if (shouldAdd)
        {
            g.scene.addRootNode(toReturn);
        }

        return toReturn;
    },

    setPathRemapping : function setPathRemappingFn(prm, assetUrl)
    {
        this.pathRemapping = prm;
        this.pathPrefix = assetUrl;
    },

    getNumberOfUniqueMeshes : function simpleSceneLoaderGetNumberOfUniqueMeshesFn()
    {
        return  this.uniqueMeshes;
    },

    getNumberOfNodes : function simpleSceneLoaderGetNumberOfNodesFn()
    {
        return  this.createdNodes;
    }
};

SimpleSceneLoader.create = function simpleSceneLoaderCreateFn()
{
    var simpleSceneLoader               = new SimpleSceneLoader();

    simpleSceneLoader.debugEnableWireframe = false;//globals.debugEnableWireframe;

    simpleSceneLoader.loadAssetCounter  = 0;
    simpleSceneLoader.cloneAssetCounter = 0;
    simpleSceneLoader.loadingAssetCounter = 0;
    simpleSceneLoader.assetCache        = {};

    simpleSceneLoader.createdNodes      = 0;
    simpleSceneLoader.uniqueMeshes      = 0;

    simpleSceneLoader.dontChildPreLoaded    =   true;

    return simpleSceneLoader;
};

exports.SimpleSceneLoader = SimpleSceneLoader;
module.id = "simplesceneloader";
