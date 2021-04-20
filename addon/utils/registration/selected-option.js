export function registerSelectedOption(selectBox, selectedOption) {
  selectBox.selectedOption.push(selectedOption);
}

export function deregisterSelectedOption(selectBox, selectedOption) {
  selectBox.selectedOption.splice(
    selectBox.selectedOption.indexOf(selectedOption),
    1
  );
}
