from django.urls import path

from .views import (
    register_user,
    login_user,
    forgot_password,
    reset_password,
    get_profile,
    update_profile,
    change_password,
    update_profile_photo
)

urlpatterns = [
    path(
        "register/",
        register_user,
        name="register"
    ),

    path(
        "login/",
        login_user,
        name="login"
    ),

    path(
        "forgot-password/", 
        forgot_password, 
        name="forgot_password"
    ),

    path(
        "reset-password/", 
        reset_password, 
        name="reset_password"
    ),
    
    path(
        "profile/",
        get_profile,
        name="profile"
    ),

    path(
        "profile/update/",
        update_profile,
        name="update_profile"
    ),

    path(
        "profile/change-password/",
        change_password,
        name="change_password"
    ),

    path(
        "profile/photo/",
        update_profile_photo,
        name="update_profile_photo"
    ),
]