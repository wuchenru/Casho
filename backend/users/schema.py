import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'avatar', 'created_at']


class RegisterInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    password_confirm = graphene.String(required=True)


class LoginInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    password = graphene.String(required=True)


class AuthPayload(graphene.ObjectType):
    user = graphene.Field(UserType)
    access_token = graphene.String()
    refresh_token = graphene.String()


class Register(graphene.Mutation):
    class Arguments:
        input = RegisterInput(required=True)

    Output = AuthPayload

    def mutate(self, info, input):
        if input.password != input.password_confirm:
            raise Exception("Passwords do not match")
        
        user = User.objects.create_user(
            username=input.username,
            email=input.email,
            password=input.password
        )
        
        refresh = RefreshToken.for_user(user)
        
        return AuthPayload(
            user=user,
            access_token=str(refresh.access_token),
            refresh_token=str(refresh)
        )


class Login(graphene.Mutation):
    class Arguments:
        input = LoginInput(required=True)

    Output = AuthPayload

    def mutate(self, info, input):
        user = authenticate(username=input.email, password=input.password)
        if not user:
            raise Exception("Invalid email or password")
        
        refresh = RefreshToken.for_user(user)
        
        return AuthPayload(
            user=user,
            access_token=str(refresh.access_token),
            refresh_token=str(refresh)
        )


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None

    def resolve_users(self, info):
        return User.objects.all()


class Mutation(graphene.ObjectType):
    register = Register.Field()
    login = Login.Field() 