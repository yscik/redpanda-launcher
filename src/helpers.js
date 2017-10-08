Array.prototype.remove = Array.prototype.remove || function(item)
{
  let index;
  if((index = this.indexOf(item)) != -1)
    this.splice(index, 1);

  return this;
};