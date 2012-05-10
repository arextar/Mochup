addEvent = if "addEventListener" of document
  (elem, event, handler)->elem.addEventListener(event, handler, false)
else
  (elem, event, handler)->elem.attachEvent('on#{event}', ->handler.call(elem, window.event))

special_attrs = {
  'm-bind': (node, model, key, after)->
    old = node.value
    
    change = ->
      return 0 unless v = model.get key
      if node.type is 'checkbox'
        node.checked = !!v
      else
        node.value = v
    
    model.on "change:#{key}", change
    after ->
      change()
      if node.type is 'checkbox'
        addEvent node, 'click', ->
          model.set key, @checked;
      else
        addEvent node, (if node.type is 'text' then 'keyup' else 'change'), ->
          model.set key, @value if old isnt @value
          old = @value
}