class Ajax {
  constructor(opts = {}) {
    if(opts.url)
      this.url = opts.url;
    else
      throw new Error(`${opts} should have the url key`);

    this.beforeSend = opts.beforeSend || (() => {})
    this.resolved = opts.resolved || ((arg)=> arg);
    this.rejected = opts.rejected || ((arg)=> arg);
  }

  send(method, path, data) {
    return (new Promise(
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
              reject(xhr);
        }
        xhr.open(method, this.url + path, true);

        xhr.send(JSON.stringify(data));
      }
    )).then(this.resolved, this.rejected);
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
