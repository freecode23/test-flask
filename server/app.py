from flask import Flask, render_template, Response, request
from flask_cors import CORS
import json
from face_rec import FaceRec, sherly
from PIL import Image
import base64
import io
import cv2
import numpy as np

#socket import
from flask_socketio import SocketIO, send

app = Flask(__name__)
CORS(app)

# socket - get message
socketIo = SocketIO(app, cors_allowed_origins="*")
@socketIo.on("message")  
def handleMessage(msg):
    print("handling message", msg)
    send(msg, broadcast = True)
    return None



# http
@app.route('/api', methods=['POST', 'GET'])
def api():
    # 1. get the post request's json
	data = request.get_json()
 
	# 2. convert to base to PILimage then OpenCV frame
	result_str = data['data']
	b = bytes(result_str, 'utf-8')
	image = b[b.find(b'/9'):]
	pilImg = Image.open(io.BytesIO(base64.b64decode(image)))
	frame = cv2.cvtColor(np.array(pilImg), cv2.COLOR_BGR2RGB)	
 
	# 3. write on frame
	font = cv2.FONT_HERSHEY_SIMPLEX
	coord = (50, 50)
	fontScale = 1
	color = (255, 0, 0)
	thickness = 2
	frame = cv2.putText(frame, 'OpenCV', coord, font,
                     fontScale, color, thickness, cv2.LINE_AA)

	# 4. convert opencv frame to base64 string
	retval, buffer = cv2.imencode('.jpg', frame)
	base64String = base64.b64encode(buffer)
 
	# 5. send base64 back to react
	return base64String


if __name__ == '__main__':
	app.run(host='0.0.0.0')
	socketIo.run(app, debug=True)



