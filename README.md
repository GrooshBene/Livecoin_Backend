# Livecoin_Backend
LiveCoin Backend Server

## Database Schema

> UserSchema

    _id : String

    firstName : String

    lastName : String

    nickname : String

    email : String

    password : String

    alertType : Number

        종류에 따라 Default 값을 0으로 하여 분류됩니다.
    
    alertSound : String

    refreshType : Number

    refreshRate : Number

    authToken : String

        Auto Auth Token

    verifyingToken : String

        e-mail Verifying Token

    favorite : Array

        Coin Schema의 id값을 배열로 저장합니다. 조회시 CoinSchema의 정보를 반환합니다.

    scrap : Array

        Text Schema의 id값을 배열로 저장합니다. 조회시 TextSchema의 정보를 반환합니다.

> TextSchema

    _id : String

    writer : String

        User Schema의 id값을 저장합니다. 조회시 UserSchema의 정보를 반환합니다.

    like : Number
    
    content : String

> CoinSchema

    _id : String

    name : String

    company : String

        거래소의 이름입니다.

    price : String

        현재 시세를 나타냅니다.

    volume : String

        V에 해당하는 값입니다.

    dailyLow : String

        일일 하한가를 나타냅니다.

    dailyHigh : String

        일일 상한가를 나타냅니다.

    like : Number

        추천 개수를 나타냅니다.

    dislike : Number

        비추천 개수를 나타냅니다.

    comments : Array

        Text Schema의 id값을 저장합니다. 조회시 TextSchema의 정보를 반환합니다.

    change : String

        값 변경 퍼센티지를 나타냅니다.


### API Document

> /auth/facebook/token : Facebook Token Authentication

>> Requiring Params

    access_token : Facebook Token

>> Return Values

    >>> On Success

        HTTP Code 200, User Schema

    >>> On Failure

        HTTP Code 404

> /auth/local/register : Local Database Sign in

>> Requiring Params

    firstName : User's First Name

    lastName : User's Last Name
    
    email : User's email

    password : User's Password

    nickname : User's Nickname

>> Return Values

    >>> On Success

        HTTP Code 200, Created User Schema

    >>> On Failure

        Server Error : Http Code 403

        Duplicated Schema : Http Code 401

> /auth/local/authenticate : Local Database Auto Authenticate

>> Requiring Params

    token : Auth Token

>> Return Values

    >>> On Success

        HTTP Code 200, User Schema

    >>> On Failure

        HTTP Code 404

> /auth/local/login : Local Database Login

>> Requiring Params

    email : User Email

    password : User Password

>> Returning Values

    >>> On Success

        HTTP Code 200, User Schema

    >>> On Failure

        DB Error : HTTP Code 403

        Unvaild User Info : HTTP Code 401

        Password Error : HTTP Code 401

        Cannot Find User Data : Http Code 404

> /coin/like : Coin Schema Like Activity

>> Requiring Params

    id : Coin Schema id

>> Returning Value

    needs to be update

> /coin/dislike : Coin Schema Dislike Activity

>> Requiring Params

    id : Coin Schema id

>> Returning Value

    needs to be update

> /comment/add : Create Comment

>> Requiring Params

    needs to be update

>> Returning Value

    needs to be update

> /comment/:id/block : Comment Block Activity

>> Requiring Params

    needs to be update

>> Returning Value

    needs to be update

> /comment/:id/like : Comment Like Activity

>> Requiring Params

    needs to be update

>> Returning Value

    needs to be update

> /comment/:id/scrap : Comment Scrap Activity

>> Requiring Params

    needs to be update

>> Returning Value

    needs to be update

> /comment/:id/report : Comment Report Activity

>> Requiring Params

    needs to be update

>> Returning Value

    needs to be update