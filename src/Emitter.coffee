makeArray = (obj, i=0)->
  len = obj.length
  arr = new Array(len - i)
  for x in [i...len]
    arr[x - i] = obj[x]
  arr

class Emitter
  constructor:->@events_ = {}
  on: (event, handler)->
    if !@events_[event]
      @events_[event] = handler
    else if isArray @events_[event]
      @events_[event].push(handler)
    else
      @events_[event] = [@events_[event], handler]
  off: (event, handler)->
    return this unless list = @events_[event]
    return @events_[event] = null if not handler
    
    if isArray list
      index = -1
      for fn, i in list
        if fn is handler
          index = i
      
      return this if i < 0
      list.splice(i, 1)
    else if list is handler
      delete @events_[event]
    this
  emit: (event, a, b)->
    return this unless list = @events_[event]
    len = arguments.length
    
    if 'function' is typeof list
      switch arguments.length
        when 1 then list.call this
        when 2 then list.call this, a
        when 3 then list.call this, a, b
        else list.apply this, makeArray(arguments, 1)
      return this
    
    args = makeArray(arguments, 1)
    for handler in @events_[event]
      handler.apply this, args