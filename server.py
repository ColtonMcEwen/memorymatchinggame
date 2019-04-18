import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from http import cookies
from urllib.parse import parse_qs
from memorygame_db import MemoryGameDB
from passlib.hash import bcrypt
from session_store import SessionStore

gSessionStore = SessionStore()

class MyRequestHandler(BaseHTTPRequestHandler):

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_cookie()
        BaseHTTPRequestHandler.end_headers(self)

    def load_cookie(self):
        if "Cookie" in self.headers:
            self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
        else:
            self.cookie = cookies.SimpleCookie()
    
    def send_cookie(self):
        for morsel in self.cookie.values():
            self.send_header("Set-Cookie", morsel.OutputString())

    def load_session(self):
        self.load_cookie()
        if "sessionId" in self.cookie:
            # session ID found in the cookie
            sessionId = self.cookie["sessionId"].value
            self.session = gSessionStore.getSessionData(sessionId)
            if self.session == None:
                # session ID no longer found in the session store
                # create a brand new session ID
                sessionId = gSessionStore.createSession()
                self.session = gSessionStore.getSessionData(sessionId)
                self.cookie["sessionId"] = sessionId
        else:
            # no session ID found in the cookie
            # create a brand new session ID
            sessionId = gSessionStore.createSession()
            self.session = gSessionStore.getSessionData(sessionId)
            self.cookie["sessionId"] = sessionId

    def handleMemoryList(self, path):
        if self.isLoggedIn():
            if self.path == "/quotes":
                self.send_response(200)
                # all headers go here:
                self.send_header("Content-type", "application/json")
                self.end_headers()

                db = MemoryGameDB()
                memorygame = db.getAllMemory()
                print("user_quote goes here")
                self.wfile.write(bytes(json.dumps(memorygame), "utf-8"))
        else:
            self.handleUnauthorized()

    def handleMemoryCreate(self):
        if self.isLoggedIn():
            length = self.headers["Content-length"]
            body = self.rfile.read(int(length)).decode("utf-8")
            print("the text body:", body)
            parsed_body = parse_qs(body)
            print("the parsed body:", parsed_body)

            # save the quote
            name = parsed_body["name"][0]
            quote = parsed_body["quote"][0]
            score = parsed_body["score"][0]
            # send these values to the DB
            db = MemoryGameDB()
            db.createMemory(name, quote, score)

            self.send_response(201)
            self.end_headers()
        else:
            self.handleUnauthorized()

    def handleMemoryRetrieve(self, id):
        if self.isLoggedIn():
            db = MemoryGameDB()
            memorygame = db.getMemory(id)

            if memorygame == None:
                self.handleNotFound()
            else:
                self.send_response(200)
                # all headers go here:
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(bytes(json.dumps(memorygame), "utf-8"))
        else:
            self.handleUnauthorized()

    def handleMemoryDelete(self, id):
        if self.isLoggedIn():
            db = MemoryGameDB()
            memorygame = db.getMemory(id)

            if memorygame == None:
                self.handleNotFound()
            else:
                db.deleteMemory(id)
                self.send_response(200)
                # all headers go here:
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(bytes(json.dumps(memorygame), "utf-8"))
        else:
            self.handleUnauthorized()

    def handleMemoryUpdate(self, id):
        if self.isLoggedIn():
            length = self.headers["Content-length"]
            body = self.rfile.read(int(length)).decode("utf-8")
            print("updated text body:", body)
            parsed_body = parse_qs(body)
            print("updated parsed body:", parsed_body)

            # save the quote
            quote = parsed_body["quote"][0]
            # send these values to the DB
            db = MemoryGameDB()
            memorygame = db.getMemory(id)

            if memorygame == None:
                self.handleNotFound()
            else:
                db.updateMemory(quote, id)
                self.send_response(200)
                # all headers go here:
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(bytes(json.dumps(memorygame), "utf-8"))
        else:
            self.handleUnauthorized()

    def handleSessionCreate(self):
        length = self.headers["Content-length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        parsed_body = parse_qs(body)

        #save the restaurant!
        email = parsed_body["email"][0]
        password = parsed_body["password"][0]

        #send these values to the DB!
        db = MemoryGameDB()
        user = db.getUserByEmail(email)

        if user == None:
            self.send_response(401)
            self.end_headers()
        else:
            if bcrypt.verify(password, user["password"]):
                # remember the user id in the session
                self.session["userId"] = user["id"]
                self.send_response(201)
                self.end_headers()
            else:
                self.send_response(401)
                self.end_headers()

    def isLoggedIn(self):
        if "userId" in self.session:
            return True
        else:
            return False

    def handleUserCreate(self):
        length = self.headers["Content-length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        print("the text body:", body)
        parsed_body = parse_qs(body)
        print("the parsed body:", parsed_body)

        # save the user
        fname = parsed_body["fname"][0]
        lname = parsed_body["lname"][0]
        email = parsed_body["email"][0]
        password = parsed_body["password"][0]

        encrypted_password = bcrypt.hash(password)

        # send these values to the DB
        db = MemoryGameDB()
        if db.getUserByEmail(email):
            self.send_response(422)
            self.end_headers()
        else:
            db.createUser(fname, lname, email, encrypted_password)
            self.send_response(201)
            self.end_headers()

    def handleNotFound(self):
        self.send_response(404)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(bytes("Page Not Found 404", "utf-8"))

    def handleUnauthorized(self):
        self.send_response(401)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(bytes("Unauthorized Error 401", "utf-8"))

    def do_OPTIONS(self):
        self.load_session()
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-type")
        self.end_headers()
        
    def do_GET(self):
        self.load_session()
        # parse the path to find the collection and identifier
        parts = self.path.split('/')[1:]
        collection = parts[0]
        if len(parts) > 1:
            id = parts[1]
        else:
            id = None

        if collection == "quotes":
            if id == None:
                self.handleMemoryList(collection)
            else:
                self.handleMemoryRetrieve(id)
        else:
            self.handleNotFound()
     
    def do_POST(self):
        self.load_session()
        if self.path == "/quotes":
            self.handleMemoryCreate()
        elif self.path == "/users":
            self.handleUserCreate()
        elif self.path == "/sessions":
            self.handleSessionCreate()
        else:
            self.handleNotFound()

    def do_DELETE(self):
        self.load_session()
        # parse the path to find the collection and identifier
        parts = self.path.split('/')[1:]
        collection = parts[0]
        if len(parts) > 1:
            id = parts[1]
        else:
            id = None

        if collection == "quotes":
            if id == None:
                self.handleMemoryList(collection)
            else:
                self.handleMemoryDelete(id)
        else:
            self.handleNotFound()

    def do_PUT(self):
        self.load_session()
        # parse the path to find the collection and identifier
        parts = self.path.split('/')[1:]
        collection = parts[0]
        if len(parts) > 1:
            id = parts[1]
        else:
            id = None

        if collection == "quotes":
            if id == None:
                self.handleMemoryList(collection)
            else:
                self.handleMemoryUpdate(id)
        else:
            self.handleNotFound()

def run():
    db = MemoryGameDB()
    db.createMemoryGameTable()
    db.createUserTable()
    db = None # disconnect

    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])

    listen = ("0.0.0.0", port)
    server = HTTPServer(listen, MyRequestHandler)

    print("Server listening on", "{}:{}".format(*listen))
    server.serve_forever()

run()
