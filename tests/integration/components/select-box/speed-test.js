import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('select-box (speed)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('items', []);

    for (let i = 0; i <= 1000; i++) {
      this.items.push(`Item ${i}`);
    }
  });

  test('non-component options', async function(assert) {
    assert.expect(1);

    const start1 = Date.now();

    await render(hbs`
      {{#select-box}}
        {{#each this.items as |item|}}
          <option value={{item}}>{{item}}</option>
        {{/each}}
      {{/select-box}}
    `);

    const end1 = Date.now() - start1;

    const start2 = Date.now();

    await render(hbs`
      {{#select-box as |sb|}}
        {{#each this.items as |item|}}
          {{#sb.option value=item}}{{item}}{{/sb.option}}
        {{/each}}
      {{/select-box}}
    `);

    const end2 = Date.now() - start2;

    assert.ok(end1 < end2,
      'renders faster with non-component options');
  });
});
