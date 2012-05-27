# Model

### Constructor
The `mochup.Model` constructor optionally accepts an object to set the initial data.

````js
var model = new mochup.Model({foo: 'bar'})

model.get('foo') //=> 'bar'
````


### Getters
A getter, a function used to compute a value when requested, can be registered in one of two ways. You can either set an array containing a function as the value in the initialization object of a model or setting a function in `Model#set`. Keys the getter is dependant on, ones that must trigger a change in the getter's key when changed, are specigfied after the function.

````js
// Method #1
var model = new mochup.Model({
  name: [function(fname, lname){
    return fname + ' ' + lname
  }, 'firstName', 'lastName'],
  firstName: 'John',
  lastName: 'Doe'
})

model.get('name') //=> 'John Doe'


// Method #2
model.set('name', function(fname, lname){
  return fname + ' ' + lname
}, 'firstName', 'lastName')

model.get('name') //=> 'John Doe'
````


## Methods


### Model#set(key:String, value [, dependencies:String...])
`Model#set` sets the value given to the given key, triggering any listeners bound to that key. It can also define getters (as defined under the previous header).

````js
var model = new mochup.Model()

model.set('foo', 'bar')

model.get('foo') //=> 'bar'
````


### Model#get(key:String)
`Model#get` returns the value associated with the given key, calling a getter if needed.

````js
var model = new mochup.Model({foo: 'bar'})

model.get('foo') //=> 'bar'
````


### Model#dispose
`Model#dispose` removes all data and events associated with the model.

### Model#render
See the documentation on rendering


## Events


### change
The change event is emitted whenever any value is set on the model and passes 1 argument: the affected key


### change:{key}
The change:{key} event is emitted whenever the key {key} is set.