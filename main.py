from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def home():
	return render_template('index.html')

@app.route('/make', methods=['POST'])
def make_meme():
	
	return render_template('make.html')

if __name__ == '__main__':
	app.debug = True
	app.run(host='0.0.0.0', port=10080)