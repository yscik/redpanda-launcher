
let search, settings, data;

export function attach(app)
{
  let state = app.attach();

  ({settings, search} = state);
}

export {search, settings}