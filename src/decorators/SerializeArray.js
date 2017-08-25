"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scalts_1 = require("scalts");
const transformers_1 = require("../transformers");
const UnmarshallError_1 = require("../errors/UnmarshallError");
const Serialize_1 = require("./Serialize");
const utils_1 = require("../utils");
exports.SerializeArray = function (type, jsonPropertyName, unmarshaller = transformers_1.defaultUnmarshaller, marshaller = transformers_1.defaultMarshaller) {
    const arrayUnmarshaller = (value, json, clazz, jsonPropertyName, classPropertyName, target, mbType, jsonPath, classPath) => {
        if (!Array.isArray(value)) {
            // if there is a default value
            if (utils_1.isDefined(clazz[classPropertyName])) {
                return scalts_1.Right(clazz[classPropertyName]);
            }
            return scalts_1.Left([new UnmarshallError_1.default(value, scalts_1.Some(Array), jsonPropertyName, classPropertyName, target, jsonPath, classPath)]);
        }
        else {
            return value.reduce((acc, curr) => {
                if (acc.isLeft) {
                    return acc;
                }
                const currRes = unmarshaller(curr, json, clazz, jsonPropertyName, classPropertyName, target, mbType, jsonPath, classPath);
                if (currRes.isLeft) {
                    return scalts_1.Left(currRes.left().get());
                }
                return scalts_1.Right(acc.right().get().concat(currRes.right().get()));
            }, scalts_1.Right([]));
        }
    };
    const arrayMarshaller = (value, json, clazz, jsonPropertyName, classPropertyName, target, mbType) => {
        return value.map(v => marshaller(v, json, clazz, jsonPropertyName, classPropertyName, target, mbType));
    };
    return Serialize_1.default(jsonPropertyName, arrayUnmarshaller, arrayMarshaller, scalts_1.Some(type));
};
exports.default = exports.SerializeArray;
