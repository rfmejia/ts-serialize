"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const scalts_1 = require("scalts");
const SeriliazersMapper_1 = require("./SeriliazersMapper");
class Serializable {
    static fromString(str) {
        try {
            const json = JSON.parse(str);
            return this.fromJsObject(json);
        }
        catch (e) {
            return scalts_1.Left(e);
        }
    }
    static fromStringAsArray(str) {
        try {
            const json = JSON.parse(str);
            return this.fromJsArray(json);
        }
        catch (e) {
            return scalts_1.Left(e);
        }
    }
    static fromJsObject(jsObject, jsonPath = [], classPath = []) {
        let entity = new this.prototype.constructor();
        let serializeErrors = [];
        SeriliazersMapper_1.default.getFieldSerializers(this.prototype).forEach(prop => {
            const unmarshallResult = prop.unmarshaller(jsObject[prop.jsonPropertyName], jsObject, entity, jsonPath, classPath);
            if (unmarshallResult.isLeft) {
                serializeErrors.push(...unmarshallResult.left().get());
            }
            else if (serializeErrors.isEmpty) {
                entity[prop.classPropertyName] = unmarshallResult.right().get();
            }
        });
        return serializeErrors.isEmpty ? scalts_1.Right(entity) : scalts_1.Left(serializeErrors);
    }
    static fromJsArray(jsArray, jsonPath = [], classPath = []) {
        let entities = [];
        let serializeErrors = [];
        jsArray.forEach((jsObject, index) => {
            const newJsonPath = [...jsonPath, `[${index}]`];
            const newClassPath = [...classPath, `[${index}]`];
            const unmarshallResult = this.fromJsObject(jsObject, newJsonPath, newClassPath);
            if (unmarshallResult.isLeft) {
                serializeErrors.push(...unmarshallResult.left().get());
            }
            else if (serializeErrors.isEmpty) {
                entities.push(unmarshallResult.right().get());
            }
        });
        return serializeErrors.isEmpty ? scalts_1.Right(entities) : scalts_1.Left(serializeErrors);
    }
    toJson() {
        let obj = {};
        SeriliazersMapper_1.default.getFieldSerializers(this.constructor.prototype).forEach(prop => {
            obj[prop.jsonPropertyName] = prop.marshaller(this[prop.classPropertyName], obj, this);
        });
        return obj;
    }
    toString(tabLength = 4) {
        return JSON.stringify(this, null, tabLength);
    }
}
exports.default = Serializable;
