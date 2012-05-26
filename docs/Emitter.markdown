# Emitter
All objects that have an Event header on their documentation page extend this class.

## Methods


### Emitter#on(event:String, handler:Function)
`Emitter#on` binds the handler to the given event.

### Emitter#emit(event:String [, args...])
`Emitter#emit` calls all handlers associated with the given event.

````js
var evt = new mochup.Emitter()

evt.on('foo', function(message, times){
  while(times--) console.log(message)
})

evt.emit('foo', 'bar', 5) // logs 'bar' 5 times
````

### Emitter#off(event:String [, handler:Function])
`Emitter#off` unbinds all handlers on the given event or, if a handler is passed, just that passed handler on the given event.

````js
evt.off('foo')

evt.emit('foo', 'bar', 5) // does nothing
````
