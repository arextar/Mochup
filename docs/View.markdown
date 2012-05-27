# View
The View class is used in cases where you would want to have one render path render different models. It essentially acts as a model that you can switch out the data on. It has methods `get`, `set`, and `render` which behave exactly like those on the Model class.

## Methods

### View#model
This method sets the acting model for the view.

````js
var model_a = new mochup.Model({data: 'a'}),
    model_b = new mochup.Model({data: 'b'}),
    view = new Mochup.View(model_a)

view.get('data') //=> 'a'
view.model(model_b)
view.get('data') //=> 'b'
````