import Component from '@glimmer/component';
import lifecycleActions from '../../../utils/component/lifecycle';
import buildId from '../../../utils/shared/id';

export default class SelectBoxOptions extends Component {
  constructor() {
    super(...arguments);

    this.id = buildId(this);
    this.lifecycleActions = lifecycleActions(this);
  }

  get isMultiSelectable() {
    return (
      this.args.selectBox &&
      this.args.selectBox.isMultiple &&
      this.args.selectBox.isCombobox
    );
  }
}
