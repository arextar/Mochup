## Mochup
A speedy framework for creating model-linked HTML views


## Example Use:

````javascript
var users = new mochup.Collection({
	fullName: [function(firstName, lastName){
		return firstName + lastName;
	}, 'firstName', 'lastName']
});

users.add({
	id: 0,
	firstName: "John",
	lastName: "Doe"
});

users.add({
	id: 1,
	firstName: "Jane",
	lastName: "Doe"
});


users.render("<li><a href='/user/{{id}}'>{{fullName}}</a></li>", ul_element);

/* HTML:

<ul>
	<li><a href='/user/0'>John Doe</a></li>
	<li><a href='/user/1'>Jane Doe</a></li>
</ul>
*/

````