from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'phone', 'password', 'image']
        extra_kwargs = {'password': {'write_only': True}}

    # 🔥 USERNAME CHECK
    def validate_username(self, value):
        if CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists ❌")
        return value

    # 🔥 EMAIL CHECK
    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists ❌")
        return value

    # 🔥 PHONE CHECK
    def validate_phone(self, value):
        if CustomUser.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone already exists ❌")
        return value

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user