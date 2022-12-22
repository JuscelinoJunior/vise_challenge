from sqlalchemy import Column, Integer, Text

from sqlalchemy.ext.declarative import declarative_base


class User(declarative_base()):
    __tablename__ = "pessoas"
    __friendly_class_name__ = "User"

    id = Column("id_pessoa", Integer, primary_key=True, nullable=False)
    nome = Column(Text, nullable=False)
    rg = Column(Text, nullable=False)
    cpf = Column(Text, nullable=False)
    data_nascimento = Column(Text, nullable=False)
    data_admissao = Column(Text, nullable=False)
