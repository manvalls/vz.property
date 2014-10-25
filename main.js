var Property,
    Su = require('vz.rand').Su,
    
    su = Su(),
    string = Su(),
    number = Su(),
    undefProp = Su(),
    nullProp = Su(),
    trueProp = Su(),
    falseProp = Su(),
    
    top = Su(),
    property = Su();

function retProp(tob,prop){
  this[top] = tob;
  this[property] = prop;
}

function getter(){
  return this[top].get(this[property]);
}

function setter(value){
  return this[top].set(this[property],value);
}

Object.defineProperties(retProp.prototype,{
  value: {
    get: getter,
    set: setter
  },
  get: {value: getter},
  set: {value: setter},
  rinc: {value: function(n){ return this[top].rinc(this[property],n); }},
  linc: {value: function(n){ return this[top].linc(this[property],n); }},
  rdec: {value: function(n){ return this[top].rdec(this[property],n); }},
  ldec: {value: function(n){ return this[top].ldec(this[property],n); }},
  valueOf: {value: function(){
    return this.value;
  }},
  toString: {value: function(){
    return [this.value].concat('');
  }}
});


module.exports = Property = function(){
  this[su] = Su();
  this[string] = {};
  this[number] = {};
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
        case 'boolean': return index?this[trueProp]:this[falseProp];
        case 'string':return this[string][index];
        case 'number': return this[number][index];
        case 'undefined': return this[undefProp];
        case 'object':
        case 'function':
          if(index !== null) return index[this[su]];
          return this[nullProp];
      }
      
    }
  },
  set: {
    value: function(index,value){
      
      if(value === undefined) switch(typeof index){
        case 'boolean':
          index?delete this[trueProp]:delete this[falseProp];
          break;
        case 'string':
          delete this[string][index];
          break;
        case 'number':
          delete this[number][index];
          break;
        case 'undefined':
          delete this[undefProp];
          break;
        case 'object':
        case 'function':
          if(index !== null) delete index[this[su]];
          else delete this[nullProp];
          break;
      }
      else switch(typeof index){
        case 'boolean':
          index?this[trueProp] = value:this[falseProp] = value;
          break;
        case 'string':
          this[string][index] = value;
          break;
        case 'number':
          this[number][index] = value;
          break;
        case 'undefined':
          this[undefProp] = value;
          break;
        case 'object':
        case 'function':
          if(index !== null) index[this[su]] = value;
          else this[nullProp] = value;
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
            obj = this[su];
            if((ret = index[obj]) === undefined) index[obj] = ret = value;
          }else if((ret = this[nullProp]) === undefined) this[nullProp] = ret = value;
          break;
        case 'boolean':
          if(index){
            if((ret = this[trueProp]) === undefined) this[trueProp] = ret = value;
          }else{
            if((ret = this[falseProp]) === undefined) this[falseProp] = ret = value;
          }
          break;
        case 'string':
        case 'symbol':
          obj = this[string];
          if((ret = obj[index]) === undefined) obj[index] = ret = value;
          break;
        case 'number':
          obj = this[number];
          if((ret = obj[index]) === undefined) obj[index] = ret = value;
          break;
        case 'undefined':
          if((ret = this[undefProp]) === undefined) this[undefProp] = ret = value;
          break;
      }
      
      return ret;
    }
  },
  rinc: {
    value: function(index,n){
      var v,map;
      
      n = n || 1;
      
      switch(typeof index){
        case 'boolean':
          
          if(index){
            v = this[trueProp];
            this[trueProp] = v + n;
            return v;
          }
          
          v = this[falseProp];
          this[trueProp] = v + n;
          return v;
          
        case 'string':
          map = this[string];
          v = map[index];
          map[index] += n;
          return v;
        case 'number':
          map = this[number];
          v = map[index];
          map[index] += n;
          return v;
        case 'undefined':
          v = this[undefProp];
          this[undefProp] = v + n;
          return v;
        case 'object':
        case 'function':
          if(index !== null){
            map = this[su];
            v = index[map];
            index[map] = v + n;
            return v;
          }
          
          v = this[nullProp];
          this[nullProp] = v + n;
          return v;
      }
      
    }
  },
  linc: {
    value: function(index,n){
      var v,map;
      
      n = n || 1;
      
      switch(typeof index){
        case 'boolean':
          if(index) return this[trueProp] += n;
          return this[falseProp] += n;
          
        case 'string':
          return this[string][index] += n;
          
        case 'number':
          return this[number][index] += n;
          
        case 'undefined':
          return this[undefProp] += n;
          
        case 'object':
        case 'function':
          if(index !== null) return index[this[su]] += n;
          return this[nullProp] += n;
      }
      
    }
  },
  rdec: {
    value: function(index,n){
      n = n || 1;
      return this.rinc(index,-n);
    }
  },
  ldec: {
    value: function(index,n){
      n = n || 1;
      return this.linc(index,-n);
    }
  }
});

