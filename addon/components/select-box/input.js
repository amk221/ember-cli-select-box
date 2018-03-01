import Component from '@ember/component';
import invokeAction from '../../utils/invoke-action';
import Nameable from  '../../mixins/general/nameable';
import Registerable from  '../../mixins/general/registerable';

const mixins = [
  Nameable,
  Registerable
];

export default Component.extend(...mixins, {
  tagName: 'input',
  type: '',

  attributeBindings: [
    'accept',
    'autocapitalize',
    'autocomplete',
    'autocorrect',
    'autofocus',
    'autosave',
    'dir',
    'disabled',
    'form',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'inputmode',
    'lang',
    'list',
    'max',
    'maxlength',
    'min',
    'minlength',
    'multiple',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'selectionDirection',
    'size',
    'spellcheck',
    'step',
    'tabindex',
    'title',
    'type',
    'value',
    'width'
  ],

  classNameSuffix: 'input',

  input() {
    this._super(...arguments);
    const value = this.get('element.value');
    if (!value) {
      invokeAction(this, 'on-clear', this.get('-api'));
    }
    invokeAction(this, '-on-input', value);
    invokeAction(this, 'on-input', value, this.get('-api'));
  },

  keyDown(e) {
    this._super(...arguments);
    if (e.which === 8 && !this.get('element.value')) {
      invokeAction(this, 'on-delete', this.get('-api'));
    }
  }
});
