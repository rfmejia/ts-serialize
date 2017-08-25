"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scalts_1 = require("scalts");
const transformers_1 = require("../transformers");
const Serialize_1 = require("./Serialize");
const NoneJsValue = null;
const SerializeOpt = function (type, jsonPropertyName, unmarshaller = transformers_1.defaultUnmarshaller, marshaller = transformers_1.defaultMarshaller) {
    const optUnmarshaller = (jsValue, json, clazz, jsonPropertyName, classPropertyName, target, mbType, jsonPath, classPath) => {
        return scalts_1.Optional.apply(jsValue).fold(scalts_1.Right(scalts_1.None), value => {
            return unmarshaller(value, json, clazz, jsonPropertyName, classPropertyName, target, mbType, jsonPath, classPath)
                .fold(e => scalts_1.Left(e), v => scalts_1.Right(scalts_1.Some(v)));
        });
    };
    const optMarshaller = (value, json, clazz, jsonPropertyName, classPropertyName, target, mbType) => {
        if (value.isEmpty) {
            return NoneJsValue;
        }
        else {
            return marshaller(value.get(), json, clazz, jsonPropertyName, classPropertyName, target, mbType);
        }
    };
    return Serialize_1.default(jsonPropertyName, optUnmarshaller, optMarshaller, scalts_1.Some(type));
};
exports.default = SerializeOpt;
