# MyAnimeWish API Documentation

## Endpoints :

List of available endpoints:

- `POST /add-user`
- `POST /login`
- `POST /google-login`
- `GET /github-login`

- `POST /anime`
- `GET /anime`
- `GET /anime/:id`
- `PUT /anime/:id`
- `DELETE /anime/:id`

&nbsp;

## 1. POST /add-user

Request:

- body:

```json
{
  {
    "email": "string",
    "password": "string"
  }
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "Email already exists"
}
```

&nbsp;

## 2. POST /login

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "email": "string",
  "role": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email/Password is required"
}
```

&nbsp;

## 3. POST /google-login

Request:

- headers:

```json
{
  "google_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "email": "string"
}
```

&nbsp;

## 4. GET /github-login

Request:

- params:

```json
{
  "code": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "email": "string"
}
```

&nbsp;

## 5. POST /anime

Description:

- Add anime to Animes table

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  {
    "url": "string",
    "inageUrl": "string",
    "title": "string",
    "score": "float"
}
}
```

_Response (201 - Created)_

```json
{
   {
    "anime": {
        "id": "integer (required)",
        "url": "string",
        "imageUrl": "string",
        "title": "string",
        "score": "float",
        "userScore": "integer",
        "status": "string",
        "UserId": "integer (required)",
        "updatedAt": "date",
        "createdAt": "date"
    }
}
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "url is required"

}
OR
{
  "message": "imageUrl is required"
}
OR
{
  "message": "title is required"
}
OR
{
  "message": "score is required"
}
OR
{
  "message": "userScore is required"
}
OR
{
  "message": "status is required"
}
OR
{
  "message": "UserId is required"
}
```

&nbsp;

## 6. GET /anime

Description:

- Get all logged in user watchlist from database

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
 {
        "id": 1,
        "url": "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
        "imageUrl": "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
        "title": "Sousou no Frieren",
        "score": 9.39,
        "userScore": 9,
        "status": "Completed",
        "UserId": 1,
        "createdAt": "2024-04-18T03:41:45.498Z",
        "updatedAt": "2024-04-18T07:21:44.869Z"
    },
    {
        "id": 4,
        "url": "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood",
        "imageUrl": "https://cdn.myanimelist.net/images/anime/1208/94745t.jpg",
        "title": "Fullmetal Alchemist: Brotherhood",
        "score": 9.09,
        "userScore": 0,
        "status": "Plan to watch",
        "UserId": 1,
        "createdAt": "2024-04-18T03:47:54.051Z",
        "updatedAt": "2024-04-18T03:47:54.051Z"
    },
  ...,
]
```

&nbsp;

## 7. GET /anime/:id

Description:

- Get wathclist anime by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "url": "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
  "imageUrl": "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
  "title": "Sousou no Frieren",
  "score": 9.39,
  "userScore": 9,
  "status": "Completed",
  "UserId": 1,
  "createdAt": "2024-04-18T03:41:45.498Z",
  "updatedAt": "2024-04-18T07:21:44.869Z",
  "User": {
    "id": 1,
    "email": "fayiznaufal@gmail.com",
    "createdAt": "2024-04-18T03:41:38.316Z",
    "updatedAt": "2024-04-18T03:41:38.316Z"
  }
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

&nbsp;

## 8. PUT /anime/:id

Description:

- Edit watchlist anime by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "userScore": "integer",
  "status": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "anime": {
    "id": 1,
    "url": "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
    "imageUrl": "https://cdn.myanimelist.net/images/anime/1015/138006t.jpg",
    "title": "Sousou no Frieren",
    "score": 9.39,
    "userScore": 9,
    "status": "Finished",
    "UserId": 1,
    "createdAt": "2024-04-18T03:41:45.498Z",
    "updatedAt": "2024-04-18T11:26:08.632Z"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "userScore is required"
}
OR
{
  "message": "status is required"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found."
}
```

&nbsp;

## 9. DELETE /anime/:id

Description:

- Delete wathclist anime by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "<anime title> success to delete"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found."
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Unauthenticated"
}
OR
{
  "message": "Invalid Email/Password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
