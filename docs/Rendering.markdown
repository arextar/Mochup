# Rendering
Mochup renders view written in HTML and its own templating language.

## Basic model rendering
Use `{{name}}` to interpolate a value in a template.

````js
var model = new mochup.Model({name: "Joe", age: 32}),
    dummy_element = document.createElement("div")

model.render("<b>{{name}}</b> is {{age}} years old!", dummy_element)

dummy_element.innerHTML //=> '<b>Joe</b> is 32 years old!'

model.set('name', 'Bob')

dummy_element.innerHTML //=> '<b>Bob</b> is 32 years old!'
````

## `m-` attributes
Mochup allows you to use custom attributes (prefixed with `m-`) to create interactive templates and other features. These can be extended on the `mochup.attrs` object.

````js
var model = new mochup.Model({name: "Joe", age: 32}),
    dummy_element = document.createElement("div")

model.render("<input m-bind='name'> is <input m-bind='age'> years old!", dummy_element)

// If this element is put into the document, the inputs will show the values for the keys and, when edited, will change the values for the keys
````

````js
mochup.attrs['m-if'] = function(node, model, key){
  
  function change(){
    node.style.display = model.get(key) ? "" : "none"
  }
  
  model.on('change:' + key, change)
  change()
}

var model = new mochup.Model({name: "Joe", age: 32}),
    dummy_element = document.createElement("div")

model.render("<b>{{name}}</b><span m-if='age'> is {{age}} years old</span>!", dummy_element)

// If this element is put into the document the span with "m-if='age'" will show up only if 'age' is defined on the model
````