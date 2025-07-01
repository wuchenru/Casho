import graphene
from graphene_django.debug import DjangoDebug
import graphql_jwt

from users.schema import Query as UserQuery, Mutation as UserMutation
from transactions.schema import Query as TransactionQuery, Mutation as TransactionMutation


class Query(UserQuery, TransactionQuery, graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='debug')


class Mutation(UserMutation, TransactionMutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation) 