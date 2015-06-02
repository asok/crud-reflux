class Ajax {
  constructor(opts = {}) {
    if(opts.url)
      this.url = opts.url;
    else
      throw new Error(`${opts} should have the url key`);

    this.beforeSend = opts.beforeSend || (() => {})
    this.callbacks = opts.callbacks || {};
  }

  runCallback(xhr, resolve, reject) {
    var callback = this.callbacks[xhr.status];
    if(callback) {
      callback(xhr, resolve, reject)
      return true;
    } else
      return false;
  }

  send(method, path, data) {
    return new Promise(
      (resolve, reject)=> {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.OPENED) {
            xhr.setRequestHeader("Content-Type",
                                 "application/json;charset=utf-8");
            this.beforeSend(xhr);
          }

          if (xhr.readyState === XMLHttpRequest.DONE)
            if(xhr.status === 200)
              resolve(JSON.parse(xhr.responseText || '{}'));
            else
              this.runCallback(xhr, resolve, reject) || reject(xhr)
        }
        xhr.open(method, this.url + path, true);

        xhr.send(JSON.stringify(data));
      }
    )
  }

  get(path) {
    return this.send('GET', path, '');
  }

  post(path, data) {
    return this.send('POST', path, data);
  }

  put(path, data) {
    return this.send('PUT', path, data);
  }

  destroy(path){
    return this.send('DELETE', path, '');
  }
};

module.exports = Ajax;
