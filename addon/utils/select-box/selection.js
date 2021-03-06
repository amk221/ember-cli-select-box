import { A as emberA } from '@ember/array';
const { isArray } = Array;

export function buildSelection(selectBox, value1) {
  const value2 = selectBox.value;
  const build = selectBox.args.onBuildSelection;

  if (typeof build === 'function') {
    return build(value1, value2);
  }

  return buildSelectionDefault(selectBox, value1, value2);
}

function buildSelectionDefault(selectBox, value1, value2) {
  let value = value1;

  if (selectBox.isMultiple && !isArray(value1)) {
    const temp = emberA([...value2]);

    if (temp.includes(value1)) {
      temp.removeObject(value1);
    } else {
      temp.addObject(value1);
    }

    value = temp.toArray();
  }

  return value;
}
