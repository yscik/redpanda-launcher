
export class Engine
{
  constructor(data)
  {
    Object.assign(this, data);
    this.data = data;
    this.createId();
    if(!this.config) this.config = {active: true, keyword: null, pending: false}
  }

  createId() {
    this.id = this.url
  }

  configure(config)
  {
    if(config) Object.assign(this.config, config);

    return this.config;
  }

  get active() { return this.config.active; }


}