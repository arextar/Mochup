parser = (buf, cb)->
    i = 0
    from = 0
    c = buf.charCodeAt(0)
    len = buf.length
    
    while i <= len
        end = 0
        while c and c isnt 60
            c = buf.charCodeAt(++i)
        cb "text", buf[from...from = i] if from - i
        c = buf.charCodeAt(from = ++i)
        
        break if i > len
        
        if c is 47
            end = 1
            c = buf.charCodeAt(from = ++i)
        
        while c and (47 < c < 58 or 96 < c < 121 or 64 < c < 91)
            c = buf.charCodeAt(++i)
        
        tag = buf[from...from = i]
        
        if end
            cb "end", tag
            c = buf.charCodeAt(from = ++i)
        else
            while c and c in [32, 9, 10, 12, 13]
                c = buf.charCodeAt(from = ++i);
            
            if c and c is 62
                c = buf.charCodeAt(from = ++i)
                cb "start", tag, null, h_void tag
            else
                attr = {}
                while c isnt 62
                    while c and c not in [0, 34, 39, 62, 47, 61, 32, 9, 10, 12, 13]
                        c = buf.charCodeAt(++i)
                    name = buf[from...from = i];
                    
                    while c and c in [32, 9, 10, 12, 13]
                        c = buf.charCodeAt(from = ++i)
                    if c is 61
                        c = buf.charCodeAt(from = ++i) # Skip '='
                        while c and c in [32, 9, 10, 12, 13]
                            c = buf.charCodeAt(from = ++i)
                        
                        if c is 39
                            c = buf.charCodeAt(from = ++i)
                            while c and c isnt 39
                                c = buf.charCodeAt(++i)
                            attr[name] = buf[from...from = i]
                            c = buf.charCodeAt(from = ++i)
                        else if c is 34
                            c = buf.charCodeAt(from = ++i)
                            while c and c isnt 34
                                c = buf.charCodeAt(++i)
                            attr[name] = buf[from...from = i]
                            c = buf.charCodeAt(from = ++i)
                        else
                            while c and c not in [34, 39, 61, 60, 62, 96, 32, 9, 10, 12, 13]
                                c = buf.charCodeAt(++i)
                            attr[name] = buf[from...from = i]
                    else
                        attr[name] = name
                    
                    while c and c in [32, 9, 10, 12, 13]
                        c = buf.charCodeAt(from = ++i)
                c = buf.charCodeAt(from = ++i) # skip '>'
                cb "start", tag, attr, h_void tag
    return

hash = (arr)->
    h = {}
    
    h[k] = 1 for k in arr
    
    ret = (k)->h.hasOwnProperty(k)
    ret.h = h
    ret

h_void = hash 'area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split ','