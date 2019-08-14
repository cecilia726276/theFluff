### Data Sync Firebase to MySQL Tutorial:

- create the MySQL table in the local host

- use the syncrinization code listen to the firebase data and do the __syncrinization__

```javascript
//testing code for connection between MySQL and Firebase
exports.syncUsers = functions.database.ref('/Users/{userId}')
.onWrite(event => {
	var userId = event.params.userId;
var eventSnapshot = event.data;
	if (!event.data.exists()) {
	  	console.log("DELETE User by Id:" + userId);
		var DELETE_USER_SQL = "DELETE FROM `Users` where `userId` = ?";
		var params = [
			userId
		];
		var connection;
		return mysql.createConnection(dbconfig).then(function(conn){
			connection = conn;
			return connection.query(DELETE_USER_SQL, params);
		})
	}
	console.log("INSERT/UPDATE User by Id:" + userId);
	var INSERT_USER_SQL = "INSERT INTO `Users` (`id`, `username`, `email`, `enrollment) VALUES (?, ?, ?, ?)";
	var params = [
		userId,
		eventSnapshot.child("username") ? eventSnapshot.child("username").val() : null,
		eventSnapshot.child("email") ? 	eventSnapshot.child("email").val() : null,
		eventSnapshot.child("enrollment") ? eventSnapshot.child("enrollment").val() : null,
	];
	return mysql.createConnection(dbconfig).then(function(conn){
		connection = conn;
		return connection.query(INSERT_USER_SQL, params);
	});
});

```

```mysql
create table User (
id INT NOT NULL AUTO_INCREMENT,
username VARCHAR(250) NOT NULL,
email VARCHAR(250) NOT NULL,
enrollment INT NOT NULL,
PRIMARY KEY (id)
)  # user table for the use in the fluff
```

![firebase-to-mysql](https://www.ipragmatech.com/wp-content/uploads/2018/06/firebase-to-mysql.png)



This demo picture and connection tutorial code belongs to: 

https://www.ipragmatech.com/data-sync-firebase-mysql/



- The flask app builder's UI is just for demonstration the connection between the firebase and MySQL

- Code belongs to Flask-Appbuilder Documentation/ Tutorial

https://github.com/dpgaspar/Flask-AppBuilder/tree/master/examples

- MySQL is running on the localhost

- Requirement:

  - MySQL in localhost

  - pip install flask-appbuilder

  - ```
    localhost:8080
    ```



