import Mixin from '@ember/object/mixin';
import { bind, scheduleOnce } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import { get } from '@ember/object';
const { seal } = Object;

export default Mixin.create({
  init() {
    this.set('api', this._buildApi());
    this._super(...arguments);
    scheduleOnce('afterRender', this, '_updateApiElement');
  },

  _buildApi() {
    return seal(
      assign(
        {
          value: undefined,
          element: undefined,
          isOpen: undefined
        },
        this._apiActions()
      )
    );
  },

  _updateApiElement() {
    this._updateApi('element', this.element);
  },

  _updateApi(key, value) {
    if (this.isDestroyed) {
      return;
    }

    this.set(`api.${key}`, value);
  },

  _apiActions() {
    return [
      'open',
      'close',
      'toggle',
      'select',
      'update',
      'selectActiveOption',
      'search',
      'stopSearching',
      'setInputValue',
      'focusInput',
      'blurInput',
      'activateOptionAtIndex',
      'activateNextOption',
      'activatePreviousOption',
      'activateOptionForKeyCode',
      'deactivateOptions',
      'activateSelectedOptionAtIndex',
      'activateNextSelectedOption',
      'activatePreviousSelectedOption',
      'deactivateSelectedOptions'
    ].reduce((actions, name) => {
      actions[name] = bind(this, get(this, `actions.${name}`));
      return actions;
    }, {});
  },

  actions: {
    _updated() {
      this._updateApi('value', this.internalValue);
      this._super(...arguments);
    },

    open() {
      this._super(...arguments);
      this._updateApi('isOpen', true);
    },

    close() {
      this._super(...arguments);
      this._updateApi('isOpen', false);
    }
  }
});
