import urllib2
import bs4
from pymongo import MongoClient
import requests, json
import time

client = MongoClient('localhost', 27017)
db = client.livecoin
collection = db.coins

def get_coin(url):
    res = requests.get(url)
    obj = res.json()
    return obj

def remove_key(d, key):
    r = dict(d)
    del d[key]
    return d

start_time = time.time()
#-------------------------------------------------------------------------------------------- kraken

kraken = get_coin("https://api.kraken.com/0/public/AssetPairs")
for key, value in kraken['result'].iteritems():
    if ".d" in key:
        continue
    print "kraken : " + value['altname']
    res = requests.get("https://api.kraken.com/0/public/Ticker?pair=" + value['altname'])
    obj = res.json()
    current_res = requests.get("https://api.kraken.com/0/public/Spread?pair=" + value['altname'])
    current_obj = current_res.json()
    temp_schema = collection.find_one({"company" : "kraken", "name" : key})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    if "USDTUSD" in key:
        name = key[0:4]
        currency = key[5:]
        print name + " : " + currency
    elif len(key) == 6:
        name = key[0:3]
        currency = key[3:]
        print name + " : " + currency
    elif len(key) == 7:
        name = key[0:4]
        currency = key[4:]
        print name + " : " + currency
    elif len(key) == 8:
        name = key[1:4]
        currency = key[5:]
        print name + " : " + currency



    coin = {
        "key" : value['altname'],
        "name" : name,
        "company" : "kraken",
        "currency" : currency,
        "price" : current_obj['result']['last'],
        'volume' : obj['result'][''+key]['v'][0],
        'dailyLow' : obj['result'][''+key]['l'][0],
        'dailyHigh' : obj['result'][''+key]['h'][0],
        'prevPrice' : prev_value,
        'like' : [],
        'dislike' : [],
        'comments' : [],
        'change' : "Not Supported"
        }
    collection.update({"key" : key, "company" : "kraken"}, coin, upsert = True)
    time.sleep(1)

