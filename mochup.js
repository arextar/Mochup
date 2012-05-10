(function() {
  var Collection, Emitter, Model, View, addEvent, bind_attr, bind_text, clean, coll_extensions, default_tmpl, extensions, garbage, h_void, hash, indexOf, isArray, makeArray, parser, render, special_attrs, tmpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  indexOf = [].indexOf || function(v){for(var i in this)if(this[i]===v&&~~i==i)return~~i;return-1};

  isArray = function(obj) {
    return {}.toString.call(obj) === "[object Array]";
  };

  parser = function(buf, cb) {
    var attr, c, end, from, i, len, name, tag;
    i = 0;
    from = 0;
    c = buf.charCodeAt(0);
    len = buf.length;
    while (i <= len) {
      end = 0;
      while (c && c !== 60) {
        c = buf.charCodeAt(++i);
      }
      if (from - i) cb("text", buf.slice(from, (from = i)));
      c = buf.charCodeAt(from = ++i);
      if (i > len) break;
      if (c === 47) {
        end = 1;
        c = buf.charCodeAt(from = ++i);
      }
      while (c && ((47 < c && c < 58) || (96 < c && c < 121) || (64 < c && c < 91))) {
        c = buf.charCodeAt(++i);
      }
      tag = buf.slice(from, (from = i));
      if (end) {
        cb("end", tag);
        c = buf.charCodeAt(from = ++i);
      } else {
        while (c && (c === 32 || c === 9 || c === 10 || c === 12 || c === 13)) {
          c = buf.charCodeAt(from = ++i);
        }
        if (c && c === 62) {
          c = buf.charCodeAt(from = ++i);
          cb("start", tag, null, h_void(tag));
        } else {
          attr = {};
          while (c !== 62) {
            while (c && (c !== 0 && c !== 34 && c !== 39 && c !== 62 && c !== 47 && c !== 61 && c !== 32 && c !== 9 && c !== 10 && c !== 12 && c !== 13)) {
              c = buf.charCodeAt(++i);
            }
            name = buf.slice(from, (from = i));
            while (c && (c === 32 || c === 9 || c === 10 || c === 12 || c === 13)) {
              c = buf.charCodeAt(from = ++i);
            }
            if (c === 61) {
              c = buf.charCodeAt(from = ++i);
              while (c && (c === 32 || c === 9 || c === 10 || c === 12 || c === 13)) {
                c = buf.charCodeAt(from = ++i);
              }
              if (c === 39) {
                c = buf.charCodeAt(from = ++i);
                while (c && c !== 39) {
                  c = buf.charCodeAt(++i);
                }
                attr[name] = buf.slice(from, (from = i));
                c = buf.charCodeAt(from = ++i);
              } else if (c === 34) {
                c = buf.charCodeAt(from = ++i);
                while (c && c !== 34) {
                  c = buf.charCodeAt(++i);
                }
                attr[name] = buf.slice(from, (from = i));
                c = buf.charCodeAt(from = ++i);
              } else {
                while (c && (c !== 34 && c !== 39 && c !== 61 && c !== 60 && c !== 62 && c !== 96 && c !== 32 && c !== 9 && c !== 10 && c !== 12 && c !== 13)) {
                  c = buf.charCodeAt(++i);
                }
                attr[name] = buf.slice(from, (from = i));
              }
            } else {
              attr[name] = name;
            }
            while (c && (c === 32 || c === 9 || c === 10 || c === 12 || c === 13)) {
              c = buf.charCodeAt(from = ++i);
            }
          }
          c = buf.charCodeAt(from = ++i);
          cb("start", tag, attr, h_void(tag));
        }
      }
    }
  };

  hash = function(arr) {
    var h, k, ret, _i, _len;
    h = {};
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      k = arr[_i];
      h[k] = 1;
    }
    ret = function(k) {
      return h.hasOwnProperty(k);
    };
    ret.h = h;
    return ret;
  };

  h_void = hash('area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(','));

  default_tmpl = function(str, requires) {
    var body, from, i, interp;
    body = 'return "';
    from = 0;
    while (~(i = str.indexOf('{{', from))) {
      body += str.substring(from, i);
      interp = str.substring(i + 2, from = str.indexOf('}}', from));
      body += '"+clean(_.' + interp + ')+"';
      requires(interp);
      from += 2;
    }
    return Function('_', 'clean', body + str.substring(from) + '"');
  };

  clean = function(str) {
    if (str === void 0) return '';
    return ("" + str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  tmpl = function(str, m, cb) {
    var dat, rend;
    dat = {};
    rend = default_tmpl(str, function(w) {
      dat[w] = m.get(w);
      return m.on("change:" + w, function() {
        dat[w] = m.get(w);
        return cb(rend(dat, clean));
      });
    });
    return rend(dat, clean);
  };

  addEvent = "addEventListener" in document ? function(elem, event, handler) {
    return elem.addEventListener(event, handler, false);
  } : function(elem, event, handler) {
    return elem.attachEvent('on#{event}', function() {
      return handler.call(elem, window.event);
    });
  };

  special_attrs = {
    'm-bind': function(node, model, key, after) {
      var change, old;
      old = node.value;
      change = function() {
        var v;
        if (!(v = model.get(key))) return 0;
        if (node.type === 'checkbox') {
          return node.checked = !!v;
        } else {
          return node.value = v;
        }
      };
      model.on("change:" + key, change);
      return after(function() {
        change();
        if (node.type === 'checkbox') {
          return addEvent(node, 'click', function() {
            return model.set(key, this.checked);
          });
        } else {
          return addEvent(node, (node.type === 'text' ? 'keyup' : 'change'), function() {
            if (old !== this.value) model.set(key, this.value);
            return old = this.value;
          });
        }
      });
    }
  };

  garbage = document.createElement('div');

  render = function(model, tmpl, parent) {
    var oparent;
    tmpl = /(?:\{\{|m\-)/.test(tmpl) ? tmpl : document.getElementById(tmpl).textContent.replace(/\s+</g, " <").replace(/>\s+/g, "> ").replace(/^ | $/g, "");
    oparent = parent;
    parser(tmpl, function(type, tag, attr, unary) {
      var after, fn, key, node, push_to_after, val, _i, _len;
      switch (type) {
        case 'start':
          if (parent === oparent) {
            model.on('dispose', function() {
              garbage.appendChild(node);
              return garbage.innerHTML = "";
            });
          }
          node = parent = parent.appendChild(document.createElement(tag));
          if (attr) {
            after = [];
            push_to_after = function(a) {
              return after.push(a);
            };
            for (key in attr) {
              val = attr[key];
              if (key in special_attrs) {
                special_attrs[key](parent, model, val, push_to_after);
              } else if (/\{\{/.test(val)) {
                bind_attr(parent, model, key, val, push_to_after);
              } else {
                parent.setAttribute(key, val);
              }
            }
            for (_i = 0, _len = after.length; _i < _len; _i++) {
              fn = after[_i];
              fn();
            }
          }
          if (unary) return parent = parent.parentNode;
          break;
        case 'end':
          return parent = parent.parentNode;
        case 'text':
          return bind_text(parent, model, tag);
      }
    });
    return oparent;
  };

  bind_text = render.bind_text = function(parent, model, txt) {
    var node;
    if (/\{\{/.test(txt)) {
      parent.appendChild(node = document.createTextNode(tmpl(txt, model, function(txt) {
        return node.nodeValue = txt;
      })));
    } else {
      parent.appendChild(document.createTextNode(txt));
    }
    return node;
  };

  bind_attr = function(parent, model, key, val) {
    return parent.setAttribute(key, tmpl(val, model, function(txt) {
      return parent.setAttribute(key, txt);
    }));
  };

  makeArray = function(obj, i) {
    var arr, len, x;
    if (i == null) i = 0;
    len = obj.length;
    arr = new Array(len - i);
    for (x = i; i <= len ? x < len : x > len; i <= len ? x++ : x--) {
      arr[x - i] = obj[x];
    }
    return arr;
  };

  Emitter = (function() {

    function Emitter() {
      this.events_ = {};
    }

    Emitter.prototype.on = function(event, handler) {
      if (!this.events_[event]) {
        return this.events_[event] = handler;
      } else if (isArray(this.events_[event])) {
        return this.events_[event].push(handler);
      } else {
        return this.events_[event] = [this.events_[event], handler];
      }
    };

    Emitter.prototype.off = function(event, handler) {
      var fn, i, index, list, _len;
      if (!(list = this.events_[event])) return this;
      if (!handler) return this.events_[event] = null;
      if (isArray(list)) {
        index = -1;
        for (i = 0, _len = list.length; i < _len; i++) {
          fn = list[i];
          if (fn === handler) index = i;
        }
        if (i < 0) return this;
        list.splice(i, 1);
      } else if (list === handler) {
        delete this.events_[event];
      }
      return this;
    };

    Emitter.prototype.emit = function(event, a, b) {
      var args, handler, len, list, _i, _len, _ref, _results;
      if (!(list = this.events_[event])) return this;
      len = arguments.length;
      if ('function' === typeof list) {
        switch (arguments.length) {
          case 1:
            list.call(this);
            break;
          case 2:
            list.call(this, a);
            break;
          case 3:
            list.call(this, a, b);
            break;
          default:
            list.apply(this, makeArray(arguments, 1));
        }
        return this;
      }
      args = makeArray(arguments, 1);
      _ref = this.events_[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _results.push(handler.apply(this, args));
      }
      return _results;
    };

    return Emitter;

  })();

  extensions = new Emitter;

  Model = (function(_super) {

    __extends(Model, _super);

    function Model(obj) {
      var key, value;
      Model.__super__.constructor.apply(this, arguments);
      this.data_ = {};
      extensions.emit('init', this);
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        if (isArray(value)) {
          this.set.apply(this, [key].concat(value));
        } else {
          this.set(key, value);
        }
      }
    }

    Model.prototype.set = function() {
      var dep, deps, key, value, x, _i, _len,
        _this = this;
      key = arguments[0], value = arguments[1], deps = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (typeof key === 'object') {
        for (x in key) {
          value = key[x];
          if (isArray(value)) {
            this.set.apply(this, [x].concat(value));
          } else {
            this.set(x, value);
          }
        }
      } else if (value instanceof Model) {
        value.on("change:" + deps[0], function() {
          return _this.change(key);
        });
        this.data_[key] = function() {
          return value.get(deps[0]);
        };
      } else {
        this.data_[key] = value;
        this.change(key);
        if (deps) {
          value.deps = deps;
          for (_i = 0, _len = deps.length; _i < _len; _i++) {
            dep = deps[_i];
            this.on("change:" + dep, function() {
              return _this.change(key);
            });
          }
        }
      }
      return this;
    };

    Model.prototype.get = function(key) {
      var dep;
      key = this.data_[key];
      if ('function' === typeof key) {
        if (key.deps) {
          return key.apply(this, (function() {
            var _i, _len, _ref, _results;
            _ref = key.deps;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              dep = _ref[_i];
              _results.push(this.get(dep));
            }
            return _results;
          }).call(this));
        } else {
          return key.call(this);
        }
      } else {
        return key;
      }
    };

    Model.prototype.change = function(key) {
      this.emit("change:" + key, key);
      return this.emit('change', key);
    };

    Model.prototype.dispose = function(b) {
      this.emit("dispose", b);
      delete this.data_;
      return delete this.events_;
    };

    Model.prototype.render = function(tmpl, parent) {
      return render(this, tmpl, parent);
    };

    return Model;

  })(Emitter);

  Model.extend = function(obj) {
    var x, _results;
    _results = [];
    for (x in obj) {
      if (!__hasProp.call(obj, x)) continue;
      if (x === 'init') {
        _results.push(extensions.on(x, obj[x]));
      } else {
        _results.push(Model.prototype[x] = obj[x]);
      }
    }
    return _results;
  };

  coll_extensions = new Emitter;

  Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection(name, def_) {
      this.name = name;
      this.def_ = def_;
      Collection.__super__.constructor.apply(this, arguments);
      this.models_ = [];
      coll_extensions.emit('init', this);
    }

    Collection.prototype.add = function(obj) {
      var def, m, x,
        _this = this;
      m = new Model({});
      if (def = this.def_) m.set(def);
      for (x in obj) {
        m.set(obj);
      }
      m.on('change', function(key) {
        _this.emit('change', key, m);
        return _this.emit('change:' + key, m);
      });
      m.on('dispose', function(b) {
        if (b !== false) return _this.remove(m, true);
      });
      this.models_.push(m);
      this.emit('add', m);
      return m;
    };

    Collection.prototype.at = function(ind) {
      return this.models_[ind];
    };

    Collection.prototype.remove = function(obj, nodisp) {
      var m;
      if ('number' === typeof obj) {
        m = this.models_[obj];
        this.models_.splice(obj, 1);
        this.emit('remove', m);
        if (!nodisp) return m.dispose(false);
      } else {
        this.models_.splice(indexOf.call(this.models_, obj), 1);
        this.emit('remove', obj);
        if (!nodisp) return obj.dispose(false);
      }
    };

    Collection.prototype.each = function(fn) {
      var i, model, _len, _ref, _results;
      _ref = this.models_;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        model = _ref[i];
        _results.push(fn.call(this, model, i));
      }
      return _results;
    };

    Collection.prototype.where = function(fn) {
      var i, model, _len, _ref;
      _ref = this.models_;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        model = _ref[i];
        if (fn.call(this, model, i)) return model;
      }
      return false;
    };

    Collection.prototype.filter = function(fn) {
      var i, indices, model, o, _i, _len, _len2, _ref, _results;
      indices = [];
      _ref = this.models_;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        model = _ref[i];
        if (fn(model) === false) indices.push(i);
      }
      o = 0;
      _results = [];
      for (_i = 0, _len2 = indices.length; _i < _len2; _i++) {
        i = indices[_i];
        _results.push(this.remove(i - (o++)));
      }
      return _results;
    };

    Collection.prototype.render = function(tmpl, parent) {
      this.each(function(m) {
        return m.render(tmpl, parent);
      });
      return this.on('add', function(m) {
        return m.render(tmpl, parent);
      });
    };

    Collection.prototype.size = function() {
      return this.models_.length;
    };

    return Collection;

  })(Emitter);

  Collection.extend = function(obj) {
    var x, _results;
    _results = [];
    for (x in obj) {
      if (!__hasProp.call(obj, x)) continue;
      if (x === 'init') {
        _results.push(coll_extensions.on(x, obj[x]));
      } else {
        _results.push(Collection.prototype[x] = obj[x]);
      }
    }
    return _results;
  };

  View = (function(_super) {

    __extends(View, _super);

    function View(m) {
      this.change = __bind(this.change, this);      View.__super__.constructor.apply(this, arguments);
      if (m) this.model(m);
    }

    View.prototype.change = function(key) {
      this.emit("change:" + key);
      return this.emit('change', key);
    };

    View.prototype.model = function(model) {
      var key, val, _ref, _results;
      if (this.model_) this.model_.off('change', this.change);
      model.on('change', this.change);
      this.model_ = model;
      _ref = model.data_;
      _results = [];
      for (key in _ref) {
        val = _ref[key];
        if ('function' !== typeof val) {
          _results.push(model.change(key));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    View.prototype.set = function() {
      var _ref;
      return (_ref = this.model_).set.apply(_ref, arguments);
    };

    View.prototype.get = function() {
      var _ref;
      return (_ref = this.model_).get.apply(_ref, arguments);
    };

    View.prototype.render = Model.prototype.render;

    return View;

  })(Emitter);

  window.mochup = {
    parse: parser,
    render: render,
    Model: Model,
    Emitter: Emitter,
    Collection: Collection,
    View: View,
    tmpl: tmpl,
    attrs: special_attrs,
    indexOf: indexOf
  };

}).call(this);
