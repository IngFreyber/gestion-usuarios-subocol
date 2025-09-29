import json

def lambda_handler(event, context):
    """
    Simula una API de usuarios como si fuera JSONPlaceholder.
    Puedes pasar un parámetro "city" o "id" en el evento.
    """

    users = [
        {"id": 1, "name": "John Doe", "email": "john@test.com", "city": "Bogotá"},
        {"id": 2, "name": "Jane Smith", "email": "jane@test.com", "city": "Medellín"},
        {"id": 3, "name": "Carlos Pérez", "email": "carlos@test.com", "city": "Cali"}
    ]

    # si el cliente pide por id
    if "id" in event:
        user = next((u for u in users if u["id"] == int(event["id"])), None)
        return {
            "statusCode": 200 if user else 404,
            "body": json.dumps(user if user else {"message": "User not found"})
        }

    # si el cliente pide por ciudad
    if "city" in event:
        city = event["city"].lower()
        filtered = [u for u in users if u["city"].lower() == city]
        return {
            "statusCode": 200,
            "body": json.dumps(filtered)
        }

    # caso por defecto: devolver todos
    return {
        "statusCode": 200,
        "body": json.dumps(users)
    }

# código para permitir ejecutar como script y probar eventos
if __name__ == "__main__":
    print("Prueba - todos")
    print(lambda_handler({}, None))
    print("\nPrueba - id=2")
    print(lambda_handler({"id": 2}, None))
    print("\nPrueba - city=Cali")
    print(lambda_handler({"city": "Cali"}, None))
