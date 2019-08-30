import Component from '@ember/component';
import layout from '../templates/components/native-select-box';
import { readOnly } from '@ember/object/computed';
import { initValue, receiveValue } from '../utils/shared/value';
import { selectValue } from '../utils/native-select-box/value';
import api from '../utils/native-select-box/api';
import { initComponent, destroyComponent } from '../utils/component/lifecycle';
import {
  initOptions,
  registerOption,
  deregisterOption
} from '../utils/registration/option';
import {
  registerElement,
  deregisterElement
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
  domElementId: null,
  valueID: 0,

  // Computed state

  api: api(),
  isMultiple: readOnly('multiple'),

  init() {
    this._super(...arguments);
    initValue(this);
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
    },

    willDestroyElement(element) {
      deregisterElement(this, element);
      destroyComponent(this);
    },

    onInitOption(option) {
      registerOption(this, option);
    },

    onDestroyOption(option) {
      deregisterOption(this, option);
    },

    onChange() {
      selectValue(this);
    }
  }
});
