from flask import Flask, render_template, Response, request
from flask_cors import CORS
import json
from PIL import Image
import base64
import io
import cv2
import numpy as np
import simplejpeg


import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#socket import
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'lkjsefl873lkjhfEbhsUd4xJ7waa6Brg='

CORS(app)
font = cv2.FONT_HERSHEY_SIMPLEX
coord = (50, 50)
fontScale = 1
color = (255, 0, 0)
thickness = 2

# socketIo = SocketIO(app, cors_allowed_origins="*")
socketIo = SocketIO(app, cors_allowed_origins="*", async_mode="gevent")

@socketIo.on('connect')
def test_connect(auth):
    logger.info('received connect request from client')
    emit('init', {'backend': 'ack'})


# A. Socket - get frame
@socketIo.on("frame")  
def handleMessage(data):
    result_str = data
    if(not result_str):
        print("no frames received")
    else:
        # logger.info('handling socketIO frame')
        # logger.info('handling socketIO frame [result_str: %s]', result_str)
        # 2. convert base64 to OpenCV frame
        b = bytes(result_str, 'utf-8')
        image = b[b.find(b'/9'):]
        
        # opt1: use pilImg
        # pilImg = Image.open(io.BytesIO(base64.b64decode(image)))
        # frame = cv2.cvtColor(np.array(pilImg), cv2.COLOR_BGR2RGB)
        
        # opt2: convert directly
        im_bytes = base64.b64decode(image)
        im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
        frame = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)

		# 3. write on frame
        frame = cv2.putText(frame, 'OpenCV', coord, font,
							fontScale, color, thickness, cv2.LINE_AA)
        
        # 4. convert opencv frame to jpeg 
        # opt1: use imencode
        # retval, buffer = cv2.imencode('.jpg', frame)
        
        # opt2: use simplejpeg
        buffer = simplejpeg.encode_jpeg(frame, colorspace='BGR')
        
        # 5. convert jpeg to base64
        base64Bytes = base64.b64encode(buffer)
        json_string = json.dumps({'image': base64Bytes.decode("utf-8")})
    
        # 6. send frame back
        emit("frame", json_string, broadcast=True)



@socketIo.on('disconnect')
def test_disconnect():
    logger.info('received disconnect request from client')


# B. HTTP
# @app.route('/api', methods=['POST', 'GET'])
# def api():
#     # 1. get the post request's json
# 	data = request.get_json()
 
# 	# 2. convert to base to PILimage then OpenCV frame
# 	result_str = data['data']
# 	b = bytes(result_str, 'utf-8')
# 	image = b[b.find(b'/9'):]
# 	pilImg = Image.open(io.BytesIO(base64.b64decode(image)))
# 	frame = cv2.cvtColor(np.array(pilImg), cv2.COLOR_BGR2RGB)	
 
# 	# 3. write on frame
# 	font = cv2.FONT_HERSHEY_SIMPLEX
# 	coord = (50, 50)
# 	fontScale = 1
# 	color = (255, 0, 0)
# 	thickness = 2
# 	frame = cv2.putText(frame, 'OpenCV', coord, font,
#                      fontScale, color, thickness, cv2.LINE_AA)

#     # 4. convert opencv frame to base64 string
# 	retval, buffer = cv2.imencode('.jpg', frame)
# 	base64String = base64.b64encode(buffer)
 
# 	# 5. send base64 back to react
# 	return base64String


if __name__ == '__main__':
	# app.run(host='0.0.0.0', port=5500)
	socketIo.run(
        app,
        host='0.0.0.0',
        port=5500,
        debug=True
    )
