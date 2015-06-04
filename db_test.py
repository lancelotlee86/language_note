# -*- coding: utf-8 -*-

import pymysql
import datetime

connection = pymysql.connect(
    host='localhost',
    user='root',
    passwd='lishenzhi1214',
    db='lang_note',
    port=3306,
    charset='utf8',
    cursorclass = pymysql.cursors.DictCursor)

sql_select = "SELECT * FROM `entry`"
sql_insert = "INSERT INTO entry (`original`, `type`, `translation`, `note`, `timestamp`) VALUES ('word1', 'word', 'translat和ion1', 'note1', '2015-05-29 10:37:16.025368')"

d = datetime.datetime.now()

with connection.cursor() as cursor:
    cursor.execute(sql_insert)
    connection.commit()

with connection.cursor() as cursor:
    cursor.execute(sql_select)
    data = cursor.fetchall()
    print(data)
