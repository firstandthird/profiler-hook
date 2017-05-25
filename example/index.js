'use strict';
const ProfileHook = require('../');

const profile = new ProfileHook();

profile.toggle();

let num = 0;
for (let i = 0; i < 10000; i++) {
  num += i * 123;
}
console.log(num);

profile.toggle();
