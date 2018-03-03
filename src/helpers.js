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

export const days = ms => Math.round(ms / days.ratio);
days.ratio = 1000 * 60 * 60 * 24;
days.ms = day => day * days.ratio;

days.age = (date) =>
{
  return days(Date.now() - date);
};

function copyDeep(strict, target, source)
{
  let authority = strict ? target : source;
  if(authority && source) for (let key in authority)
  {
    if (authority[key] instanceof Object) {
      copyDeep(strict, target[key] || (target[key] = {}), source[key]);
    }
    else if (authority[key] instanceof Array) {
      (target[key] || (target[key] = [])).set(source[key] ? source[key].map(
          el => copyDeep(false, {}, el)) : []);
    }
    else if(!strict || source[key] != null) target[key] = source[key];
  }

  return target;
}

export const strictDeepCopy = copyDeep.bind(null, true);
export const deepCopy = copyDeep.bind(null, false);

export const clone = v => JSON.parse(JSON.stringify(v));

export const weightSort = (a,b) => b.weight - a.weight;