"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scalts_1 = require("scalts");
class UnmarshallError {
    constructor(value, type, jsonPropertyName, classPropertyName, target, jsonPath, classPath, additionalMessage = scalts_1.None) {
        this.value = value;
        this.type = type;
        this.jsonPropertyName = jsonPropertyName;
        this.classPropertyName = classPropertyName;
        this.target = target;
        this.jsonPath = jsonPath;
        this.classPath = classPath;
        this.additionalMessage = additionalMessage;
        this.name = 'UnmarshallError';
        const strJsonPath = jsonPath.concat(jsonPropertyName).join('.');
        const strClassPath = classPath.concat(classPropertyName).join('.');
        const baseMessage = `An error occured while serializing value '${strJsonPath}.${value}' into property [${target.constructor['name']}].${strClassPath} : ${type.fold('UnknownType', t => t['name'])}`;
        this.message = `${baseMessage}\n${additionalMessage.getOrElse('')}`;
    }
}
exports.default = UnmarshallError;
