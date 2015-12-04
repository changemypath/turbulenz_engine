var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticleObject = (function (_super) {
    __extends(ParticleObject, _super);
    function ParticleObject(parent) {
        _super.call(this, parent);
        this.params = {};
    }
    ParticleObject.prototype.Awake = function () {
        this.particleNode = SceneNode.create({
            name: "particleObject" + ParticleObject.particleId,
            local: mathDevice.m43BuildTranslation(-5.0, 0.0, 0.0),
            dynamic: true,
            disabled: false
        });
        scene.addRootNode(this.particleNode);
        ParticleObject.particleId += 1;
        // The material list
        this.materials = {
            particle1: {
                effect: "add_particle_world",
                meta: {
                    transparent: true
                },
                parameters: {
                    diffuse: "textures/default_light.png"
                }
            },
            particle2: {
                effect: "add_particle_world",
                meta: {
                    transparent: true
                },
                parameters: {
                    diffuse: "textures/particle_star.png"
                }
            },
            particle3: {
                effect: "add_particle_world",
                meta: {
                    transparent: true
                },
                parameters: {
                    diffuse: "textures/particle_spark.png"
                }
            }
        };
        // The color list
        this.colors = {
            particle1: [mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)],
            particle2: [mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)],
            particle3: [
                mathDevice.v4Build(0.898, 0.807, 0.474, 1.0),
                mathDevice.v4Build(0.878, 0.874, 0.345, 1.0),
                mathDevice.v4Build(0.933, 0.811, 0.223, 1.0),
                mathDevice.v4Build(0.772, 0.494, 0.294, 1.0),
                mathDevice.v4Build(0.913, 0.909, 0.866, 1.0)
            ]
        };
    };
    ParticleObject.prototype.Start = function () {
        //Load materials
        if (this.particleNode) {
            for (var m in this.materials) {
                if (this.materials.hasOwnProperty(m)) {
                    if (scene.loadMaterial(graphicsDevice, textureManager, effectManager, m, this.materials[m])) {
                        this.materials[m].loaded = true;
                    }
                    else {
                        Log.error("Failed to load material: " + m);
                    }
                }
            }
        }
        //
        // add_particle_world
        //
        var effect = Effect.create("add_particle_world");
        effectManager.add(effect);
        var effectTypeData = {
            prepare: DefaultRendering.defaultPrepareFn,
            shaderName: "shaders/defaultrendering.cgfx",
            techniqueName: "add_particle",
            update: this.updateEffectFn,
            loadTechniques: this.loadTechniques
        };
        effectTypeData.loadTechniques(shaderManager);
        effect.add("rigid", effectTypeData);
        var material = scene.getMaterial("particle1");
        if (material) {
            var particleSystemParameters = {
                minSpawnTime: 0.005,
                maxSpawnTime: 0.01,
                minLifetime: 1,
                maxLifetime: 2,
                gravity: 9.81,
                size: 0.1,
                growRate: -0.02
            };
            this.emitter = Emitter.create(graphicsDevice, mathDevice, material, this.particleNode, particleSystemParameters);
            this.emitter.setParticleColors(this.colors.particle1);
        }
        for (var m in this.materials) {
            if (this.materials.hasOwnProperty(m)) {
                material = scene.getMaterial(m);
                if (material) {
                    // Add additional references to this.materials, to avoid them being removed when not in use
                    material.reference.add();
                }
            }
        }
        //Tell it to use particle1
        if (scene && this.emitter) {
            this.emitter.setParticleColors(this.colors.particle1);
            var material = scene.getMaterial("particle1");
            if (material) {
                // Set the material to use for the particle
                this.emitter.setMaterial(material);
            }
        }
    };
    ParticleObject.prototype.Update = function () {
        if (this.emitter) {
            this.emitter.update(Time.time, Time.deltaTime, camera);
        }
    };
    ParticleObject.prototype.updateEffectFn = function (camera) {
        //Do we need these? They don't seem to be referenced anywhere
        // Custom update effect to project particles in world space
        // var techniqueParameters = this.techniqueParameters;
        // techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        // As we update the geometry we need to propagate the changes to the drawParameters.
        // this.drawParameters[0].firstIndex = this.surface.first;
        // this.drawParameters[0].count = this.surface.numIndices;
    };
    ParticleObject.prototype.loadTechniques = function (shaderManager) {
        var that = this;
        var callback = function shaderLoadedCallbackFn(shader) {
            that.shader = shader;
            that.technique = shader.getTechnique(that.techniqueName);
            that.techniqueIndex = that.technique.id;
        };
        shaderManager.load(this.shaderName, callback);
    };
    ParticleObject.particleId = 0;
    return ParticleObject;
})(TzBehavior);
