var Property,
    
    map,
    string,
    number,
    undefProp,
    nullProp,
    trueProp,
    falseProp,
    
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
string = new WeakMap();
number = new WeakMap();
undefProp = new WeakMap();
nullProp = new WeakMap();
trueProp = new WeakMap();
falseProp = new WeakMap();

top = new WeakMap();
property = new WeakMap();


function retProp(tob,prop){
  top.set(this,tob);
  property.set(this,prop);
}

function getter(){
  return top.get(this).get(property.get(this));
}

function setter(value){
  return top.get(this).set(property.get(this),value);
}

Object.defineProperties(retProp.prototype,{
  value: {
    get: getter,
    set: setter
  },
  get: {value: getter},
  set: {value: setter},
  valueOf: {value: function(){
    return this.value;
  }},
  toString: {value: function(){
    return [this.value].concat('');
  }}
});


module.exports = Property = function(){
  map.set(this,new WeakMap());
  string.set(this,{});
  number.set(this,{});
};

Object.defineProperties(Property.prototype,{
  of: {
    value: function(index){
      return new retProp(this,index);
    }
  },
  get: {
    value: function(index){
      
      switch(typeof index){
        case 'boolean': return index?trueProp.get(this):falseProp.get(this);
        case 'string':return string.get(this)[index];
        case 'number': return number.get(this)[index];
        case 'undefined': return undefProp.get(this);
        case 'object':
        case 'function':
          if(index !== null) return map.get(this).get(index);
          else return nullProp.get(this);
      }
      
    }
  },
  set: {
    value: function(index,value){
      
      if(value === undefined) switch(typeof index){
        case 'boolean':
          index?trueProp.delete(this):falseProp.delete(this);
          break;
        case 'string':
          delete string.get(this)[index];
          break;
        case 'number':
          delete number.get(this)[index];
          break;
        case 'undefined':
          undefProp.delete(this);
          break;
        case 'object':
        case 'function':
          if(index !== null) map.get(this).delete(index);
          else nullProp.delete(this);
          break;
      }
      else switch(typeof index){
        case 'boolean':
          index?trueProp.set(this,value):falseProp.set(this,value);
          break;
        case 'string':
          string.get(this)[index] = value;
          break;
        case 'number':
          number.get(this)[index] = value;
          break;
        case 'undefined':
          undefProp.set(this,value);
          break;
        case 'object':
        case 'function':
          if(index !== null) map.get(this).set(index,value);
          else nullProp.set(this,value);
          break;
      }
      
      return this;
    }
  }
});

