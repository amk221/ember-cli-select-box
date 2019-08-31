import Component from '@ember/component';
import { bool } from '@ember/object/computed';
import layout from '../templates/components/native-select-box';
import { receiveValue, selectValue, updateValue } from '../utils/shared/value';
import { selectValue as _selectValue } from '../utils/native-select-box/value';
import api from '../utils/native-select-box/api';
import { destroyComponent, initComponent } from '../utils/component/lifecycle';
import {
  destroyElement,
  insertElement
} from '../utils/native-select-box/element';
import {
  deregisterOption,
  initOptions,
  registerOption
} from '../utils/registration/option';
import {
  deregisterElement,
  registerElement
} from '../utils/registration/element';

export default Component.extend({
  layout,
  tagName: '',

  // Arguments

  classNamePrefix: '',
  disabled: false,
  multiple: false,
  value: undefined,

  // Actions

  onSelect: null,
  onUpdate: null,

  // State

  resolvedValue: null,
  previousResolvedValue: null,
  isPending: true,
  isRejected: false,
  isFulfilled: false,
  isSettled: false,
  domElement: null,
  id: null,
  valueID: 0,
  memoisedAPI: null,

  // Computed state

  api: api(),
  isMultiple: bool('multiple'),

  init() {
    this._super(...arguments);
    initOptions(this);
    initComponent(this);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    receiveValue(this);
  },

  actions: {
    // Internal actions

    didInsertElement(element) {
      registerElement(this, element);
      insertElement(this);
    },

    willDestroyElement(element) {
      deregisterElement(this, element);
      destroyElement(this);
      destroyComponent(this);
    },

    onInitOption(option) {
      registerOption(this, option);
    },

    onDestroyOption(option) {
      deregisterOption(this, option);
    },

    onChange() {
      _selectValue(this);
    },

    // Public API Actions

    select(value) {
      return selectValue(this, value);
    },

    update(value) {
      return updateValue(this, value);
    }
  }
});
