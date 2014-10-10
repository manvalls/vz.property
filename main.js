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
  },
  default: {
    value: function(index,value){
      var obj,ret;
      
      switch(typeof index){
        case 'object':
        case 'function':
          if(index !== null){
            obj = map.get(this);
            if((ret = obj.get(index)) === undefined) obj.set(index,ret = value);
          }else if((ret = nullProp.get(this)) === undefined) nullProp.set(this,ret = value);
          break;
        case 'boolean':
          if(index){
            if((ret = trueProp.get(this)) === undefined) trueProp.set(this,ret = value);
          }else{
            if((ret = falseProp.get(this) === undefined)) falseProp.set(this,ret = value);
          }
          break;
        case 'string':
        case 'symbol':
          obj = string.get(this);
          if((ret = obj[index]) === undefined) obj[index] = ret = value;
          break;
        case 'number':
          obj = number.get(this);
          if((ret = obj[index]) === undefined) obj[index] = ret = value;
          break;
        case 'undefined':
          if((ret = undefProp.get(this) === undefined)) undefProp.set(this,ret = value);
          break;
      }
      
      return ret;
    }
  },
  rinc: {
    value: function(index,n){
      var v,_map;
      
      n = n || 1;
      
      switch(typeof index){
        case 'boolean':
          
          if(index){
            v = trueProp.get(this);
            trueProp.set(this,v + n);
            return v;
          }
          
          v = falseProp.get(this);
          falseProp.set(this,v + n);
          return v;
          
        case 'string':
          _map = string.get(this);
          v = _map[index];
          _map[index] += n
          return v;
        case 'number':
          _map = number.get(this);
          v = _map[index];
          _map[index] += n
          return v;
        case 'undefined':
          v = undefProp.get(this);
          undefProp.set(this,v + n);
          return v;
        case 'object':
        case 'function':
          if(index !== null){
            _map = map.get(this);
            v = _map.get(index);
            _map.set(index,v + n);
            return v;
          }
          
          v = nullProp.get(this);
          nullProp.set(this,v + n);
          return v;
      }
      
    }
  },
  linc: {
    value: function(index,n){
      var v,_map;
      
      n = n || 1;
      
      switch(typeof index){
        case 'boolean':
          
          if(index){
            v = trueProp.get(this) + n;
            trueProp.set(this,v);
            return v;
          }
          
          v = falseProp.get(this) + n;
          falseProp.set(this,v);
          return v;
          
        case 'string':
          _map = string.get(this);
          return _map[index] += n;
        case 'number':
          _map = number.get(this);
          return _map[index] += n;
        case 'undefined':
          v = undefProp.get(this) + n;
          undefProp.set(this,v);
          return v;
        case 'object':
        case 'function':
          if(index !== null){
            _map = map.get(this);
            v = _map.get(index) + n;
            _map.set(index,v);
            return v;
          }
          
          v = nullProp.get(this) + n;
          nullProp.set(this,v);
          return v;
      }
      
    }
  },
  rdec: {
    value: function(index,n){
      var v,_map;
      
      n = n || 1;
      
      switch(typeof index){
        case 'boolean':
          
          if(index){
            v = trueProp.get(this);
            trueProp.set(this,v - n);
            return v;
          }
          
          v = falseProp.get(this);
          falseProp.set(this,v - n);
          return v;
          
        case 'string':
          _map = string.get(this);
          v = _map[index];
          _map[index] -= n
          return v;
        case 'number':
          _map = number.get(this);
          v = _map[index];
          _map[index] -= n
          return v;
        case 'undefined':
          v = undefProp.get(this);
          undefProp.set(this,v - n);
          return v;
        case 'object':
        case 'function':
          if(index !== null){
            _map = map.get(this);
            v = _map.get(index);
            _map.set(index,v - n);
            return v;
          }
          
          v = nullProp.get(this);
          nullProp.set(this,v - n);
          return v;
      }
      
    }
  },
  ldec: {
    value: function(index,n){
      var v,_map;
      
      n = n || 1;
      
      switch(typeof index){
        case 'boolean':
          
          if(index){
            v = trueProp.get(this) - n;
            trueProp.set(this,v);
            return v;
          }
          
          v = falseProp.get(this) - n;
          falseProp.set(this,v);
          return v;
          
        case 'string':
          _map = string.get(this);
          return _map[index] -= n;
        case 'number':
          _map = number.get(this);
          return _map[index] -= n;
        case 'undefined':
          v = undefProp.get(this) - n;
          undefProp.set(this,v);
          return v;
        case 'object':
        case 'function':
          if(index !== null){
            _map = map.get(this);
            v = _map.get(index) - n;
            _map.set(index,v);
            return v;
          }
          
          v = nullProp.get(this) - n;
          nullProp.set(this,v);
          return v;
      }
      
    }
  }
});

