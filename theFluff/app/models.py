from flask.ext.appbuilder import Model
from flask.ext.appbuilder.models.mixins import AuditMixin, FileColumn, ImageColumn
from sqlalchemy import Column, Integer, String, ForeignKey 
from sqlalchemy.orm import relationship
from flask import Markup, url_for, g
from sqlalchemy import Table, Column, Integer, String, ForeignKey, Date, Float, Text
from sqlalchemy.orm import relationship
from flask_appbuilder.models.decorators import renders
from flask_appbuilder.models.sqla.filters import FilterStartsWith, FilterEqualFunction



"""
Code belongs to flask framework 
You can use the extra Flask-AppBuilder fields and Mixin's
AuditMixin will add automatic timestamp of created and modified by who
this belongs to https://www.shiyanlou.com/courses/870/labs/3170/document 
this is a temp UI framework for mysql connection use
"""


'''
This defines several models which gives definition to different entities
'''
        



assoc_teacher_student = Table('teacher_student', Model.metadata,
                                      Column('id', Integer, primary_key=True),
                                      Column('teacher_id', Integer, ForeignKey('teacher.id')),
                                      Column('student_id', Integer, ForeignKey('student.id'))
)


# for contacting use

class ContactGroup(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique = True, nullable=False)

    def __repr__(self):
        return self.name

class Contact(Model):
    id = Column(Integer, primary_key=True)
    name =  Column(String(150), unique = True, nullable=False)
    address =  Column(String(564))
    birthday = Column(Date)
    personal_phone = Column(String(20))
    personal_cellphone = Column(String(20))
    contact_group_id = Column(Integer, ForeignKey('contact_group.id'))
    contact_group = relationship("ContactGroup")

    def __repr__(self):
        return self.name


# College
class College(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return self.name


#Degree
class Degree(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return self.name


#Teacher
class Lecturer(Model):
    id = Column(Integer, primary_key=True)
    work_num = Column(String(30), unique=True, nullable=False)  
    name = Column(String(50), nullable=False)
    college_id = Column(Integer, ForeignKey('college.id'), nullable=False) 
    college = relationship("College")
    tel_num = Column(String(30), unique=True, nullable=False)   
    birthday = Column(Date)
    def __repr__(self):
        return self.name


# Studnet
class Student(Model):
    id = Column(Integer, primary_key=True)
    stu_num = Column(String(30), unique=True, nullable=False)  # uni ID
    name = Column(String(50), nullable=False)
    college_id = Column(Integer, ForeignKey('college.id'), nullable=False)
    college = relationship("College")
    degree_id = Column(Integer, ForeignKey('degree.id'), nullable=False)
    degree = relationship("Degree")
    teachers = relationship('Teacher', secondary=assoc_teacher_student, backref='student')

    def __repr__(self):
        return self.name

