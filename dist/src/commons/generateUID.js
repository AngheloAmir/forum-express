"use strict";
/*
    A simple function that generate a uid
*/
Object.defineProperty(exports, "__esModule", { value: true });
//eslint-disable-next-line @typescript-eslint/no-var-requires
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
function GenerateUID() {
    return uidgen.generateSync();
}
exports.default = GenerateUID;
