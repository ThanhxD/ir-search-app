from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', results=[{
        "title": "hello",
        "content": "Lorem ipsum dolor sit amet..."
    },
    {
        "title": "hey",
        "content": "Lorem ipsum dolor sit amet..."
    },
    {
        "title": "hi there",
        "content": "Lorem ipsum dolor sit amet..."
    },
    {
        "title": "hi",
        "content": "Lorem ipsum dolor sit amet..."
    },
    {
        "title": "good evening",
        "content": "Lorem ipsum dolor sit amet..."
    },
    {
        "title": "good afternoon",
        "content": "Lorem ipsum dolor sit amet..."
    },
    {
        "title": "good morning",
        "content": "Lorem ipsum dolor sit amet..."
    }
    ])

if __name__ == '__main__':
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 10
    app.run(debug=True)