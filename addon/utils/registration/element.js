import { modifier } from 'ember-modifier';

export default function registerElement(selectBox) {
  return modifier((element) => {
    selectBox.element = element;

    return () => (selectBox.element = null);
  });
}
