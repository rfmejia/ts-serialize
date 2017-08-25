"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scalts_1 = require("scalts");
const transformers_1 = require("../transformers");
const Serializable_1 = require("../core/Serializable");
const SeriliazersMapper_1 = require("../core/SeriliazersMapper");
function Serialize(mbJsonPropertyName, unmarshaller = transformers_1.defaultUnmarshaller, marshaller = transformers_1.defaultMarshaller, mbGivenType = scalts_1.None) {
    return function (target, classPropertyName) {
        if (!Serializable_1.default.prototype.isPrototypeOf(target)) {
            console.error(`Serialize decorator can only be used on a Serializable class.`);
            return;
        }
        let reflectedType = null;
        const jsonPropertyName = mbJsonPropertyName || classPropertyName;
        if (mbGivenType.isEmpty) {
            // type should be given to SerializeOpt / SerializeArray for Option / Array
            reflectedType = Reflect.getMetadata('design:type', target, classPropertyName);
            if (reflectedType === Array) {
                console.warn(`Please use SerializeArray instead of Serialize for Array serialization.`);
                return;
            }
            if (reflectedType === scalts_1.Optional) {
                console.warn(`Please use SerializeOpt instead of Serialize for Optional serialization.`);
                return;
            }
        }
        const mbReflectedType = reflectedType ? scalts_1.Some(reflectedType) : scalts_1.None;
        const mbType = mbGivenType.isEmpty ? mbReflectedType : mbGivenType;
        SeriliazersMapper_1.default.registerField(target, {
            unmarshaller: (value, json, clazz, jsonPath, classPath) => unmarshaller(value, json, clazz, jsonPropertyName, classPropertyName, target, mbType, jsonPath, classPath),
            marshaller: (value, json, clazz) => marshaller(value, json, clazz, jsonPropertyName, classPropertyName, target, mbType),
            classPropertyName,
            jsonPropertyName
        });
    };
}
exports.default = Serialize;
