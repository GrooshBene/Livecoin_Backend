import urllib2
import bs4
from pymongo import MongoClient
import requests, json
import time

client = MongoClient('localhost', 27017)
db = client.livecoin
coins = db.coins
users = db.users

def get_user(id):
	r = users.find_one({_id : id})
	return r['portfolio_tokens']

# get key list

#if "kraken" in key list:
#	update Kraken

#if "okcoincn" in key list:
#	update okcoincn





