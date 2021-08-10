/*
    A simple function that generate a uid
*/  

//eslint-disable-next-line @typescript-eslint/no-var-requires
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
 
export default function GenerateUID() {
    return uidgen.generateSync();
}
