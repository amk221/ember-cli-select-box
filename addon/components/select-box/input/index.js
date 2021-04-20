import Component from '@glimmer/component';
import lifecycleActions from '../../../utils/component/lifecycle';
import registerElement from '../../../utils/registration/element';
import { input, keyUp } from '../../../utils/select-box/input/keyboard';
import { action } from '@ember/object';
import buildId from '../../../utils/shared/id';

export default class SelectBoxInput extends Component {
  element = null;

  constructor() {
    super(...arguments);

    this.id = buildId(this);
    this.registerElement = registerElement(this);
    this.lifecycleActions = lifecycleActions(this);
  }

  @action
  handleInput(e) {
    input(this, e);
  }

  @action
  handleKeyUp(e) {
    keyUp(this, e);
  }
}
