from typing import Any, Dict

from flask import Request

from persistency.user_model import User


def map_create_user_request_to_model(request: Request) -> User:
    request_data: Dict[str, Any] = request.get_json()
    user_model: User = User(
        nome=request_data["name"],
        cpf=request_data["cpf"],
        rg=request_data["rg"],
        data_nascimento=request_data["birth"],
        data_admissao=request_data["admission"]
    )
    return user_model


def map_edit_user_request_to_model(request: Request, user_model) -> User:
    request_data: Dict[str, Any] = request.get_json()

    if "name" in request_data:
        user_model.nome = request_data["name"]
    if "rg" in request_data:
        user_model.rg = request_data["rg"]
    if "cpf" in request_data:
        user_model.cpf = request_data["cpf"]
    if "admission" in request_data:
        user_model.data_admissao = request_data["admission"]
    if "birth" in request_data:
        user_model.data_nascimento = request_data["birth"]

    return user_model


def map_user_model_to_response(user_model: User) -> Dict[str, Any]:
    return {
        "id": user_model.id,
        "name": user_model.nome,
        "rg": user_model.rg,
        "cpf": user_model.cpf,
        "birth": user_model.data_nascimento,
        "admission": user_model.data_admissao
    }
