import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import index from '../../utils/general/index';
import {
  _initComponent,
  _destroyComponent
} from '../../utils/component/lifecycle';
import isSelected from '../../utils/shared/is-selected';
import isEqual from '../../utils/general/is-equal';
import layout from '../../templates/components/select-box/option';
import { receiveValue } from '../../utils/component/value';
import { _activateOption } from '../../utils/select-box/option/activate';
import { _selectOption } from '../../utils/select-box/option/select';
import api from '../../utils/select-box/option/api';
import {
  registerElement,
  deregisterElement
} from '../../utils/registration/element';

export default Component.extend({
  layout,
  tagName: '',

  // Arguments

  classNamePrefix: '',
  selectBox: null,
  value: undefined,
  disabled: false,
  selected: undefined,

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
  index: index('selectBox.options'),
  isActive: isEqual('index', 'selectBox.activeOptionIndex'),
  isDisabled: readOnly('disabled'),
  isSelected: isSelected(),

  init() {
    this._super(...arguments);
    _initComponent(this);
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
      _destroyComponent(this);
    },

    onMouseEnter() {
      _activateOption(this);
    },

    onClick() {
      _selectOption(this);
    }
  }
});
