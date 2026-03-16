"""
Расчётные сервисы для инженерных калькуляторов сварки.
"""

from typing import Any


def calculate_heat_input(
    voltage: float,
    current: float,
    travel_speed: float,
) -> dict[str, Any]:
    """
    Расчёт тепловложения при сварке.
    Q = (U × I × 60) / (1000 × v) [кДж/мм]
    где: U - напряжение (В), I - ток (А), v - скорость сварки (мм/мин)
    """
    if travel_speed <= 0:
        return {"error": "Скорость сварки должна быть больше 0"}
    heat_input = (voltage * current * 60) / (1000 * travel_speed)
    return {
        "heat_input_kj_mm": round(heat_input, 2),
        "voltage": voltage,
        "current": current,
        "travel_speed": travel_speed,
    }


def calculate_gas_flow(
    flow_rate: float,
    welding_time_min: float,
    cylinder_volume_l: float,
) -> dict[str, Any]:
    """
    Расчёт расхода защитного газа и времени работы баллона.
    consumption = flow_rate * welding_time [л]
    cylinder_duration = cylinder_volume / flow_rate [мин]
    """
    if flow_rate <= 0:
        return {"error": "Расход газа должен быть больше 0"}
    consumption = flow_rate * welding_time_min
    cylinder_duration_min = cylinder_volume_l / flow_rate if flow_rate > 0 else 0
    return {
        "consumption_l": round(consumption, 2),
        "cylinder_duration_min": round(cylinder_duration_min, 2),
        "flow_rate": flow_rate,
        "welding_time_min": welding_time_min,
        "cylinder_volume_l": cylinder_volume_l,
    }


def calculate_shielding_gas(
    wire_diameter_mm: float,
    material: str,
    process: str,
) -> dict[str, Any]:
    """
    Рекомендуемый расход защитного газа по диаметру проволоки и процессу.
    Упрощённые рекомендации для MIG/MAG.
    """
    # Базовые рекомендации: л/мин для разных диаметров (0.8, 1.0, 1.2, 1.6 мм)
    recommendations = {
        "0.8": {"min": 12, "max": 18, "typical": 15},
        "1.0": {"min": 14, "max": 20, "typical": 17},
        "1.2": {"min": 16, "max": 24, "typical": 20},
        "1.6": {"min": 18, "max": 28, "typical": 22},
    }
    key = str(wire_diameter_mm) if str(wire_diameter_mm) in recommendations else "1.2"
    rec = recommendations.get(key, recommendations["1.2"])
    return {
        "flow_rate_min": rec["min"],
        "flow_rate_max": rec["max"],
        "flow_rate_typical": rec["typical"],
        "wire_diameter_mm": wire_diameter_mm,
        "material": material,
        "process": process,
    }


def calculate_gas_cutting(
    plate_thickness_mm: float,
    gas_type: str,
    cutting_speed_m_min: float | None = None,
) -> dict[str, Any]:
    """
    Параметры газовой резки: давление кислорода, расход ацетилена/пропана.
    Упрощённые рекомендации по толщине листа.
    """
    # Рекомендации: толщина -> (O2 давление бар, расход топлива л/ч)
    thickness_ranges = [
        (5, 2.0, 400),
        (10, 2.5, 500),
        (20, 3.0, 600),
        (30, 3.5, 700),
        (50, 4.0, 800),
        (100, 5.0, 1000),
    ]
    o2_pressure = 2.0
    fuel_flow = 400
    for th, press, flow in thickness_ranges:
        if plate_thickness_mm <= th:
            o2_pressure = press
            fuel_flow = flow
            break
    else:
        o2_pressure = 5.5
        fuel_flow = 1200

    return {
        "plate_thickness_mm": plate_thickness_mm,
        "gas_type": gas_type,
        "o2_pressure_bar": o2_pressure,
        "fuel_flow_l_h": fuel_flow,
        "cutting_speed_m_min": cutting_speed_m_min,
    }


def calculate_welding_cost(
    wire_price_per_kg: float,
    gas_price_per_cylinder: float,
    cylinder_volume_l: float,
    deposition_rate_kg_h: float,
    welding_time_h: float,
) -> dict[str, Any]:
    """
    Расчёт стоимости сварки: расход проволоки, газа, общая стоимость.
    """
    wire_consumption_kg = deposition_rate_kg_h * welding_time_h
    # Примерный расход газа: ~15-20 л/мин при MIG -> ~1000 л/ч
    gas_flow_l_min = 18
    gas_consumption_l = gas_flow_l_min * 60 * welding_time_h
    cylinders_used = (
        gas_consumption_l / cylinder_volume_l if cylinder_volume_l > 0 else 0
    )
    wire_cost = wire_consumption_kg * wire_price_per_kg
    gas_cost = cylinders_used * gas_price_per_cylinder
    total_cost = wire_cost + gas_cost

    return {
        "wire_consumption_kg": round(wire_consumption_kg, 3),
        "gas_consumption_l": round(gas_consumption_l, 2),
        "cylinders_used": round(cylinders_used, 2),
        "wire_cost": round(wire_cost, 2),
        "gas_cost": round(gas_cost, 2),
        "total_cost": round(total_cost, 2),
    }


def calculate_welding_parameters(
    plate_thickness_mm: float,
    joint_type: str,
    wire_diameter_mm: float = 1.2,
) -> dict[str, Any]:
    """
    Рекомендуемые параметры сварки по толщине и типу соединения.
    Упрощённые рекомендации для MIG/MAG.
    """
    # Базовые рекомендации: толщина -> (ток А, напряжение В, скорость мм/мин)
    base_params = {
        (1.0, 3.0): (80, 18, 400),
        (3.0, 6.0): (120, 20, 350),
        (6.0, 10.0): (180, 22, 300),
        (10.0, 15.0): (220, 24, 250),
        (15.0, 25.0): (280, 26, 200),
    }
    current_a, voltage_v, speed = 120, 20, 350
    for (t_min, t_max), (c, v, s) in base_params.items():
        if t_min <= plate_thickness_mm < t_max:
            current_a, voltage_v, speed = c, v, s
            break

    return {
        "plate_thickness_mm": plate_thickness_mm,
        "joint_type": joint_type,
        "wire_diameter_mm": wire_diameter_mm,
        "current_a": current_a,
        "voltage_v": voltage_v,
        "travel_speed_mm_min": speed,
    }
