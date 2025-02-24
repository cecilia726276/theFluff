import logging
from flask import Flask
from flask.ext.appbuilder import SQLA, AppBuilder

"""
 Logging configuration : part of the code belongs to the flask framework
"""

logging.basicConfig(format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')
logging.getLogger().setLevel(logging.DEBUG)

app = Flask(__name__)
app.config.from_object('config')
db = SQLA(app)
#appbuilder = AppBuilder(app, db.session)

from app.index import MyIndexView
appbuilder = AppBuilder(app, db.session, indexview=MyIndexView)


"""
from sqlalchemy.engine import Engine
from sqlalchemy import event

#Only include this for SQLLite constraints
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    # Will force sqllite contraint foreign keys
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
"""    

from app import views





