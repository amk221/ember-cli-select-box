import { helper } from '@ember/component/helper';

const { assign } = Object;

export default function registerComponents(component) {
  return helper(function (positional, components) {
    assign(component, components);
  });
}
