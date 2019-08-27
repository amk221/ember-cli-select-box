import Component from '@ember/component';
import layout from '../templates/components/select-box';
import API from '../mixins/select-box/api';
import { readOnly, or } from '@ember/object/computed';
import { computed, get, set } from '@ember/object';
import scrollIntoView from '../utils/scroll-into-view';
import escapeRegExp from '../utils/escape-regexp';
import collapseWhitespace from '../utils/collapse-whitespace';
import { A as emberA } from '@ember/array';
import { capitalize } from '@ember/string';
import invokeAction from '../utils/actions/invoke';
import { bind, scheduleOnce, debounce } from '@ember/runloop';
import { resolve } from 'rsvp';
import { isPresent } from '@ember/utils';
import buildSelection from '../utils/build-selection';
import { assert } from '@ember/debug';
import registerElement from '../utils/register-element';
import deregisterElement from '../utils/deregister-element';
import activateAction from '../utils/actions/activate';
import initOptions from '../utils/init-options';
import initAction from '../utils/actions/init';
import focusInAction from '../utils/actions/focus-in';
import focusOutAction from '../utils/actions/focus-out';
import selectAction from '../utils/actions/select';
import update from '../utils/update';
const { fromCharCode } = String;
export const COLLECT_CHARS_MS = 1000;

export const keys = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  27: 'escape',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

const mixins = [
  API
];

