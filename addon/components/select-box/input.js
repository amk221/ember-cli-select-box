import Component from '@ember/component';
import {
  _initComponent,
  _destroyComponent
} from '../../utils/shared/lifecycle';
import { input, keyDown } from '../../utils/select-box/input/keyboard';
import layout from '../../templates/components/select-box/input';
import {
  registerElement,
  deregisterElement
} from '../../utils/registration/element';

export default Component.extend({
  layout,
  tagName: '',

  // Arguments

  selectBox: null,
  classNamePrefix: '',

  // State

  domElement: null,
  domElementId: null,

  // Actions

  onInput: null,
  onDelete: null,
  onClear: null,

  init() {
    this._super(...arguments);
    _initComponent(this);
  },

  actions: {
    // Internal actions

    didInsertElement(element) {
      registerElement(this, element);
    },

    willDestroyElement(element) {
      deregisterElement(this, element);
      _destroyComponent(this);
    },

    onInput(e) {
      input(this, e);
    },

    onKeyDown(e) {
      keyDown(this, e);
    }
  }
});
