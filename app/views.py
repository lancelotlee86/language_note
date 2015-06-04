from flask import Flask, jsonify, render_template,flash,redirect,session,url_for,request,g
from app import app
import pymysql
import datetime

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/entry_submit')
def entry_submit():
    """
    json api
    接收词条数据，添加到数据库，返回 True or False
    """
    # a = request.args.get('a', 0, type=int)
    original = request.args.get('original')
    translation = request.args.get('translation')
    timestamp = str(datetime.datetime.now())
    status = entry_add(original=original, translation=translation, timestamp=timestamp) # 成功则返回 True
    return jsonify(result = status)

@app.route('/entries_get')
def entries_get():
    """
    json api
    返回所有的词条数据
    """
    # eg: data = [{'a':'A','b':'B'},{'c':'C','d':'D'}]
    # data[0] 为第一条数据，data[1] 为第二条数据。他们在一个 list 中。
    data = get_all_entries()
    return jsonify(entries = data)

@app.route('/entry_delete')
def entry_delete():
    """
    json api
    从request中接收词条 original 的值，并在数据库中删除对应的一行
    """
    original = request.args.get('original')
    connection = pymysql.connect(
        host='localhost',
        user='root',
        passwd='lishenzhi1214',
        db='lang_note',
        port=3306,
        charset='utf8',
        cursorclass = pymysql.cursors.DictCursor)
    sql_delete = "DELETE FROM entry WHERE original = %s"
    with connection.cursor() as cursor:
        result = cursor.execute(sql_delete, (original))
        connection.commit()
    if result == 0:
        return jsonify(result = False)
    else:
        return jsonify(result = True)

@app.route('/entry_update')
def entry_update():
    original = request.args.get('original')
    original_updated = request.args.get('original_updated')
    translation_updated = request.args.get('translation_updated')
    connection = pymysql.connect(
        host='localhost',
        user='root',
        passwd='lishenzhi1214',
        db='lang_note',
        port=3306,
        charset='utf8',
        cursorclass = pymysql.cursors.DictCursor)
    sql_delete = "UPDATE entry SET original = %s, translation = %s WHERE original = %s"
    with connection.cursor() as cursor:
        result = cursor.execute(sql_delete, (original_updated, translation_updated, original))
        connection.commit()
    if result == 0:
        return jsonify(result = False)
    else:
        return jsonify(result = True)

@app.route('/entry_get_by_original')
def entry_get_by_original():
    original = request.args.get('original')
    connection = pymysql.connect(
        host='localhost',
        user='root',
        passwd='lishenzhi1214',
        db='lang_note',
        port=3306,
        charset='utf8',
        cursorclass = pymysql.cursors.DictCursor)
    sql_get_by_original = "SELECT * FROM `entry` WHERE `original` = %s"
    with connection.cursor() as cursor:
        result = cursor.execute(sql_get_by_original, (original))
        connection.commit()
        data = cursor.fetchall()
    if result:
        return jsonify(entries = data)
    else:
        return False


def entry_add(original, translation, timestamp):
    """
    添加成功则返回 True，失败则返回 False
    """
    connection = pymysql.connect(
        host='localhost',
        user='root',
        passwd='lishenzhi1214',
        db='lang_note',
        port=3306,
        charset='utf8',
        cursorclass = pymysql.cursors.DictCursor)
    sql_insert = "INSERT INTO entry (`original`, `type`, `translation`, `note`, `timestamp`) VALUES (%s, 'word', %s, 'note1', %s)"
    d = datetime.datetime.now()
    with connection.cursor() as cursor:
        result = cursor.execute(sql_insert, (original, translation, timestamp))
        connection.commit()
    if result == 1:
        return True
    return False


def get_all_entries():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        passwd='lishenzhi1214',
        db='lang_note',
        port=3306,
        charset='utf8',
        cursorclass = pymysql.cursors.DictCursor)
    sql_select = "SELECT * FROM `entry`"
    with connection.cursor() as cursor:
        cursor.execute(sql_select)
        data = cursor.fetchall()
    return data
