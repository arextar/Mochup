indexOf = `[].indexOf || function(v){for(var i in this)if(this[i]===v&&~~i==i)return~~i;return-1}`

isArray = (obj)->
  return {}.toString.call(obj) is "[object Array]"

#{{render}}

#{{Emitter}}
#{{Model}}
#{{Collection}}
#{{View}}


window.mochup = {
  parse: parser
  render
  Model
  Emitter
  Collection
  View
  tmpl
  attrs: special_attrs
  indexOf: indexOf
}