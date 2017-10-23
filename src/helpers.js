Array.prototype.remove = Array.prototype.remove || function (item) {
  let index;
  if ((index = this.indexOf(item)) != -1)
    this.splice(index, 1);

  return this;
};

Array.prototype.set = function (newValue) {
  this.length = 0;
  Array.prototype.push.apply(this, newValue);
  return this;
};

export const days = ms => ms / days.ratio;
days.ratio = 1000 * 60 * 60 * 24;
days.ms = day => day * days.ratio;

function deepCopy(strict, target, source)
{
  let authority = strict ? target : source;
  if(authority && source) for (let key in authority)
  {
    if (authority[key] instanceof Object) {
      deepCopy(strict, target[key] || (target[key] = {}), source[key]);
    }
    else if (authority[key] instanceof Array) {
      (target[key] || (target[key] = [])).set(source[key] ? source[key].map(
          el => deepCopy(false, {}, el)) : []);
    }
    else target[key] = source[key];
  }

  return target;
}

export const strictDeepCopy = deepCopy.bind(null, true);

export const clone = v => JSON.parse(JSON.stringify(v));
