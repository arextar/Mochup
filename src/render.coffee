#{{parser}}
#{{tmpl}}
#{{attrs}}

garbage = document.createElement 'div'

render = (model, tmpl, parent)->
  tmpl = if /(?:\{\{|m\-)/.test(tmpl) then tmpl else document.getElementById(tmpl).textContent.replace(/\s+</g, " <").replace(/>\s+/g, "> ").replace(/^ | $/g,"")
  oparent = parent
  parser tmpl, (type, tag, attr, unary)->
    switch type
      when 'start'
        
        if parent is oparent
          model.on 'dispose', ->
            garbage.appendChild node
            garbage.innerHTML = "";
        
        node = parent = parent.appendChild document.createElement tag
        if attr
          after = []
          push_to_after = (a)->after.push a
          for key, val of attr
            if key of special_attrs
              special_attrs[key](parent, model, val, push_to_after)
            else if /\{\{/.test val
              bind_attr(parent, model, key, val, push_to_after);
            else
              parent.setAttribute key, val
          
          fn() for fn in after
          
        if unary
          parent = parent.parentNode
      when 'end'
        parent = parent.parentNode;
      when 'text'
        bind_text parent, model, tag
  oparent

bind_text = render.bind_text = (parent, model, txt)->
  if /\{\{/.test txt
    parent.appendChild node = document.createTextNode tmpl txt, model, (txt)->
      node.nodeValue = txt
  else
    parent.appendChild document.createTextNode txt
  node

bind_attr = (parent, model, key, val)->
  parent.setAttribute key, tmpl(val, model, (txt)->
    parent.setAttribute(key, txt);
  )