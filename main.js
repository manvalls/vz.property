var Property,
    map,
    object,
    top,
    property,
    WeakMap = global.WeakMap,
    counter;

if(!WeakMap){
  counter = 0;
  
  WeakMap = function(){
    Object.defineProperties(this,{
      _id: {value: counter++}
    });
  };
  
  Object.defineProperties(WeakMap.prototype,{
    delete: {value: function(object){
      return delete object['vzProperty' + this._id];
    }},
    get: {value: function(object){
      return object['vzProperty' + this._id];
    }},
    set: {value: function(object,value){
      
      Object.defineProperty(object,'vzProperty' + this._id,{
        configurable: true,
        value: value
      });
      
      return this;
    }}
  });
  
}

map = new WeakMap();
object = new WeakMap();

top = new WeakMap();
property = new WeakMap();

function objectValueOf(){
  return this.value;
}

function objectToString(){
  return [this.value].concat('');
}


function objectProperty(topObject,propertyName){
  top.set(this,topObject);
  property.set(this,propertyName);
}

function oGetter(){
  return top.get(this)[property.get(this)];
}

function oSetter(value){
  if(value === undefined){
    delete top.get(this)[property.get(this)];
    return;
  }
  
  top.get(this)[property.get(this)] = value;
}

Object.defineProperties(objectProperty.prototype,{
  value: {
    get: oGetter,
    set: oSetter
  },
  get: {value: oGetter},
  set: {value: oSetter},
  valueOf: {value: objectValueOf},
  toString: {value: objectToString}
});


function mapProperty(topMap,propertyObject){
  top.set(this,topMap);
  property.set(this,propertyObject);
}

function mGetter(){
  return top.get(this).get(property.get(this));
}

function mSetter(value){
  if(value === undefined){
    top.get(this).delete(property.get(this));
    return value;
  }
  
  top.get(this).set(property.get(this),value);
  return value;
}

Object.defineProperties(mapProperty.prototype,{
  value: {
    get: mGetter,
    set: mSetter
  },
  get: {value: mGetter},
  set: {value: mSetter},
  valueOf: {value: objectValueOf},
  toString: {value: objectToString}
});


module.exports = Property = function(){
  map.set(this,new WeakMap());
  object.set(this,{});
};

Object.defineProperties(Property.prototype,{
  of: {
    value: function(index){
      
      switch(typeof index){
        case 'object':
        case 'function':
          if(index !== null) return new mapProperty(map.get(this),index);
        default:
          return new objectProperty(map.get(this),index);
          break;
      }
      
    }
  }
});

