import os
import psycopg2
import psycopg2.extras
import urllib.parse

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class MemoryGameDB:

    def __init__(self):
        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

        self.connection = psycopg2.connect(
            cursor_factory=psycopg2.extras.RealDictCursor,
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

        self.cursor = self.connection.cursor()

    def __del__(self):
        #disconnect
        self.connection.close()

    def createMemoryGameTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS memorygame (id INTEGER PRIMARY KEY, name TEXT, quote TEXT, score INTEGER)")
        self.connection.commit()

    def createMemory(self, name, quote, score):
        sql = "INSERT INTO memorygame (name, quote, score) VALUES (%s, %s, %s)"
        self.cursor.execute(sql, [name, quote, score])
        self.connection.commit()
        return

    def getAllMemory(self):
        self.cursor.execute("SELECT * FROM memorygame")
        return self.cursor.fetchall()

    def getMemory(self, id):
        sql = "SELECT * FROM memorygame WHERE id = %s"
        self.cursor.execute(sql, [id]) # data must be a list
        return self.cursor.fetchone()

    def deleteMemory(self, id):
        sql = "DELETE FROM memorygame WHERE id = %s"
        self.cursor.execute(sql, [id]) # data must be a list
        self.connection.commit()
        return

    def updateMemory(self, quote, id):
        sql = "UPDATE memorygame SET quote = %s WHERE id = %s"
        self.cursor.execute(sql, [quote, id])
        self.connection.commit()
        return

    def createUserTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, fname TEXT, lname TEXT, email TEXT, password TEXT)")
        self.connection.commit()

    def createUser(self, fname, lname, email, password):
        sql = "INSERT INTO users (fname, lname, email, password) VALUES (%s, %s, %s, %s)"
        self.cursor.execute(sql, [fname, lname, email, password])
        self.connection.commit()
        return

    def getUserByEmail(self, email):
        sql = "SELECT * FROM users WHERE email = %s"
        self.cursor.execute(sql, [email])
        return self.cursor.fetchone()