export default Component.extend(...mixins, {
  layout,
  tagName: '',

  tabIndex: '0',
  isOpen: false,

  searchMinChars: 1,
  searchDelayTime: 100,
  searchSlowTime: 500,

  isMultiple: readOnly('multiple'),
  isBusy: or('isPending', 'isSearching'),

  activeSelectedOption: computed(
    'activeSelectedOptionIndex',
    'selectedOptions',
    function() {
      return this.selectedOptions.objectAt(
        get(this, 'activeSelectedOptionIndex')
      );
    }),

  activeOption: computed('activeOptionIndex', 'options', function() {
    return this.options.objectAt(get(this, 'activeOptionIndex'));
  }),

  init() {
    this._super(...arguments);
    //set(this, 'api', this._buildApi());
    this._deactivateOptions();
    this._deactivateSelectedOptions();
    initOptions(this);
    set(this, '_selectedOptions', emberA());
    set(this, 'selectedOptions', emberA());
    initAction(this);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (isPresent(this.disabled)) {
      set(this, 'isDisabled', Boolean(this.disabled));
    }

    set(this, 'tabIndex', this.isDisabled ? '-1' : '0');

    if (isPresent(this.open)) {
      set(this, 'isOpen', this.open);
    }

    update(this, this.value);
  },

  actions: {
    activateOptionAtIndex(index, scroll = false) {
      this._activateOptionAtIndex(index, scroll);
    },

    activateSelectedOptionAtIndex(index, scroll = false) {
      this._activateSelectedOptionAtIndex(index, scroll);
    },

    activateNextOption(scroll = true) {
      const next = this.activeOptionIndex + 1;
      this._activateOptionAtIndex(next, scroll);
    },

    activateNextSelectedOption(scroll = true) {
      const next = this.activeSelectedOptionIndex + 1;
      this._activateSelectedOptionAtIndex(next, scroll);
    },

    activatePreviousOption(scroll = true) {
      const prev = this.activeOptionIndex - 1;
      this._activateOptionAtIndex(prev, scroll);
    },

    activatePreviousSelectedOption(scroll = true) {
      const prev = this.activeSelectedOptionIndex - 1;
      this._activateSelectedOptionAtIndex(prev, scroll);
    },

    activateOptionForKeyCode(keyCode, scroll = true) {
      const char = fromCharCode(keyCode);

      if (char) {
        this._activateOptionForChar(char, scroll);
      }
    },

    deactivateOptions() {
      this._deactivateOptions();
    },

    deactivateSelectedOptions() {
      this._deactivateSelectedOptions();
    },

    onFocusIn(e) {
      this._super(...arguments);

      if (this.isDestroyed) {
        return;
      }

      set(this, 'isFocused', true);
      focusInAction(this, e);
    },

    onFocusOut(e) {
      this._super(...arguments);

      if (this.isDestroyed) {
        return;
      }

      try {
        set(this, 'isFocused', false);
      } catch (error) {
        // https://github.com/emberjs/ember.js/issues/18043
      }

      focusOutAction(this, e);
    },

    didInsertElement(element) {
      registerElement(this, element);

      set(this, '_documentClickHandler', bind(this, '_clickDocument'));
      document.addEventListener('click', this._documentClickHandler);
      document.addEventListener('touchstart', this._documentClickHandler);

      this._updateApi('element', this.domElement);

      invokeAction(this, 'onInsertElement', this.api);
    },

    willDestroyElement(element) {
      deregisterElement(this, element);

      document.removeEventListener('click', this._documentClickHandler);
      document.removeEventListener('touchstart', this._documentClickHandler);
    },

    _registerInput(input) {
      assert('select-box can only have 1 input', !this.input);

      set(this, 'input', input);
      scheduleOnce('afterRender', this, '_configureAsCombobox');
    },

    _deregisterInput() {
      set(this, 'input', null);
      scheduleOnce('afterRender', this, '_configureAsNotACombobox');
    },

    _registerOptionsContainer(container) {
      assert(
        'A select box can only have 1 options container',
        !this._optionsContainer
      );
      set(this, '_optionsContainer', container);
    },

    _deregisterOptionsContainer() {
      set(this, '_optionsContainer', null);
    },

    setInputValue(value) {
      if (this.isDestroyed || !this.input) {
        return;
      }

      set(this, 'input.domElement.value', value);
    },

    focusInput() {
      if (this.isDestroyed || !this.input) {
        return;
      }

      this.input.domElement.focus();
    },

    blurInput() {
      if (this.isDestroyed || !this.input) {
        return;
      }

      this.input.domElement.blur();
    },

    _registerOption(option) {
      this._options.addObject(option);
      this._scheduleUpdateOptions();
    },

    _deregisterOption(option) {
      this._options.removeObject(option);
      this._scheduleUpdateOptions();
    },

    _registerSelectedOption(selectedOption) {
      this._selectedOptions.addObject(selectedOption);
      this._scheduleUpdateSelectedOptions();
    },

    _deregisterSelectedOption(selectedOption) {
      this._selectedOptions.removeObject(selectedOption);
      this._scheduleUpdateSelectedOptions();
    },

    _registerSelectedOptionsContainer(container) {
      assert(
        'A select box can only have 1 selected options container',
        !this._selectedOptionsContainer
      );
      set(this, '_selectedOptionsContainer', container);
    },

    _deregisterSelectedOptionsContainer() {
      set(this, '_selectedOptionsContainer', null);
    },

    _onKeyPress(e) {
      this._super(...arguments);

      invokeAction(this, `onPressKey`, e, this.api);
    },

    _onKeyDown(e) {
      this._super(...arguments);

      let key = keys[e.keyCode];

      if (key) {
        key = capitalize(key);

        invokeAction(this, `onPress${key}`, e, this.api);
        invokeAction(this, `_onPress${key}`, e);
      }
    },

    open() {
      this._super(...arguments);

      if (this.isDestroyed) {
        return;
      }

      set(this, 'isOpen', true);
      this._updateApi('isOpen', true);
      invokeAction(this, 'onOpen', this.api);
    },

    close() {
      this._super(...arguments);

      if (this.isDestroyed) {
        return;
      }

      set(this, 'isOpen', false);
      this._updateApi('isOpen', false);
      invokeAction(this, 'onClose', this.api);
    },

    toggle() {
      this._super(...arguments);

      if (this.isOpen) {
        this.send('close');
      } else {
        this.send('open');
      }
    },

    search(query) {
      return this._search(query);
    },

    stopSearching() {
      this.incrementProperty('searchID');
      this._searchFinished();
    },

    _inputText(text) {
      this._super(...arguments);
      this._maybeSearch(text);
    },

    selectActiveOption() {
      const activeOption = get(this, 'activeOption');

      if (activeOption) {
        activeOption.send('select');
      }
    },

    async select(value) {
      value = buildSelection(this, value);
      await update(this, value);
      selectAction(this);
    },

    update(value) {
      update(this, value);
    }
  },

  _onPressEnter() {
    this._super(...arguments);
    this.send('selectActiveOption');
  },

  clickDocument(e) {
    this._super(...arguments);
    const el = this.domElement;
    const clickedSelf = el === e.target;
    const clickedInside = el.contains(e.target);
    const clickedOutside = !clickedSelf && !clickedInside;

    if (clickedOutside) {
      this.clickOutside(e);
    }
  },

  _activateOptionAtIndex(index, scroll) {
    const under = index < 0;
    const over = index > this.options.length - 1;

    if (!(under || over)) {
      set(this, 'activeOptionIndex', index);
      this._activatedOption();
    }

    if (scroll) {
      this._scrollActiveOptionIntoView();
    }
  },

  _activateSelectedOptionAtIndex(index, scroll) {
    const under = index < 0;
    const over = index > this.selectedOptions.length - 1;

    if (!(under || over)) {
      set(this, 'activeSelectedOptionIndex', index);
      this._activatedSelectedOption();
    }

    if (scroll) {
      this._scrollActiveSelectedOptionIntoView();
    }
  },

  _activateOptionForChar(char, scroll) {
    const lastChars = this._activateOptionChars || '';
    const lastMs = this._activateOptionMs || 0;
    const lastIndex = this._activateOptionIndex || 0;
    const lastChar = lastChars.substring(lastChars.length - 1);
    const ms = Date.now();
    const duration = ms - lastMs;
    const repeatedChar = char === lastChar;
    const reset = duration > COLLECT_CHARS_MS;
    const chars = reset ? char : `${lastChars}${char}`;
    let options = this._findOptionsMatchingChars(chars);
    let index = 0;
    let option;

    if (repeatedChar) {
      index = lastIndex + 1;
      options = this._findOptionsMatchingChars(lastChar);
      option = options[index];
    }

    if (!option) {
      index = 0;
      option = options[index];
    }

    if (option) {
      this.send('activateOptionAtIndex', get(option, 'index'), scroll);
    }

    set(this, '_activateOptionChars', chars);
    set(this, '_activateOptionMs', ms);
    set(this, '_activateOptionIndex', index);
  },

  _findOptionsMatchingChars(chars) {
    chars = escapeRegExp(chars);

    const pattern = new RegExp(`^${chars}`, 'i');

    return this.options.filter(option => {
      return pattern.test(collapseWhitespace(option.domElement.textContent));
    });
  },

  _activatedOption() {
    const activeOption = get(this, 'activeOption');

    if (activeOption) {
      activateAction(activeOption);
    }
  },

  _activatedSelectedOption() {
    const activeSelectedOption = get(this, 'activeSelectedOption');

    if (activeSelectedOption) {
      activateAction(activeSelectedOption);
    }
  },

  _deactivateOptions() {
    set(this, 'activeOptionIndex', -1);
  },

  _deactivateSelectedOptions() {
    set(this, 'activeSelectedOptionIndex', -1);
  },

  _scrollActiveOptionIntoView() {
    const activeOption = get(this, 'activeOption');

    if (activeOption) {
      scrollIntoView(activeOption.domElement);
    }
  },

  _scrollActiveSelectedOptionIntoView() {
    const activeSelectedOption = get(this, 'activeSelectedOption');

    if (activeSelectedOption) {
      scrollIntoView(activeSelectedOption.domElement);
    }
  },

  _clickDocument() {
    if (this.isDestroyed) {
      return;
    }

    this.clickDocument(...arguments);
  },

  clickOutside(e) {
    this._super(...arguments);
    invokeAction(this, 'onClickOutside', e, this.api);
  },

  _configureAsCombobox() {
    if (this.isDestroyed) {
      return;
    }

    set(this, 'tabIndex', '-1');
    set(this, 'role', 'combobox');
  },

  _configureAsNotACombobox() {
    if (this.isDestroyed) {
      return;
    }

    set(this, 'tabIndex', '0');
    set(this, 'role', null);
  },

  _scheduleUpdateOptions() {
    scheduleOnce('afterRender', this, '_updateOptions');
  },

  _updateOptions() {
    set(this, 'options', emberA(this._options.toArray()));
  },

  _scheduleUpdateSelectedOptions() {
    scheduleOnce('afterRender', this, '_updateSelectedOptions');
  },

  _updateSelectedOptions() {
    set(this, 'selectedOptions', emberA(this._selectedOptions.toArray()));
  },

  _isSearchable() {
    return typeof this.onSearch === 'function';
  },

  _queryOK(query) {
    return query.length >= get(this, 'searchMinChars');
  },

  _maybeSearch(text) {
    if (this._isSearchable()) {
      this._runDebouncedSearch(text);
    }
  },

  _runDebouncedSearch(query) {
    const delay = get(this, 'searchDelayTime');
    const immediate = !delay;
    debounce(this, '_runSearch', query, delay, immediate);
  },

  _runSearch(query) {
    query = `${query}`.trim();

    if (this.isDestroyed || !this._queryOK(query)) {
      return;
    }

    this._search(query);
  },

  _search(query = '') {
    set(this, 'isSearching', true);

    this.incrementProperty('searchID');

    debounce(this, '_checkSlowSearch', get(this, 'searchSlowTime'));

    const search = invokeAction(this, 'onSearch', query, this.api);

    return resolve(search)
      .then(bind(this, '_searchCompleted', this.searchID, query))
      .catch(bind(this, '_searchFailed', query))
      .finally(bind(this, '_searchFinished'));
  },

  _searchCompleted(id, query, result) {
    if (this.isDestroyed || id < this.searchID) {
      return;
    }

    invokeAction(this, 'onSearched', result, query, this.api);
  },

  _searchFailed(query, error) {
    if (this.isDestroyed) {
      return;
    }

    invokeAction(this, 'onSearchError', error, query, this.api);
  },

  _searchFinished() {
    if (this.isDestroyed) {
      return;
    }

    set(this, 'isSearching', false);
    set(this, 'isSlowSearch', false);
  },

  _checkSlowSearch() {
    if (this.isDestroyed) {
      return;
    }

    set(this, 'isSlowSearch', this.isSearching);
  }
});
