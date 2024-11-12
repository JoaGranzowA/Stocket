from django.urls import path
from . import views
from .views import RegisterView, LoginView, UserProfileView, LogoutView, ProductosListView, ProductoDetailView, ProductosDisponiblesView, RealizarCompraView, HistorialComprasView, UpdateProfileView, UpdateProfileView, MensajesView, EmpleadosListView, EnviarMensajeView, EmployeesListView, ProveedorProfileView, ProductosMasCompradosView, ProductosDeProveedoresHabitualesView, ActualizarStockView, StockDisponibleView, ClientesBajoStockView

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

    # URLs para Chats
    path('chats/', MensajesView.as_view(), name='mensajes'),
    path('empleados/', EmpleadosListView.as_view(), name='empleados_list'),
    path('mensajes/enviar/', EnviarMensajeView.as_view(), name='enviar_mensaje'),

    # URLs para ver proveedores
    path('employees/', EmployeesListView.as_view(), name='employees_list'),
    path('proveedor/<int:id>/', ProveedorProfileView.as_view(), name='proveedor-profile'),
    
    path('recomendaciones/mas-comprados/', ProductosMasCompradosView.as_view(), name='productos-mas-comprados'),
    path('recomendaciones/proveedores-habituales/', ProductosDeProveedoresHabitualesView.as_view(), name='productos-proveedores-habituales'),

    path('stock-disponible/', StockDisponibleView.as_view(), name='stock_disponible'),
    path('actualizar-stock/<int:pk>/', ActualizarStockView.as_view(), name='actualizar_stock'),

    path('clientes-bajo-stock/', ClientesBajoStockView.as_view(), name='clientes-bajo-stock'),

]
