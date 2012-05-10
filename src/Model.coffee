extensions = new Emitter

class Model extends Emitter
  constructor: (obj)->
    super
    @data_ = {}
    extensions.emit 'init', this
    for own key, value of obj
      if isArray(value)
        @set.apply(@, [key].concat(value))
      else
        @set(key, value)
  set: (key, value, deps...)->
    if typeof key is 'object'
      for x of key
        value = key[x]
        if isArray(value)
          @set.apply(@, [x].concat(value))
        else
          @set(x, value)
    else if value instanceof Model
      value.on "change:#{deps[0]}", =>
        @change key
      @data_[key] = ->
        value.get deps[0]
    else
      @data_[key] = value;
      @change key
      if deps
        value.deps = deps
        for dep in deps
          @on "change:#{dep}", =>
            @change key
    this
  get: (key)->
    key = @data_[key]
    if 'function' is typeof key
      if key.deps
        key.apply @, (@get(dep) for dep in key.deps)
      else
        key.call @
    else
      key
  change: (key)->
    @emit "change:#{key}", key
    @emit 'change', key
  dispose: (b)->
    @emit "dispose", b
    delete @data_
    delete @events_
  
  render: (tmpl, parent)->
    render(@, tmpl, parent)

Model.extend = (obj)->
  for own x of obj
    if x in ['init']
      extensions.on x, obj[x]
    else
      Model::[x] = obj[x]