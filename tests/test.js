var mochup_tests = {
  
  "has property": function (t) {
    t("parse", "parse" in mochup)
    t("render", "render" in mochup)
    t("Model", "Model" in mochup)
    t("Emitter", "Emitter" in mochup)
    t("Collection", "Collection" in mochup)
    t("View", "View" in mochup)
    t("attrs", "attrs" in mochup)
    t("tmpl", "tmpl" in mochup)
  },
  
  "Emitter": function (t) {
    var e = new mochup.Emitter(), flag = false
    function sevt_handler(a, b, c){
      t("single event args", a === 1 && b === 2 && c === 3)
      flag = true
    }
    e.on("sevt", sevt_handler)
    e.emit("sevt", 1, 2, 3)
    t("single event", flag)
    flag = false



    e.off("sevt", sevt_handler)
    e.emit("sevt")
    t("off(event, handler)", flag === false)



    flag = 0
    function mevt_handler(){
      flag++
    }
    e.on("mevt", mevt_handler)
    e.on("mevt", mevt_handler)
    e.on("mevt", mevt_handler)
    e.emit("mevt")
    t("multiple events", flag === 3)



    e.off("mevt")
    e.emit("mevt")
    t("off(event)", flag === 3)

  },
  
  "model": function (t) {
    var m = new mochup.Model({
      a: 1,
      firstName: "George",
      lastName: "Washington",

      name: [function(fName, lName){
        return fName + " " + lName
      }, "firstName", "lastName"]
    }), flag = false
    t("get", m.get("a") === 1)
    
    
    m.set("b", 2)
    t("set", m.get("b") === 2)
    
    
    m.on("change", function(key){
      t("on(change) key", key === "c")
      flag = true
    })
    m.set("c", 3)
    t("on(change)", flag)
    flag = false
    m.off("change")
    
    
    
    m.on("change:d", function(key){
      t("on(change:key) key", key === "d")
      flag = true
    })
    m.set("d", 4)
    t("on(change:key)", flag)
    flag = false
    m.off("change")
    
    
    
    t("getters", m.get("name") === "George Washington")
    
    
    
    m.on("change:name", function(key){
      flag = true
    })
    m.set("firstName", "Harrison")
    t("trigger dependencies", flag)
    flag = false
    m.off("change:name")
    
    
    m.on("dispose", function(){
      flag = true;
    })
    m.dispose()
    t("dispose", !("data_" in m || "events_" in m) && flag)
  },
  
  "model extensions": function (t) {
    mochup.Model.extend({
      init: function(m){
        m.foo = "bar"
      },
      bar: function(){
        return "baz"
      }
    })
    
    var m = new mochup.Model()
    
    t("init event", m.foo === 'bar')
    t("add methods", m.bar() === 'baz')
  },
  
  
  
  "collection": function (t) {
    var c = new mochup.Collection('name', {
      a: 5
    })
    
    var m = c.add({
      b: 6
    })
    
    c.add({
      b: 7
    })
    
    c.add({
      b: 8
    })
    
    t("adding returns model", !!m)
    t("initiates with given object", m.get("b") === 6)
    t("has default properties", m.get("a") === 5)
    t("size", c.size() === 3)
    t("at", c.at(1).get("b") === 7)
    
    var i = 0
    c.each(function(m){
      i += m.get("b")
    })
    t("each", i === 21)
    
    t("where", c.where(function(m){
      return m.get("b") === 7
    }).get("b") === 7)
    
    t("where (nonexistant)", c.where(function(m){
      return m.get("b") === 100
    }) === false)
    
    c.remove(1)
    
    t("remove", c.size() === 2 && c.at(1).get("b") === 8)
  },
  
  
  
  
  "template": function (t) {
    var m = new mochup.Model({name: "World"})
    var txt = mochup.tmpl("Hello, {{name}}!", m, function(r){
      txt = r
    })
    
    t("render template", txt === "Hello, World!")
    m.set("name", "Joe")
    t("update template", txt === "Hello, Joe!")
    m.set("name", "&\"<>")
    t("escape template", txt === "Hello, &amp;&quot;&lt;&gt;!")
  },
  
  
  
  "model render": function (t) {
    var div = document.createElement("div"), m = new mochup.Model({
      name: "Joe",
      age: 35
    })
    
    m.render("Hi, my name is <b>{{name}}</b> and I'm <b>{{age}}</b>!", div)
    t("initial render", div.innerHTML === "Hi, my name is <b>Joe</b> and I'm <b>35</b>!")
    
    m.set("age", 1000)
    
    t("re-render", div.innerHTML === "Hi, my name is <b>Joe</b> and I'm <b>1000</b>!")
  },
  
  "collection render": function (t) {
    var div = document.createElement("div"), c = new mochup.Collection('name', {})
    
    c.add({
      name: "Joe",
      age: 35
    })
    
    c.add({
      name: "Bob",
      age: 40
    })
    
    c.add({
      name: "Sue",
      age: 37
    })
    
    c.render("<p>Hi, my name is <b>{{name}}</b> and I'm <b>{{age}}</b>!</p>", div)
    t("initial render", div.innerHTML === "<p>Hi, my name is <b>Joe</b> and I'm <b>35</b>!</p><p>Hi, my name is <b>Bob</b> and I'm <b>40</b>!</p><p>Hi, my name is <b>Sue</b> and I'm <b>37</b>!</p>")
    
    c.add({
      name: "Jane",
      age: 60
    })

    t("re-render after added", div.innerHTML === "<p>Hi, my name is <b>Joe</b> and I'm <b>35</b>!</p><p>Hi, my name is <b>Bob</b> and I'm <b>40</b>!</p><p>Hi, my name is <b>Sue</b> and I'm <b>37</b>!</p><p>Hi, my name is <b>Jane</b> and I'm <b>60</b>!</p>")

    c.remove(3)
    t("re-render after removed", div.innerHTML === "<p>Hi, my name is <b>Joe</b> and I'm <b>35</b>!</p><p>Hi, my name is <b>Bob</b> and I'm <b>40</b>!</p><p>Hi, my name is <b>Sue</b> and I'm <b>37</b>!</p>")

    c.at(0).set("age", 36)
    t("re-render after change", div.innerHTML === "<p>Hi, my name is <b>Joe</b> and I'm <b>36</b>!</p><p>Hi, my name is <b>Bob</b> and I'm <b>40</b>!</p><p>Hi, my name is <b>Sue</b> and I'm <b>37</b>!</p>")

  }
  
}