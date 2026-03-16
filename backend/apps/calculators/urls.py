from django.urls import path

from . import views

urlpatterns = [
    path("tools", views.CalculatorListView.as_view(), name="calculator-list"),
    path(
        "calculate/heat-input",
        views.HeatInputCalculateView.as_view(),
        name="calculate-heat-input",
    ),
    path(
        "calculate/gas-flow",
        views.GasFlowCalculateView.as_view(),
        name="calculate-gas-flow",
    ),
    path(
        "calculate/shielding-gas",
        views.ShieldingGasCalculateView.as_view(),
        name="calculate-shielding-gas",
    ),
    path(
        "calculate/gas-cutting",
        views.GasCuttingCalculateView.as_view(),
        name="calculate-gas-cutting",
    ),
    path(
        "calculate/welding-cost",
        views.WeldingCostCalculateView.as_view(),
        name="calculate-welding-cost",
    ),
    path(
        "calculate/welding-parameters",
        views.WeldingParametersCalculateView.as_view(),
        name="calculate-welding-parameters",
    ),
]
