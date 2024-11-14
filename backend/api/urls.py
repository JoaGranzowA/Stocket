from django.urls import path
from . import views
from .views import PedidosProveedorView, RegisterView, LoginView, SalesDataView, TopProductsView, UserProfileView, LogoutView, ProductosListView, ProductoDetailView, ProductosDisponiblesView, RealizarCompraView, HistorialComprasView, UpdateProfileView, UpdateProfileView, MensajesView, EmpleadosListView, EnviarMensajeView, EmployeesListView, ProveedorProfileView, ProductosMasCompradosView, ProductosDeProveedoresHabitualesView, ActualizarStockView, StockDisponibleView, ClientesBajoStockView, StockAgrupadoView, ProductoDetailViewParaCliente,CrearCalificacionProveedorView ,PromedioCalificacionProveedorView, VerificarCompraProveedorView, MonthlyExpenseView, SupplierPurchaseAnalysisView, PedidoDetailView, PedidoListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # URLs para manejar productos
    path('productos/', ProductosListView.as_view(), name='productos_list'),
    path('productos/<int:id>/', ProductoDetailView.as_view(), name='producto_detail'),
    path('productos-disponibles/', ProductosDisponiblesView.as_view(), name='productos_disponibles'),
    path('producto/<int:id>/', ProductoDetailViewParaCliente.as_view(), name='producto_detail_cliente'),

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
    path('stock-agrupado/', StockAgrupadoView.as_view(), name='stock-agrupado'),

    path('proveedor/<int:proveedor_id>/calificar/', CrearCalificacionProveedorView.as_view(), name='calificar_proveedor'),
    path('proveedor/<int:proveedor_id>/promedio-calificacion/', PromedioCalificacionProveedorView.as_view(), name='promedio_calificacion_proveedor'),
    path('compras/proveedor/<int:id>/verificar/', VerificarCompraProveedorView.as_view(), name='verificar_compra_proveedor'),

    path('monthly-expenses/', MonthlyExpenseView.as_view(), name='monthly_expenses'),
    path('supplier-purchase-analysis/', SupplierPurchaseAnalysisView.as_view(), name='supplier_purchase_analysis'),

    path('pedido/', PedidoListView.as_view(), name='lista_pedidos'),
    path('pedidos/<int:pk>/', PedidoDetailView.as_view(), name='detalle_pedido'),

    path('pedidos-proveedor/', PedidosProveedorView.as_view(), name='pedidos_proveedor'),
    path('pedidos-proveedor/<int:pk>/', PedidosProveedorView.as_view(), name='pedido_proveedor_update'),

    path('sales-data/', SalesDataView.as_view(), name='sales_data'),
    path('top-products/', TopProductsView.as_view(), name='top_products'),

]
