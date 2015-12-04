//
// Owns a collection of tzBehaviors.
//
var TzGameObject = (function () {
    function TzGameObject(name, parent) {
        if (parent === void 0) { parent = null; }
        this.activeSelf = true;
        this.activeInHierarchy = true;
        this.components = [];
        this.name = name;
        this.parent = parent;
        this.id = TzGameObject.idCounter;
        TzGameObject.idCounter++;
    }
    TzGameObject.prototype.AddComponent = function (behavior) {
        this.components.push(behavior);
    };
    TzGameObject.idCounter = 0;
    return TzGameObject;
})();
