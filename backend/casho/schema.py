import graphene
from graphene_django.debug import DjangoDebug

from users.schema import Query as UserQuery, Mutation as UserMutation
from transactions.schema import Query as TransactionQuery, Mutation as TransactionMutation


class Query(UserQuery, TransactionQuery, graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='debug')


class Mutation(UserMutation, TransactionMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation) 