#-------------------------------------------------------------------------------------------- gemini
gemini = get_coin("https://api.gemini.com/v1/symbols")
for value in gemini:
    if "ethbtc" in value:
        continue
    print "gemini : " + value
    value.encode('ascii', 'ignore')
    split_value = value[0:3]
    name = value[0:3]
    currency = value[3:]
    res = requests.get("https://api.gemini.com/v1/pubticker/" + value)
    obj = res.json()
    current_res = requests.get("https://api.gemini.com/v1/auction/" + value)
    current_obj = current_res.json()
    temp_schema = collection.find_one({"company" : "gemini", "name" : value})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    if 'last_auction_price' in current_obj.keys():
        price = current_obj['last_auction_price']
    elif 'last_auction_price' not in current_obj.keys():
        price = '0'


    coin = {
        "name" : name,
        "currency" : currency,
        "key" : value,
        "company" : "gemini",
        "price" : price,
        "prevPrice" : prev_value,
        'volume' : "0",
        "dailyLow" : obj['ask'],
        'dailyHigh' : obj['bid'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
        }
    collection.update({"key" : value, "company" : "gemini"}, coin, upsert = True)

#--------------------------------------------------------------------------------------------- korbit
korbit = {"ETCKRW" : "etc_krw", "BTCKRW" : "btc_krw", "XRPKRW" : "xrp_krw"}
for key, value in korbit.iteritems():
    print "korbit : " + key
    res = requests.get("https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=" + value)
    obj = res.json()
    current_res = requests.get("https://api.korbit.co.kr/v1/ticker?currency_pair=" + value)
    current_obj = current_res.json()
    temp_schema = collection.find_one({"company" : "korbit", "name" : key})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    coin = {
        "name" : key[0:3],
        "currency" : key[3:],
        "key" : key,
        "company" : "korbit",
        "price" : current_obj['last'],
        "prevPrice" : prev_value,
        "volume" : obj['volume'],
        "dailyLow" : obj['ask'],
        "dailyHigh" : obj['bid'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
        }
    collection.update({"key" : key, "company" : "korbit"}, coin, upsert = True)
#---------------------------------------------------------------------------------------------- okcoincn

# okcoincn = {"BTCCNY" : "btc_cny", "LTCCNY" : "ltc_cny", "ETHCNY" : "eth_cny" , "ETCCNY" : "etc_cny", "BCCCNY" : "bcc_cny"}
# for key, value in okcoincn.iteritems():
#     print "okcoincn : " + key
#     res = requests.get("https://www.okcoin.cn/api/v1/ticker.do?symbol=" + value)
#     obj = res.json()
#     #current_res = requests.get("https://api.korbit.co.kr/v1/ticker?currency_pair=" + value)
#     #current_obj = requests.get("https://api.korbit.co.kr/v1/ticker?currency_pair=" + value)

#     temp_schema = collection.find_one({"company" : "okcoincn", "name" : key})
#     if temp_schema is None:
#         prev_value = 0
#     elif temp_schema is not None:
#         prev_value = temp_schema['price']
#     coin = {
#         "name" : key[0:3],
#         "currency" : key[3:],
#         "key" : key,
#         "company" : "okcoincn",
#         "price" : obj['ticker']['last'],
#         "prevPrice" : prev_value,
#         "volume" : obj['ticker']['vol'],
#         "dailyLow" : obj['ticker']['low'],
#         "dailyHigh" : obj['ticker']['high'],
#         "like" : [],
#         "dislike" : [],
#         "comments" : [],
#         "change" : "Not Supported"
#         }
#     collection.update({"key" : key, "company" : "okcoincn"}, coin, upsert = True)
# #------------------------------------------------------------------------------------------------ bitflyer

bitflyer = get_coin("https://api.bitflyer.jp/v1/markets")
for value in bitflyer:
    print "bitflyer : " + value['product_code']
    res = requests.get("https://api.bitflyer.jp/v1/ticker?product_code=" + value['product_code'])
    obj = res.json()
    temp_schema = collection.find_one({"company" : "bitflyer", "name" : value['product_code']})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    coin = {
        "name" : value['product_code'][0:3],
        "currency" : value['product_code'][3:],
        "key" : value['product_code'],
        "company" : "bitflyer",
        "price" : obj['ltp'],
        "prevPrice" : prev_value,
        "volume" : obj['volume'],
        "dailyLow" : obj['best_bid'],
        "dailyHigh" : obj['best_ask'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
        }
    collection.update({"key" : value['product_code'], "company" : "bitflyer"}, coin, upsert = True)

#----------------------------------------------------------------------------------------------- poloniex
poloniex = get_coin("https://poloniex.com/public?command=returnTicker")
for key, value in poloniex.iteritems():
    print "poloniex : " + key
    temp_schema = collection.find_one({"company" : "poloniex", "name" : key})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    if "USDTUSD" in key:
        name = key[0:4]
        currency = key[5:]
        print name + " : " + currency
    elif len(key) == 6:
        name = key[0:3]
        currency = key[3:]
        print name + " : " + currency
    elif len(key) == 7:
        name = key[0:4]
        currency = key[4:]
        print name + " : " + currency
    elif len(key) == 8:
        name = key[1:4]
        currency = key[5:]
        print name + " : " + currency
    coin = {
        "name" : name,
        "currency" : currency,
        "key" : key,
        "company" : "poloniex",
        "price" : value['last'],
        "prevPrice" : temp_schema,
        "volume" : value['baseVolume'],
        "dailyLow" : value['lowestAsk'],
        "dailyHigh" : value['highestBid'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : value['percentChange']
        }
    collection.update({"key" : key, "company" : "poloniex"}, coin, upsert = True)
    
# #----------------------------------------------------------------------------------------------- coinone
coinone = {"BTCUSD" : "btc", "BCHUSD" : "bch", "ETHUSD" : "eth", "ETCUSD" : "etc" , "XRPUSD" : "xrp"}
for key, value in coinone.iteritems():
    print "coinone : " + key
    res = requests.get("https://api.coinone.co.kr/ticker?currency=" + value);
    obj = res.json()
    temp_schema = collection.find_one({"company" : "coinone", "name" : key})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    coin = {
        "name" : key[0:3],
        "currency" : key[3:],
        "key" : key,
        "company" : "coinone",
        "price" : obj['last'],
        "prevPrice" : prev_value,
        "volume" : obj['volume'],
        "dailyLow" : obj['low'],
        "dailyHigh" : obj['high'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
        }
    collection.update({"key" : key, "company" : "coinone"} ,coin, upsert = True)
    
# #------------------------------------------------------------------------------------------------ bittrex

bittrex = get_coin("https://bittrex.com/api/v1.1/public/getmarkets")
for obj in bittrex['result']:
    print "bittrex : " + obj['MarketName']
    res = requests.get("https://bittrex.com/api/v1.1/public/getticker?market=" + obj['MarketName'])
    market_obj = res.json()
    temp_schema = collection.find_one({"company" : "bittrex", "name" : obj['MarketName']})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']

    coin = {
        "name" : obj['MarketName'][0:3],
        "currency" : obj['MarketName'][3:],
        "key" : obj['MarketName'],
        "company" : "bittrex",
        "price" : market_obj['result']['Last'],
        "prevPrice" : prev_value,
        "volume" : "",
        "dailyLow" : market_obj['result']['Bid'],
        "dailyHigh" : market_obj['result']['Ask'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
    }
    collection.update({"key" : obj['MarketName'], "company" : "bittrex"}, coin, upsert=True)


# #------------------------------------------------------------------------------------------------ bithumb
bithumb = get_coin("https://api.bithumb.com/public/ticker/all")
bithumb_data = remove_key(bithumb['data'], "date")
for key, value in bithumb_data.iteritems():
    print "bithumb : " + key
    temp_schema = collection.find_one({"company" : "bithumb", "name" : key})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']
    coin = {
        "name" : key[0:3],
        "currency" : key[3:],
        "key" : key,
        "company" : "bithumb",
        "price" : value['average_price'],
        "prevPrice" : prev_value,
        "volume" : value['volume_1day'],
        "dailyLow" : value['min_price'],
        "dailyHigh" : value['max_price'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
    }
    collection.update({"key" : key, "company" : "bithumb"}, coin, upsert = True)

# #------------------------------------------------------------------------------------------------ coinbase
coinbase = {"BTC" : "btc" , "ETH" : "eth", "LTC" : "ltc"}
for key, value in coinbase.iteritems():
    print "coinbase : " + key
    res = requests.get("https://api.coinbase.com/v2/exchange-rates?currency=" + value)
    obj = res.json()
    coinbase_obj = obj['data']['rates']
    for ikey, ivalue in coinbase_obj.iteritems():
        temp_schema = collection.find_one({"company" : "coinbase", "name" : key+ikey})
        if temp_schema is None:
            prev_value = 0
        elif temp_schema is not None:
            prev_value = temp_schema['price']
        coin = {
            "name" : key,
            "currency" : ikey,
            "key" : key+ikey,
            "company" : "coinbase",
            "price" : ivalue,
            "prevPrice" : prev_value,
            "volume" : "Not Supported",
            "dailyLow" : "Not Supported",
            "dailyHigh" : "Not Supported",
            "like" : [],
            "dislike" : [],
            "comments" : [],
            "change" : "Not Supported"
        }
        collection.update({"key" : key+ikey, "company" : "coinbase"}, coin, upsert=True)

# #------------------------------------------------------------------------------------------------ bitstamp
bitstamp = {
    "BTCUSD" : "btcusd",
    "BTCEUR" : "btceur",
    "EURUSD" : "eurusd",
    "XRPUSD" : "xrpusd",
    "XRPEUR" : "xrpeur",
    "XRPBTC" : "xrpbtc",
    "LTCUSD" : "ltcusd",
    "LTCEUR" : "ltceur",
    "LTCBTC" : "ltcbtc",
    "ETHUSD" : "ethusd",
    "ETHEUR" : "etheur",
    "ETHBTC" : "ethbtc"
    }
for key, value in bitstamp.iteritems():
    print "bitstamp : " + value
    res = requests.get("https://www.bitstamp.net/api/v2/ticker/" + value)
    obj = res.json()
    temp_schema = collection.find_one({"company" : "kraken", "name" : value})
    if temp_schema is None:
        prev_value = 0
    elif temp_schema is not None:
        prev_value = temp_schema['price']
    coin = {
        "name" : key[0:3],
        "currency" : key[3:],
        "key" : key,
        "company" : "bitstamp",
        "price" : obj['last'],
        "prevPrice" : prev_value,
        "volume" : obj['volume'],
        "dailyLow" : obj['low'],
        "dailyHigh" : obj['high'],
        "like" : [],
        "dislike" : [],
        "comments" : [],
        "change" : "Not Supported"
    }
    collection.update({"key" : key, "company" : "bitstamp"}, coin, upsert=True)
#--------------------------------------------------------------------------------------------------- yunbi
# yunbi = get_coin("https://yunbi.com//api/v2/tickers.json")
# for key, value in yunbi.iteritems():
#     print "yunbi : " + key
#     coin = {
#         "name" : key.upper(),
#         "company" : "yunbi",
#         "price" : value['ticker']['last'],
#         "volume" : value['ticker']['vol'],
#         "dailyLow" : value['ticker']['low'],
#         "dailyHigh" : value['ticker']['high'],
#         "like" : [],
#         "dislike" : [],
#         "comments" : [],
#         "change" : "Not Supported"
#     }
#     collection.update({"name" : key.upper(), "company" : "yunbi"}, coin, upsert=True)
time.sleep(1.2)
finish_time = time.time()

time_result = finish_time - start_time

print "Update Done! : " + str(time_result) + " sec"
