import json
from subprocess import call

import shutil
from flask import Flask, request, Response, render_template
import socket
import fcntl
import struct

app = Flask(__name__)

pdf_changed = False


def get_ip_address(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,  # SIOCGIFADDR
        struct.pack('256s'.encode('utf-8'), ifname[:15].encode('utf-8'))
    )[20:24])

IP = "http://" + get_ip_address('eth0')


@app.route("/")
def home():
    lines = [line.strip("\n") for line in open("files/bare_conf.tex")]
    return render_template('home.html', data="\n".join(lines), ip=IP)


@app.route("/pdf")
def pdf():
    return render_template('pdf_window.html', ip=IP)


@app.route("/api/save_document", methods=['POST'])
def save_document():
    data = request.json["text"]
    with open("files/bare_conf.tex", "w") as document:
        document.write(str(data))
    call(["pdflatex", "bare_conf.tex"], cwd="files")
    shutil.move("files/bare_conf.pdf", "/var/www/html/assets/bare_conf.pdf")
    global pdf_changed
    pdf_changed = True
    return "", 201


@app.route("/api/pdf_changed", methods=["GET"])
def changed():
    global pdf_changed
    obj = json.dumps({"changed": pdf_changed})
    print(obj)
    pdf_changed = False
    return obj, 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=False)
