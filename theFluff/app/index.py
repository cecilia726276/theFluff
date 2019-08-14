# this class belongs to the frame work flask app-builder 
# https://github.com/dpgaspar/Flask-AppBuilder/tree/master/examples

from flask_appbuilder import IndexView

class MyIndexView(IndexView):
    index_template = 'index.html'
