# __Memory Game__

## Description
A grid of cards is laid out in front of the individual faced-down. The goal is to flip exactly two cards over and check if they match. If they don't, flip both cards back facing down. Repeat this with any combination of cards until two cards match. From there, keep the matching cards faced up and repeat with other cards until eventually, all the cards have matched.

The game keeps count of all attempts to match any two cards until all have matched. Once finished, the score is written to the database and is added to a list of other player scores!


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
id SERIAL PRIMARY KEY,
name TEXT,
quote TEXT,
score INTEGER);

CREATE TABLE users (
uid SERIAL PRIMARY KEY,
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
