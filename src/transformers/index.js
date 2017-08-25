"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scalts_1 = require("scalts");
const UnmarshallError_1 = require("../errors/UnmarshallError");
const Serializable_1 = require("../core/Serializable");
const utils_1 = require("../utils");
exports.defaultMarshaller = (value, json, clazz, classPropertyName, jsonPropertyName, target, mbType) => {
    const undefinedValue = null;
    return mbType.fold(value, (type) => {
        if (type === scalts_1.Optional) {
            return value.getOrElse(undefinedValue);
        }
        if (Serializable_1.default.prototype.isPrototypeOf(type.prototype)) {
            return value.toJson();
        }
        return value;
    });
};
exports.defaultUnmarshaller = (value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath) => {
    // if the value is not define and there is a default value
    if (!utils_1.isDefined(value) && utils_1.isDefined(clazz[classPropertyName])) {
        return scalts_1.Right(clazz[classPropertyName]);
    }
    return mbType.fold(scalts_1.Right(value), (type) => {
        if (type === String) {
            return stringUnmarshaller(value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath);
        }
        if (type === Number) {
            return numberUnmarshaller(value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath);
        }
        if (Serializable_1.default.prototype.isPrototypeOf(type.prototype)) {
            return type.prototype.constructor.fromJsObject(value, jsonPath, classPath);
        }
        if (type === Object) {
            return objectUnmarshaller(value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath);
        }
        const additionalMessage = `No unmarshaller found for type ${type['name']}`;
        return scalts_1.Left([new UnmarshallError_1.default(value, scalts_1.Some(type), jsonPropertyName, classPropertyName, target, jsonPath, classPath, scalts_1.Some(additionalMessage))]);
    });
};
const stringUnmarshaller = (value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath) => {
    if (typeof value === 'string') {
        return scalts_1.Right(value);
    }
    return scalts_1.Left([new UnmarshallError_1.default(value, scalts_1.Some(String), jsonPropertyName, classPropertyName, target, jsonPath, classPath)]);
};
const numberUnmarshaller = (value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath) => {
    if (typeof value === 'number') {
        return scalts_1.Right(value);
    }
    if (typeof value === 'string' && !isNaN(+value)) {
        return scalts_1.Right(+value);
    }
    return scalts_1.Left([new UnmarshallError_1.default(value, scalts_1.Some(Number), jsonPropertyName, classPropertyName, target, jsonPath, classPath)]);
};
const objectUnmarshaller = (value, json, clazz, classPropertyName, jsonPropertyName, target, mbType, jsonPath, classPath) => {
    if (typeof value === 'object') {
        return scalts_1.Right(value);
    }
    const additionalErrorMessage = scalts_1.Some("The value is not an object.");
    return scalts_1.Left([new UnmarshallError_1.default(value, scalts_1.Some(Object), jsonPropertyName, classPropertyName, target, jsonPath, classPath, additionalErrorMessage)]);
};
