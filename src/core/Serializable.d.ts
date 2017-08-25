import 'reflect-metadata';
import { Either } from "scalts";
import { JsObject, JsArray } from "ts-json-definition";
import UnmarshallError from "../errors/UnmarshallError";
declare abstract class Serializable {
    static fromString<T>(str: string): Either<Error[], T>;
    static fromStringAsArray<T>(str: string): Either<Error[], Array<T>>;
    static fromJsObject<T>(jsObject: JsObject, jsonPath?: string[], classPath?: string[]): Either<UnmarshallError[], T>;
    static fromJsArray<T>(jsArray: JsArray, jsonPath?: string[], classPath?: string[]): Either<UnmarshallError[], T[]>;
    toJson(): JsObject;
    toString(tabLength?: number): string;
}
export default Serializable;
