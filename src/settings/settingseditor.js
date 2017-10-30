import {settingsService} from "../app/app";
import {clone} from "../helpers";

export default class SettingsEditor {
  constructor() {

    this.state = {changes: null, lastAction: {}};

    this.data = {settings: settingsService.state};
    this.changing = {};
  }

  async save() {

    this.state.changes = 'saving';
    await settingsService.save();
    this.state.changes = 'saved';
  }

  async commit(action)
  {
    await this.save();

    if(action.undo) {
      let undo = action.undo;
      action.undo = async () => {
        undo();
        await this.save();
        this.state.changes = 'undid';
      }
    }

    this.state.lastAction = action;
  }

  change(value, oldvalue)
  {
    if(!oldvalue) return;

    this.state.changes = 'dirty';
    settingsService.applyChanges();

    if(this.changing.internal) {
      this.changing.internal = false;
      return;
    }

    if(this.changing.timeout) clearTimeout(this.changing.timeout);

    this.changing.timeout = setTimeout(() => this.save(), 1000);
  }

}