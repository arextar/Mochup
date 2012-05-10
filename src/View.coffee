class View extends Emitter
  constructor:(m)->
    super
    @model m if m
  change: (key)=>
    @emit "change:#{key}"
    @emit 'change', key
  model: (model)->
    @model_.off 'change', @change if @model_
    model.on 'change', @change
    @model_ = model
    for key, val of model.data_
      if 'function' isnt typeof val
        model.change key
  set: ->@model_.set arguments...
  get: ->@model_.get arguments...
  render: Model::render