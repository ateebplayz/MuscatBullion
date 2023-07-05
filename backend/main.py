import MetaTrader5 as mt5
from time import sleep
import threading
import MetaTrader5
from flask import Flask, jsonify
import requests
import time
from flask_cors import CORS

login = 71380062
password = 'g5mmkgqf'
server = 'MetaQuotes-Demo'
path = "C:/Program Files/MetaTrader 5/terminal64.exe"

# Function to start Meta Trader 5 (MT5)
def start_mt5(username, password, server, path):
    # Ensure that all variables are the correct type
    uname = int(username) # Username must be an int
    pword = str(password) # Password must be a string
    trading_server = str(server) # Server must be a string
    filepath = str(path) # Filepath must be a string

    # Attempt to start MT5
    if MetaTrader5.initialize(login=uname, password=pword, server=trading_server, path=filepath):
        # Login to MT5
        if MetaTrader5.login(login=uname, password=pword, server=trading_server):
            print("Logged in to " + str(uname))
            return True
        else:
            print("Login Fail")
            quit()
            return PermissionError
    else:
        print("initialize() failed, error code =",MetaTrader5.last_error())
        quit()
        return ConnectionAbortedError
start_mt5(username=login, password=password, server=server, path=path)

app = Flask(__name__)
CORS(app)
dataOmr = []
data = []
margins = []  # Initialize margins as an empty list

def update_margins():
    global margins
    while True:
        try:
            response = requests.get('http://muscatbullionproject.grabyourservices.com:5001/api/margins')  # Send request to retrieve margins data
            response_data = response.json()
            if response_data.get('code') == 200:
                margins = response_data.get('data')  # Update margins with the received data
        except requests.RequestException as e:
            print('Error occurred while fetching margins:', e)
        time.sleep(1)  # Sleep for 1 second

# Start the background thread for margin updates
margin_update_thread = threading.Thread(target=update_margins)
margin_update_thread.daemon = True
margin_update_thread.start()

data_lock = threading.Lock()
status = True

def update_data():
    global data, status, gold_info, silver_info
    while status:
        selectedXAU = mt5.symbol_select("XAUUSD", True)
        selectedXAG = mt5.symbol_select("XAGUSD", True)
        gold_info = mt5.symbol_info("XAUUSD")
        silver_info = mt5.symbol_info("XAGUSD")
        
        with data_lock:
            if margins:  # Check if margins are available
                data = [
                    {
                        'symbol': 'XAUUSD',
                        'ask': gold_info.ask + margins[1]['value'] + 0.3,
                        'bid': gold_info.bid - margins[0]['value'] - 0.3,
                    },
                    {
                        'symbol': 'XAGUSD',
                        'ask': silver_info.ask + margins[2]['value'],
                        'bid': silver_info.bid - margins[3]['value']
                    }
                ]
        
        time.sleep(1)  # Sleep for 1 second

# Start the background thread for data updates
update_thread = threading.Thread(target=update_data)
update_thread.daemon = True
update_thread.start()

@app.route('/api/prices', methods=['GET'])
def get_prices():
    with data_lock:
        dataOmrGm = [
                {
                    'symbol': 'XAUUSD',
                    'ask': round(round(data[0]['ask'] / 116.64, 5) + margins[5]['value'], 5),
                    'bid': round(round(data[0]['bid']/ 116.64, 5) - margins[4]['value'], 5),
                },
                {
                    'symbol': 'XAGUSD',
                    'ask': round(silver_info.ask / 1000, 5) + margins[9]['value'],
                    'bid': round(silver_info.bid / 1000, 5) - margins[8]['value'],
                }
            ]
        dataOmrT = [
                {
                    'symbol': 'XAUUSD',
                    'ask': round(data[0]['ask'] * 1.4485, 5) + margins[7]['value'],
                    'bid': round(data[0]['bid'] * 1.4485, 5) - margins[6]['value'],
                },
                {
                    'symbol': 'XAGUSD',
                    'ask': round(silver_info.ask * 13, 5) + margins[10]['value'],
                    'bid': round(silver_info.bid * 13, 5) - margins[11]['value'],
                }
        ]
        response = {
            'data': data,
            'dataOmrGm': dataOmrGm,
            'dataOmrT': dataOmrT,
        }
        return jsonify(response)
    
if __name__ == '__main__':
    app.run(host ='0.0.0.0', port=5000)
