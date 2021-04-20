import { helper } from '@ember/component/helper';

const { assign } = Object;

// TODO: Delete me after this RFC: https://github.com/emberjs/rfc-tracking/issues/6
export default helper(function ([component], components) {
  assign(component, components);
});
