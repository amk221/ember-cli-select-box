import { modifier } from 'ember-modifier';

export default function (selectBox) {
  return modifier(() => {
    selectBox.isReady = true;
    selectBox.args.onReady?.(selectBox.api);
  });
}
