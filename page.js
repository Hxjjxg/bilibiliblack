(function() {
  function patch(obj) {
    try {
      if (obj?.data?.relation?.attribute !== undefined) obj.data.relation.attribute = 0;
      if (obj?.data?.be_relation?.attribute !== undefined) obj.data.be_relation.attribute = 0;
    } catch(e) {}
    return obj;
  }

  // 拦截 fetch
  const _fetch = window.fetch;
  window.fetch = function(...args) {
    return _fetch(...args).then(async resp => {
      if (args[0].toString().includes('/x/space/wbi/acc/relation')) {
        const text = await resp.text();
        try {
          const obj = patch(JSON.parse(text));
          return new Response(JSON.stringify(obj), {headers: resp.headers});
        } catch(e) {
          return new Response(text, {headers: resp.headers});
        }
      }
      return resp;
    });
  };

  // 拦截 XHR
  const _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...args) {
    this._url = args[1];
    return _open.apply(this, args);
  };
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(...args) {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4 && this._url.includes('/x/space/wbi/acc/relation')) {
        try {
          const obj = patch(JSON.parse(this.responseText));
          Object.defineProperty(this, 'responseText', {value: JSON.stringify(obj)});
          Object.defineProperty(this, 'response', {value: JSON.stringify(obj)});
        } catch(e) {}
      }
    });
    return _send.apply(this, args);
  };
})();
