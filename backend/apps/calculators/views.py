from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Calculator
from .serializers import CalculatorSerializer
from .services import (
    calculate_gas_cutting,
    calculate_gas_flow,
    calculate_heat_input,
    calculate_shielding_gas,
    calculate_welding_cost,
    calculate_welding_parameters,
)


class CalculatorListView(generics.ListAPIView):
    """GET /api/tools - List all calculators."""

    queryset = Calculator.objects.all()
    serializer_class = CalculatorSerializer


class HeatInputCalculateView(APIView):
    """POST /api/calculate/heat-input - Calculate heat input."""

    def post(self, request: Request) -> Response:
        voltage = request.data.get("voltage")
        current = request.data.get("current")
        travel_speed = request.data.get("travel_speed")
        if voltage is None or current is None or travel_speed is None:
            return Response(
                {"error": "Required: voltage, current, travel_speed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = calculate_heat_input(
                float(voltage), float(current), float(travel_speed)
            )
            return Response(result)
        except (ValueError, TypeError) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GasFlowCalculateView(APIView):
    """POST /api/calculate/gas-flow - Calculate gas flow consumption."""

    def post(self, request: Request) -> Response:
        flow_rate = request.data.get("flow_rate")
        welding_time_min = request.data.get("welding_time_min")
        cylinder_volume_l = request.data.get("cylinder_volume_l")
        if flow_rate is None or welding_time_min is None or cylinder_volume_l is None:
            return Response(
                {"error": "Required: flow_rate, welding_time_min, cylinder_volume_l"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = calculate_gas_flow(
                float(flow_rate), float(welding_time_min), float(cylinder_volume_l)
            )
            return Response(result)
        except (ValueError, TypeError) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ShieldingGasCalculateView(APIView):
    """POST /api/calculate/shielding-gas - Get shielding gas recommendations."""

    def post(self, request: Request) -> Response:
        wire_diameter_mm = request.data.get("wire_diameter_mm", 1.2)
        material = request.data.get("material", "steel")
        process = request.data.get("process", "MIG/MAG")
        try:
            result = calculate_shielding_gas(
                float(wire_diameter_mm), str(material), str(process)
            )
            return Response(result)
        except (ValueError, TypeError) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GasCuttingCalculateView(APIView):
    """POST /api/calculate/gas-cutting - Gas cutting parameters."""

    def post(self, request: Request) -> Response:
        plate_thickness_mm = request.data.get("plate_thickness_mm")
        gas_type = request.data.get("gas_type", "acetylene")
        cutting_speed_m_min = request.data.get("cutting_speed_m_min")
        if plate_thickness_mm is None:
            return Response(
                {"error": "Required: plate_thickness_mm"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = calculate_gas_cutting(
                float(plate_thickness_mm), str(gas_type), cutting_speed_m_min
            )
            return Response(result)
        except (ValueError, TypeError) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class WeldingCostCalculateView(APIView):
    """POST /api/calculate/welding-cost - Welding cost calculation."""

    def post(self, request: Request) -> Response:
        required = [
            "wire_price_per_kg",
            "gas_price_per_cylinder",
            "cylinder_volume_l",
            "deposition_rate_kg_h",
            "welding_time_h",
        ]
        data = {k: request.data.get(k) for k in required}
        if any(v is None for v in data.values()):
            return Response(
                {"error": f"Required: {', '.join(required)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = calculate_welding_cost(**{k: float(v) for k, v in data.items()})
            return Response(result)
        except (ValueError, TypeError) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class WeldingParametersCalculateView(APIView):
    """POST /api/calculate/welding-parameters - Welding parameters recommendations."""

    def post(self, request: Request) -> Response:
        plate_thickness_mm = request.data.get("plate_thickness_mm")
        joint_type = request.data.get("joint_type", "butt")
        wire_diameter_mm = request.data.get("wire_diameter_mm", 1.2)
        if plate_thickness_mm is None:
            return Response(
                {"error": "Required: plate_thickness_mm"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = calculate_welding_parameters(
                float(plate_thickness_mm), str(joint_type), float(wire_diameter_mm)
            )
            return Response(result)
        except (ValueError, TypeError) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
