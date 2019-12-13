# How it works

## Options

1. When the select box component is rendered, it does not know what options are available yet, because child components (options) could still be being rendered. During this phase, child components are registered in an array on the select box.

2. After render, the array of options is sorted to match the order of the elements in the DOM. This sorting is important, because as an addon, we cannot know what order the options are in until rendering has finished.

3. Each option component computes whether or not it is **selected** by comparing its value to the value of its select box.

4. Each option component computes whether or not it is **active** by comparing its index, to the active index of the select box.

This simple pattern means that the options themselves are the _components_ and _not_ the _values_. This is because it is perfectly valid to have more than one option with the same value.