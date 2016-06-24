from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
	if request.method == 'GET':
		return render_template('index.html')

	if request.method == 'POST':
		text = request.form['meme_text']
		return render_template('index.html', text=text)

if __name__ == '__main__':
	app.debug = True
	app.run(host='0.0.0.0', port=10080)