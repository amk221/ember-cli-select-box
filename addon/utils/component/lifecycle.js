import { modifier } from 'ember-modifier';

export default function lifecycleActions(component) {
  return modifier(() => {
    component.args._onInsert?.(component);

    return () => component.args._onDestroy?.(component);
  });
}
