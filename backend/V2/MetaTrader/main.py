# pip install MetaTrader5 threading flask requests time flask_cors

import MetaTrader5
import threading
from flask import Flask, jsonify, request
import requests
import time
from flask_cors import CORS

import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

keys = os.environ.get("keys")
valid_api_keys = keys.split(',') if keys else []
print(valid_api_keys)
# Credentials

MetaUser = 9999330233 # Meta Trader 5 Login Username
MetaPassword = 'TdG*3sHy' # Meta Trader 5 Login Password
MetaPath = 'C:/Program Files/MetaTrader 5/terminal64.exe' # Meta Trader 5 Path
MetaServer = 'MetaQuotes-Demo' # Meta Trader 5 Server

def start_MetaTrader(metaUser, metaPassword, metaPath, metaServer):
    if MetaTrader5.initialize(login=metaUser, password=metaPassword, server=metaServer, path=metaPath):
        if MetaTrader5.login(login=metaUser, password=metaPassword, server=metaServer):
            print("Logged in to " + str(metaUser))
            return True
        else:
            print("Login Fail")
            quit()
            return PermissionError
    else:
        print("initialize() failed, error code =",MetaTrader5.last_error())
        quit()
        return ConnectionAbortedError

start_MetaTrader(metaUser=MetaUser, metaPassword=MetaPassword, metaPath=MetaPath, metaServer=MetaServer)

app = Flask(__name__)
CORS(app)
dataOmr = []
data = [
        {
            'symbol': 'XAUUSD',
            'ask': 0,
            'bid': 0,
        },
        {
            'symbol': 'XAGUSD',
            'ask': 0,
            'bid': 0,
        }
       ]

data_lock = threading.Lock()
status = True

def update_data():
    global data, status, gold_info, silver_info
    while status:
        gold_info = MetaTrader5.symbol_info("XAUUSD")
        silver_info = MetaTrader5.symbol_info("XAGUSD")
        
        with data_lock:
            data = [
                {
                    'symbol': 'XAUUSD',
                    'ask': float(format(gold_info.ask, '.2f')),
                    'bid': float(format(gold_info.bid, '.2f')),
                },
                {
                    'symbol': 'XAGUSD',
                    'ask': float(format(silver_info.ask, '.2f')),
                    'bid': float(format(silver_info.bid, '.2f')),
                }
            ]
        
        time.sleep(1)  # Sleep for 1 second

# Start the background thread for data updates
update_thread = threading.Thread(target=update_data)
update_thread.daemon = True
update_thread.start()

@app.route('/api/prices', methods=['GET'])
def get_prices():
    provided_key = request.args.get('key')
    if provided_key in valid_api_keys:
        with data_lock:
            print(data)
            dataOmrT = [
                {
                    'symbol': 'XAUUSD',
                    'ask': float(format(data[0]['ask'] * 1.4485, '.3f')),
                    'bid': float(format(data[0]['bid'] * 1.4485, '.3f')),
                },
                {
                    'symbol': 'XAGUSD',
                    'ask': float(format(silver_info.ask * 13, '.3f')),
                    'bid': float(format(silver_info.bid * 13, '.3f')),
                }
            ]
            dataOmrGm = [
                {
                    'symbol': 'XAUUSD',
                    'ask': float(format(dataOmrT[0]['ask'] / 116.64, '.3f')),
                    'bid': float(format(dataOmrT[0]['bid'] / 116.64, '.3f'),)
                },
                {
                    'symbol': 'XAGUSD',
                    'ask': float(format(dataOmrT[1]['ask'] / 1000, '.3f')),
                    'bid': float(format(dataOmrT[1]['bid'] / 1000 , '.3f'),)
                }
            ]
            response = {
                'data': data,
                'dataOmrGm': dataOmrGm,
                'dataOmrT': dataOmrT,
            }
            return jsonify(response)
    else:
        return jsonify({'code': 201, 'error': 'Authentication Error, Invalid Key'})

    
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5001)

