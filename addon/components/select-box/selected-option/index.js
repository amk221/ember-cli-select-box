import Component from '@glimmer/component';
import lifecycleActions from '../../../utils/component/lifecycle';
import buildId from '../../../utils/shared/id';

export default class SelectBoxSelectedOption extends Component {
  constructor() {
    super(...arguments);

    this.id = buildId(this);
    this.lifecycleActions = lifecycleActions(this);
  }
}
