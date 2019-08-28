import invokeAction from '../../shared/invoke-action';

export function input(input, e) {
  const text = input.domElement.value;

  if (!text) {
    clearedInput()
  }

  _input(input, text);

  inputText(input);
}

function _input(input, text) {
  invokeAction(input, '_onInput', text);
}

function clearedInput(input) {
  invokeAction(input, 'onClear', input.api());
}

function inputText(input, text) {
  invokeAction(input, 'onInput', text, input.api());
}

function deletedText(input) {
  invokeAction(input, 'onDelete', input.api());
}

export function keyDown(input, e) {
  if (e.keyCode === 8 && !input.domElement.value) {
    deletedText(input);
  }
}
