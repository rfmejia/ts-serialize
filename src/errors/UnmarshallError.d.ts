import { JsValue } from "ts-json-definition";
import { Optional } from "scalts";
export default class UnmarshallError implements Error {
    value: JsValue;
    type: Optional<Function>;
    jsonPropertyName: string;
    classPropertyName: string;
    target: Function;
    jsonPath: string[];
    classPath: string[];
    additionalMessage: Optional<string>;
    message: string;
    name: string;
    constructor(value: JsValue, type: Optional<Function>, jsonPropertyName: string, classPropertyName: string, target: Function, jsonPath: string[], classPath: string[], additionalMessage?: Optional<string>);
}
