
from werkzeug.exceptions import NotFound


class ObjectNotFound(NotFound):
    def __init__(self):
        super().__init__()
        self.message = "The object was not found."
