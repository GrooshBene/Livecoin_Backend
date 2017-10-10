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

        Coin Schema의 id값(ObjectId)을 배열로 저장합니다. 조회시 CoinSchema의 정보를 반환합니다.

    scrap : Array

        Text Schema의 id값을 배열로 저장합니다. 조회시 TextSchema의 정보를 반환합니다.
	
	emailVeryfied : Number
		
		Email 인증 여부를 나타내는 값입니다. 인증 안됨을 0으로 표기합니다.

    portfolioToken : Object

        포트폴리오 기능을 사용하는 거래소들의 토큰 정보가 담겨있는 오브젝트입니다.

        * 예시 :
            {
                "kraken" : "키값",
                "okcoincn" : "키값"
            }
> TextSchema

    _id : String

    writer : String

        User Schema의 id값을 저장합니다. 조회시 UserSchema의 정보를 반환합니다.

    like : Array
		
		추천을 누른 유저id의 배열입니다.
    
    content : String

> CoinSchema

    _id : String

    name : String

        코인의 이름입니다.

    currency : String

        코인의 환율값입니다.

    key : String

        coin's AltName

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

    like : Array

        추천을 누른 유저id의 배열을 나타냅니다.

    dislike : Array

        비추천을 누른 유저id의 배열을 나타냅니다.

    comments : Array

        Text Schema의 id값을 저장합니다. 조회시 TextSchema의 정보를 반환합니다.

    change : String

        값 변경 퍼센티지를 나타냅니다. (거래소에 따라 지원여부 다름)


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

> /auth/local/register/mail : Local Database Register Email Authenticate

>> Requiring Params

    email : User email

    token : User Email Verifying Token

>> Returning Values

    >>> On Success

        HTTP Code 200, User Schema

    >>> On Failure

        DB Error : HTTP Code 403

        Unmatched Token : HTTP Code 404

> /coin/like/:Company/:CoinName : Coin Schema Like Activity

>> Requiring Params

    id : Coin Schema id

	user_id : User id

	company : (URL Param) Company Name

	coinname : (URL Param) Coin Name

>> Returning Value

    >>> On Success
		
		HTTP Code 200, Updated Coin Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /coin/dislike/:Company/:CoinName : Coin Schema Dislike Activity

>> Requiring Params

    id : Coin Schema id
	
	user_id : User id

	company : (URL Param) Company Name

    coinname : (URL Param) Coin Name

>> Returning Value

    >>> On Success
		
		HTTP Code 200, Updated Coin Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /coin/find/:companyName : 해당하는 거래소의 코인 정보를 모두 가져옵니다.

>> Requiring Params

	companyName (URL Param) : Coin Company name
	
>> Returning Value
	
	>>> On Success
	
		HTTP Code 200, Searched Coin Schema Array
		
	>>> On Failure
		
		DB Error : HTTP Code 401 
		
> /coin/find/:companyName/:coinName : 해당하는 거래소의 단일 코인 정보를 가져옵니다.

>> Requiring Params
	
	companyName (URL Param) : Coin Company name
	
	coinName (URL Param) : Coin name
	
>> Returning Value

	>>> On Success
	
		HTTP Code 200, Searched Coin Schema
		
	>>> On Failure
	
		DB Error : HTTP Code 401
		
> /coin/user/favorite/add : 유저의 선호코인을 추가합니다.

>> Requiring Params

	user_id : Update Target User id

	coin_id : coin id

>> Returning Value
	
	>>> On Success

		HTTP Code 200, Updated User Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /coin/user/favorite : 유저의 선호코인 정보들을 모두 가져옵니다.

>> Requiring Params
	
	user_id : Search Target User id

>> Returning Value

	>>> On Success

		HTTP Code 200, Searched User Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /comment/add : Create Comment

>> Requiring Params

   	user_id : Writer's id

	coin_id : Coin's id	

	content : Comment's content

>> Returning Value

    >>> On Success
		
		HTTP Code 200, Created Comment Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /comment/:company/:coin : 제시한 코인에 해당하는 댓글을 모두 불러옵니다.

>> Requiring Params

	company : 코인의 거래소입니다.

	name : 코인의 통화 종류입니다.

>> Returning Value

	>>> On Success

		HTTP Code 200, Searched Comment Schema Array

	>>> On Failure

		DB Error : HTTP Code 401

> /comment/:id/block : Comment Block Activity

>> Requiring Params

    id : Block Target Comment id

	user_id : User's Id

>> Returning Value

    >>> On Success

		HTTP Code 200, Updated User Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /comment/:id/like : Comment Like Activity

>> Requiring Params

   id : Update Target Comment id
   
   user_id : User id 

>> Returning Value

    >>> On Success

		HTTP Code 200, Update Comment Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /comment/:id/scrap : Comment Scrap Activity

>> Requiring Params

    id (URL Param) : Push Target comment id

	user_id : Update Target user id

>> Returning Value

   	>>> On Success

		HTTP Code 200, Updated User Schema

	>>> On Failure

		DB Error : HTTP Code 401

> /comment/:id/report : Comment Report Activity

>> Requiring Params

    id : Report Target comment id

>> Returning Value

    >>> On Success

		HTTP Code 200, Reported Comment Schema

	>>> On Failure

		DB Error : HTTP Code 401

### Portfolio
구현중