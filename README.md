# vz Property

[![NPM](https://nodei.co/npm/vz.property.png?downloads=true)](https://nodei.co/npm/vz.property/)

No piece of software is ever completed, feel free to contribute and be humble

## Sample usage:

```javascript

var Property = require('vz.property'),
    topSecretName = new Property(),
    john;

function Person(name){
  this.name = name;
  topSecretName.of(this).value = 'Agent ' + name;
  // == topSecretName.of(this).set('Agent ' + name);
  // == topSecretName.set(this,'Agent ' + name);
}

john = new Person('John');
john.name; // John
topSecretName.of(john).value; // Agent John
// == topSecretName.of(john).get();
// == topSecretName.get(john);

```

