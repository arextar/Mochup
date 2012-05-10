default_tmpl = (str, requires)->
  body = 'return "'
  from = 0
  while ~(i = str.indexOf '{{', from)
    body += str.substring from, i
    
    interp = str.substring i + 2, from = str.indexOf('}}', from)
    
    body += '"+clean(_.' + interp + ')+"'
    
    requires interp
    
    from += 2
  Function('_', 'clean', body + str.substring(from) + '"')

clean = (str)->
  return '' if str is undefined
  "#{str}"
     .replace(/&/g, "&amp;")
     .replace(/"/g, "&quot;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")

tmpl = (str, m, cb)->
  dat = {}
  rend = default_tmpl(str, (w)->
    dat[w] = m.get(w)
    m.on "change:#{w}", ->
      dat[w] = m.get(w)
      cb rend(dat, clean)
  )
  rend(dat, clean)