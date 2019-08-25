import Ember from 'ember';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import className from '../utils/class-name';
const { escapeExpression } = Ember.Handlebars.Utils;

export default helper(function(args = []) {
  let string = className(...args);
  string = escapeExpression(string);
  return htmlSafe(string);
});
