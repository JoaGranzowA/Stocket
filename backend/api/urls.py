from django.urls import path
from . import views
from .views import RegisterView, LoginView, UserProfileView, LogoutView, ProductosListView, ProductoDetailView, ProductosDisponiblesView, RealizarCompraView, HistorialComprasView, UpdateProfileView, UpdateProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # URLs para manejar productos
    path('productos/', ProductosListView.as_view(), name='productos_list'),
    path('productos/<int:id>/', ProductoDetailView.as_view(), name='producto_detail'),
    path('productos-disponibles/', ProductosDisponiblesView.as_view(), name='productos_disponibles'),

    # URLs para manejar compras
    path('compras/', RealizarCompraView.as_view(), name='realizar_compra'),
    path('pedidos/', HistorialComprasView.as_view(), name='historial_compras'),

    # URLs para manejar perfiles
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    
]
