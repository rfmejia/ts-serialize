"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SerializersMapper;
(function (SerializersMapper) {
    function getFieldSerializers(target) {
        return Reflect.getMetadata("design:serializers", target) || [];
    }
    SerializersMapper.getFieldSerializers = getFieldSerializers;
    function registerField(target, field) {
        const currentMetadata = getFieldSerializers(target);
        if (currentMetadata) {
            Reflect.defineMetadata("design:serializers", [...currentMetadata, field], target);
        }
        else {
            Reflect.defineMetadata("design:serializers", [field], target);
        }
    }
    SerializersMapper.registerField = registerField;
})(SerializersMapper || (SerializersMapper = {}));
exports.default = SerializersMapper;
