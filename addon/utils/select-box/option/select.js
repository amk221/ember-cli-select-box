import invokeAction from '../../component/invoke-action';
import { selectValue } from '../value';
import { getAPI } from '../../component/api';

export function _selectOption(option) {
  if (!option || option.isDisabled) {
    return;
  }

  invokeAction(option, '_onSelect', option);
}

export function selectOption(selectBox, option) {
  // todo test action order

  selectedOption(option);
  selectValue(selectBox, option.resolvedValue);
}

export function selectedOption(option) {
  invokeAction(option, 'onSelect', option.resolvedValue, getAPI(option));
}
