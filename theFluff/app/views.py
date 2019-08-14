'''
We use a open source frame work called: Flask-Appbuilder 
https://github.com/dpgaspar/Flask-AppBuilder/tree/master/examples
The current code base is used for demonstration for connection to the MySQL
UI idea and data base schema can mapping to the MySQL for the connection to Firebase Using
'''
from flask.ext.appbuilder.models.sqla.interface import SQLAInterface
from app import appbuilder, db
from flask import render_template, flash
from flask.ext.appbuilder import ModelView, MultipleView, MasterDetailView
from flask_appbuilder import AppBuilder, expose, BaseView, has_access, SimpleFormView
from flask_babel import lazy_gettext as _
from flask_appbuilder.charts.views import DirectByChartView
from wtforms import Form, StringField
from wtforms.validators import DataRequired
from flask_appbuilder.fieldwidgets import BS3TextFieldWidget
from flask_appbuilder.forms import DynamicForm

from flask_appbuilder.widgets import ListThumbnail
from .models import College, Department, Major, MClass, Teacher, Student
from flask_appbuilder.actions import action
from wtforms.ext.sqlalchemy.fields import QuerySelectField
from flask_appbuilder.fieldwidgets import BS3TextFieldWidget, Select2Widget
from flask_appbuilder import AppBuilder, expose, BaseView
from app import appbuilder
from flask_appbuilder import has_access

"""
    this code belongs to the Flask app builder
    class MyModelView(ModelView):
        datamodel = SQLAInterface(MyModel)
    Next, register your Views::
    appbuilder.add_view(MyModelView, "My View", icon="fa-folder-open-o", category="My Category", category_icon='fa-envelope')
"""


class MyView(BaseView):
    default_view = 'hello'

    @expose('/message/<string:msg>')
    @has_access
    def message(self, msg):
        msg = 'Hello %s' % (msg)
        return msg
        return self.render_template('index.html',msg = msg)

appbuilder.add_link("Welcome", href='/myview/welcome/student', category='My View')




# create the contact Model view
class ContactModelView(ModelView):
    datamodel = SQLAInterface(Contact)

    label_columns = {'contact_group':'Contacts Group'}
    list_columns = ['name','personal_cellphone','birthday','contact_group']

    show_fieldsets = [
                        (
                            'Summary',
                            {'fields':['name','address','contact_group']}
                        ),
                        (
                            'Personal Info',
                            {'fields':['birthday','personal_phone','personal_cellphone'],'expanded':False}
                        ),
                     ]

# solving their relationship
class GroupModelView(ModelView):
    datamodel = SQLAInterface(ContactGroup)
    related_views = [ContactModelView]



# add into the database
db.create_all()
appbuilder.add_view(GroupModelView,
                    "List Groups",
                    icon = "fa-address-book-o",
                    category = "Contacts",
                    category_icon = "fa-envelope")
appbuilder.add_view(ContactModelView,
                    "List Contacts",
                    icon = "fa-address-card-o",
                    category = "Contacts")



class CollegeView(ModelView):
    datamodel = SQLAInterface(College)
class MajorView(ModelView):
    datamodel = SQLAInterface(Major)
class TeacherView(ModelView):
    datamodel = SQLAInterface(Teacher)
class StudentView(ModelView):
    datamodel = SQLAInterface(Student)


# create all the app builder view
db.create_all()

# add into the sub title
appbuilder.add_view(CollegeView, "College", icon="gear", category='School Manage')
appbuilder.add_view(DegreeView, "Major", icon="gear", category='School Manage')
appbuilder.add_view(LecturerView, "LecturerView", icon="gear",category='School Manage')
appbuilder.add_view(StudentView, "Student", icon="gear",category='School Manage')

"""
    Application wide 404 error handler
"""
@appbuilder.app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', base_template=appbuilder.base_template, appbuilder=appbuilder), 404

db.create_all()


