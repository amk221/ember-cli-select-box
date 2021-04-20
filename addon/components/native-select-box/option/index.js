import Component from '@glimmer/component';
import lifecycleActions from '../../../utils/component/lifecycle';
import registerElement from '../../../utils/registration/element';
import buildAPI from '../../../utils/shared/api';
import { receiveValue } from '../../../utils/component/value';
import isSelected from '../../../utils/shared/selected';
import { tracked } from '@glimmer/tracking';

export default class NativeSelectBoxOption extends Component {
  element = null;
  previousValue = null;
  sealedAPI = {};
  valueId = 0;

  @tracked isFulfilled = false;
  @tracked isPending = true;
  @tracked isRejected = false;
  @tracked isSettled = false;
  @tracked value = null;

  get api() {
    return buildAPI(this, [
      'element',
      'index',
      'isFulfilled',
      'isPending',
      'isRejected',
      'isSelected',
      'isSettled',
      'value'
    ]);
  }

  get index() {
    return this.args.selectBox ? this.args.selectBox.option.indexOf(this) : -1;
  }

  get isSelected() {
    return isSelected(this);
  }

  constructor() {
    super(...arguments);

    this.lifecycleActions = lifecycleActions(this);
    this.receiveValue = receiveValue(this);
    this.registerElement = registerElement(this);
  }
}
