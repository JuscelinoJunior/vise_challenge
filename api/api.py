from typing import Dict, Any, Tuple, List

import connexion
from flask import jsonify, request, Response
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError 
from sqlalchemy.orm import Session

from exceptions.exception_handler import JSONExceptionHandler
from exceptions.exceptions import ObjectNotFound

from persistency.user_model import User
from mappers import map_user_model_to_response, map_create_user_request_to_model, map_edit_user_request_to_model
from persistency import db_engine


def create_user() -> Tuple[Response, int]:
    """
    Add a new user to the database.

    Add a new user defining the name, rg, cpf, birthdate and admission date.

    :return: a json object with the new user data, including the identifier, and the status code
    :rtype: Tuple
    """
    user_model: User = map_create_user_request_to_model(request)

    db_session: Session = Session(db_engine)

    try:
        db_session.add(user_model)
        db_session.commit()
        create_user_response = map_user_model_to_response(user_model)
        return jsonify(create_user_response), 201
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def update_user(user_id) -> Tuple[Response, int]:
    """
    Update a user on the database.

    Update one or more fields about a user on the database.
    """
    db_session: Session = Session(db_engine)

    try:
        user_model: User = db_session.query(User).filter(user_id == User.id).first()

        user_model: User = map_edit_user_request_to_model(request, user_model)

        db_session.add(user_model)
        db_session.commit()
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

    return jsonify({"description": "The user was updated successfully"}), 204


def delete_user(user_id) -> Tuple[Response, int]:
    """
    Delete a defined user by the identifier.

    :param user_id: identifier of the user to be deleted

    :return: a json object with a success message and the status code
    :rtype: Tuple

    :raises: ObjectNotFound: if the user identifier was not found in the database
    """
    db_session: Session = Session(db_engine)

    try:
        is_deleted: int = db_session.query(User).filter(user_id == User.id).delete()
        db_session.commit()
        if is_deleted == 0:
            raise ObjectNotFound()
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

    return jsonify({"description": "The user was deleted successfully"}), 204


def read_user(user_id) -> Response:
    """
    Retrieve a list with all the users from the database.

    :return: a json object with a list with the user data
    :rtype: Response
    """
    db_session: Session = Session(db_engine)

    try:
        user_model: User = db_session.query(User).filter(user_id == User.id).first()

        read_user_response: Dict[str, Any] = map_user_model_to_response(user_model)
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

    return jsonify(read_user_response)


def read_all_users() -> Response:
    """
    Retrieve a list with all the users from the database.

    :return: a json object with a list with the user data
    :rtype: Response
    """
    db_session: Session = Session(db_engine)

    read_all_users_response: List[Dict[str, Any]] = []

    try:
        user_models: List[User] = db_session.query(User).all()

        for user_model in user_models:
            read_user_response: Dict[str, Any] = map_user_model_to_response(user_model)
            read_all_users_response.append(read_user_response)
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

    return jsonify(read_all_users_response)


if __name__ == "__main__":
    app = connexion.FlaskApp(__name__, specification_dir='openapi_specifications/')
    webapp = app.app
    CORS(webapp)
    handler = JSONExceptionHandler(app)
    app.add_api("api.json")
    app.run(debug=True)
