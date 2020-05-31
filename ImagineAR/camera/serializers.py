from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from camera.models import Template


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)


class TemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Template
        fields = '__all__'

    def create(self, validated_data):
        """
        Overwriting create method to add client and created by from backend.
        (Not a part of API)
        :param validated_data: Validated data from serializer.
        :return: Validated data with context of client and created by.
        """
        print(validated_data)
        # print(self.context['request'].__dict__)
        # print(self.context['request']['_data'].get('username'))
        # print(self.context['request']['_data']['username'])
        # print(self.context['request'].TokenUser)
        # validated_data['user'] = User.objects.get(
        #         id=self.context['request'].user.id)
        # user = User.objects.get(username=validated_data[])
        return super(TemplateSerializer, self).create(validated_data)


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')