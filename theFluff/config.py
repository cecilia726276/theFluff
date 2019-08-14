import os
from flask_appbuilder.security.manager import AUTH_OID, AUTH_REMOTE_USER, AUTH_DB, AUTH_LDAP, AUTH_OAUTH
basedir = os.path.abspath(os.path.dirname(__file__))

# this class belongs to the frame work flask app-builder 
# https://github.com/dpgaspar/Flask-AppBuilder/tree/master/examples

SECRET_KEY = '\2\1theFluff\1\2\e\y\y\h'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
CSRF_ENABLED = True

AUTH_TYPE = AUTH_DB
BABEL_DEFAULT_LOCALE = 'en'
BABEL_DEFAULT_FOLDER = 'translations'

LANGUAGES = {
    'en': {'flag':'gb', 'name':'English'},
}

UPLOAD_FOLDER = basedir + '/app/static/uploads/'
IMG_UPLOAD_FOLDER = basedir + '/app/static/uploads/'
IMG_UPLOAD_URL = '/static/uploads/'
