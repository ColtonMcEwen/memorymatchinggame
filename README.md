# s19-deploy-eyepod101

# __Memory Game__


## User Quotes
+ __Id__ - identification of the player
+ __Name__ - name of the player
+ __Quote__ - phrase of the player
+ __Score__ - number of moves the player made to match the cards

## Users
+ __UserId__ - user identification of the player
+ __FirstName__ - user's first name
+ __LastName__ - user's last name
+ __Email__ - users email
+ __Password__ - users password with encryption using bcrypt

## Database Schema
```
CREATE TABLE memorygame (
id INTEGER PRIMARY KEY,
name TEXT,
quote TEXT,
score INTEGER);

CREATE TABLE users (
uid INTEGER PRIMARY KEY,
fname TEXT,
lname TEXT,
email TEXT,
password TEXT);
```

## REST Endpoints
Name | HTTP Method | Path
---- | ----------- | ----
getQuotes | GET | /quotes
getQuote | GET | /quotes/${id}
createQuote | POST | /quotes
updateQuote | PUT | /quotes/${id}
deleteQuote | DELETE | /quotes/${id}
createUser | POST | /users
loginUser | POST | /sessions
