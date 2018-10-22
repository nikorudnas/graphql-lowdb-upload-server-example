/* eslint no-undef: 0 */

import http from 'http';
import assert from 'assert';
import 'babel-polyfill';

import '../server';

describe('Example Node Server', () => {
  it('should return 404', done => {
    http.get('http://127.0.0.1:4000', res => {
      assert.equal(404, res.statusCode);
      done();
    });
  });
});
