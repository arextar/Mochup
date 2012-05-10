coll_extensions = new Emitter

class Collection extends Emitter
  constructor: (@name, @def_)->
    super
    @models_ = []
    coll_extensions.emit 'init', this
  add: (obj)->
    m = new Model({})
    
    if def = @def_
      m.set(def)
    
    for x of obj
      m.set(obj)
    
    m.on 'change', (key)=>
      @emit 'change', key, m
      @emit 'change:' + key, m
    
    m.on 'dispose', (b)=>
      @remove m, true unless b is false
    
    @models_.push(m)
    
    @emit 'add', m
    m
  at: (ind)->
    @models_[ind]
  remove: (obj, nodisp)->
    if 'number' is typeof obj
      m = @models_[obj]
      @models_.splice obj, 1
      @emit 'remove', m
      m.dispose(false) unless nodisp
    else
      @models_.splice indexOf.call(@models_, obj), 1
      @emit 'remove', obj
      obj.dispose(false) unless nodisp
  each: (fn)->
    for model,i in @models_
      fn.call @, model, i
  where: (fn)->
    for model,i in @models_
      return model if fn.call @, model, i
    return false
  filter: (fn)->
    indices = []
    for model,i in @models_ when fn(model) is false
      indices.push i
    
    o = 0
    
    for i in indices
      @remove i-(o++)
  render: (tmpl, parent)->
    @each (m)->
      m.render(tmpl, parent)
    @on 'add', (m)->
      m.render(tmpl, parent)
  size: ->
    @models_.length

Collection.extend = (obj)->
  for own x of obj
    if x in ['init']
      coll_extensions.on x, obj[x]
    else
      Collection::[x] = obj[x]