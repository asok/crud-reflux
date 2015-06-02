/*eslint-env jasmine */

import fakeXhr from '../../node_modules/fakexmlhttprequest'

var requests = []
XMLHttpRequest = function() {
  var r =  new fakeXhr(arguments)
  requests.push(r)
  return r
}
XMLHttpRequest.UNSENT = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;

jest.dontMock('../../src/back/Ajax');

var Promise = require('es6-promise-polyfill').Promise;
import Ajax from '../../src/back/Ajax';

var requestExpectations = (run, method) => {
  beforeEach(() => {
    ajax = new Ajax({url: 'http://nukomeet.com'}) /*global ajax*/
  })

  it('makes a request', () => {
    run(ajax)
    expect(requests.pop().method).toEqual(method);
  })

  it('makes a request on a given path', () => {
    run(ajax)
    expect(requests.pop().url).toEqual('http://nukomeet.com/foo');
  })

  it('sets up the Content-Type to application/json', () => {
    run(ajax)
    expect(requests.pop().requestHeaders).
      toEqual({'Content-Type': 'application/json;charset=utf-8'});
  })

  it('returns a Promise', () => {
    expect(run(ajax)).toEqual(jasmine.any(Promise));
  })
}

var beforeSendExpectations = (run) => {
  describe('passing "beforeSend" option', () => {
    it('will call the beforeSend function', () => {
      run(new Ajax({
        url: 'http://nukomeet.com',
        beforeSend: (xhr) =>
          xhr.setRequestHeader('Authorization', "Token bar")
      }));

      expect(requests.pop().requestHeaders).
        toEqual({'Content-Type': 'application/json;charset=utf-8',
                 'Authorization': 'Token bar'});
    })
  })
}

var customCallbacksExpectations = (run) => {
  describe('setting callbacks', () => {
    it('allows to setup a callback for any status code', () => {
      var called = false;

      run(new Ajax({
        url: 'http://nukomeet.com',
        rejected: function() {called = true}
      }))

      requests.pop().
        respond(401, {'Content-Type': 'application/json'}, "")
      expect(called).toBe(true);
    })
  })
};

describe("Ajax object", function() {
  describe('get', () => {
    requestExpectations((ajax) => ajax.get('/foo'), 'GET');
    beforeSendExpectations((ajax) => ajax.get('/foo'));
    customCallbacksExpectations((ajax) => ajax.get('/foo'));
  })

  describe('post', () => {
    requestExpectations((ajax) => ajax.post('/foo', 'bar'), 'POST');
    beforeSendExpectations((ajax) => ajax.post('/foo', 'bar'));
    customCallbacksExpectations((ajax) => ajax.post('/foo', 'bar'));
  })

  describe('put', () => {
    requestExpectations((ajax) => ajax.put('/foo', 'bar'), 'PUT');
    beforeSendExpectations((ajax) => ajax.put('/foo', 'bar'));
    customCallbacksExpectations((ajax) => ajax.put('/foo', 'bar'));
  })

  describe('destroy', () => {
    requestExpectations((ajax) => ajax.destroy('/foo', 'bar'), 'DELETE');
    beforeSendExpectations((ajax) => ajax.destroy('/foo'));
    customCallbacksExpectations((ajax) => ajax.destroy('/foo'));
  })
});
