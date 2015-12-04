import scenenodei = require('../tslib/scenenode.ts');
import effecti = require('../tslib/effectmanager.ts');
import defaultrenderingi = require('../tslib/defaultrendering.ts');
import emitteri = require('./emitter.d.ts');
import g = require('./globals.ts');
import ieventlisteneri = require('./IEventListener.ts');
import tzbehavior = require('./tzBehavior.ts');
import tzgameobjecti = require('./tzGameObject.ts');
import {Log} from '../../turbulenz/libs/log.ts';
import {Time} from './time.ts';

export class ParticleObject extends tzbehavior.TzBehavior implements ieventlisteneri.IEventListener {

	colors: any;
	emitter: any; //Emitter type
	materials: any;
	params: any = {};
	particleNode: scenenodei.SceneNode;
	shader: any;
	shaderName: any;
	technique: any;
	techniqueIndex: any;
	techniqueName: any;

	static particleId: number = 0;

	constructor(parent: tzgameobjecti.TzGameObject) {
		super(parent);
	}

	Awake() {
        this.particleNode = scenenodei.SceneNode.create({
            name: "particleObject" + ParticleObject.particleId,
            local: g.mathDevice.m43BuildTranslation(-5.0, 0.0, 0.0),
            dynamic: true,
            disabled: false
        });
        g.scene.addRootNode(this.particleNode);
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
			particle1: [g.mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)],
			particle2: [g.mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)],
			particle3: [
				g.mathDevice.v4Build(0.898, 0.807, 0.474, 1.0),
				g.mathDevice.v4Build(0.878, 0.874, 0.345, 1.0),
				g.mathDevice.v4Build(0.933, 0.811, 0.223, 1.0),
				g.mathDevice.v4Build(0.772, 0.494, 0.294, 1.0),
				g.mathDevice.v4Build(0.913, 0.909, 0.866, 1.0)
			]
		};
	}

	Start() {
		//Load materials
        if (this.particleNode) {
            for (var m in this.materials) {
                if (this.materials.hasOwnProperty(m)) {
                    if (g.scene.loadMaterial(g.graphicsDevice, g.textureManager, g.effectManager, m, this.materials[m])) {
                        this.materials[m].loaded = true;
                    } else {
                        Log.error("Failed to load material: " + m);
                    }
                }
            }
        }

        //
        // add_particle_world
        //
        var effect = effecti.Effect.create("add_particle_world");
        g.effectManager.add(effect);

        var effectTypeData = {
            prepare: defaultrenderingi.DefaultRendering.defaultPrepareFn,
            shaderName: "shaders/defaultrendering.cgfx",
            techniqueName: "add_particle",
            update: this.updateEffectFn,
            loadTechniques: this.loadTechniques
        };
        effectTypeData.loadTechniques(g.shaderManager);
        effect.add("rigid", effectTypeData);

		var material = g.scene.getMaterial("particle1");
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
			this.emitter = emitteri.Emitter.create(g.graphicsDevice, g.mathDevice, material, this.particleNode, particleSystemParameters);
			this.emitter.setParticleColors(this.colors.particle1);
		}

		for (var m in this.materials) {
			if (this.materials.hasOwnProperty(m)) {
				material = g.scene.getMaterial(m);
				if (material) {
			    // Add additional references to this.materials, to avoid them being removed when not in use
			    material.reference.add();
				}
			}
		}

		//Tell it to use particle1
		if (g.scene && this.emitter) {
			this.emitter.setParticleColors(this.colors.particle1);
			var material = g.scene.getMaterial("particle1");
			if (material) {
				// Set the material to use for the particle
				this.emitter.setMaterial(material);
			}
		}
	}

	Update() {
        if (this.emitter) {
            this.emitter.update(Time.time, Time.deltaTime, g.camera);
            // Log.trace("emitter.getNumActiveParticles(): " + this.emitter.getNumActiveParticles());
            // Log.trace("Time.time: " + Time.time);
            // Log.trace("TurbulenzEngine.time: " + TurbulenzEngine.time);
        }
	}

	updateEffectFn(camera) {
		//Do we need these? They don't seem to be referenced anywhere
		// Custom update effect to project particles in world space
		// var techniqueParameters = this.techniqueParameters;
		// techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;

		// As we update the geometry we need to propagate the changes to the drawParameters.
		// this.drawParameters[0].firstIndex = this.surface.first;
		// this.drawParameters[0].count = this.surface.numIndices;
	}

    loadTechniques(shaderManager) {
        var that = this;

        var callback = function shaderLoadedCallbackFn(shader) {
            that.shader = shader;
            that.technique = shader.getTechnique(that.techniqueName);
            that.techniqueIndex = that.technique.id;
        };
        g.shaderManager.load(this.shaderName, callback);
    }
}
