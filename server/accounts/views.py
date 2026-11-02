from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import RegisterSerializer, UserSerializer, EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=201)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def admin_stats(request):
    from listings.models import Listing
    from swaps.models import SwapRequest

    return Response({
        "users": User.objects.count(),
        "listings": Listing.objects.count(),
        "swap_requests": SwapRequest.objects.count(),
        "completed_swaps": SwapRequest.objects.filter(status=SwapRequest.Status.COMPLETED).count(),
        "recent_users": UserSerializer(User.objects.order_by("-date_joined")[:10], many=True).data,
    })
