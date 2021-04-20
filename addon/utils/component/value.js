import { resolve } from 'rsvp';
import { modifier } from 'ember-modifier';

export function receiveValue(component) {
  return modifier((element, [value]) => {
    resolveValue(component, value);
  });
}

export function resolveValue(component, value, postProcess) {
  const valueId = startResolvingValue(component, value);

  return resolve(value)
    .then((value) => {
      value = processValue(component, postProcess, value);

      handleValue(component, valueId, value, false);
    })
    .catch((error) => {
      handleValue(component, valueId, error, true);
    });
}

function startResolvingValue(component, value) {
  component.value = value;
  component.isPending = true;
  component.isRejected = false;
  component.isFulfilled = false;
  component.isSettled = false;

  return ++component.valueId;
}

function handleValue(component, valueId, value, erred) {
  if (valueId < component.valueId) {
    return;
  }

  finishResolvingValue(component, value, erred);
}

function finishResolvingValue(component, value, erred) {
  component.value = value;
  component.isPending = false;
  component.isRejected = erred;
  component.isFulfilled = !erred;
  component.isSettled = true;
}

function processValue(component, fn, value) {
  if (typeof fn === 'function') {
    return fn(component, value);
  }

  return value;
}
