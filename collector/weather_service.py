import requests

class WeatherService:
    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude

    def fetch_weather(self):
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={self.latitude}&longitude={self.longitude}&current_weather=true"
        )

        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"Erro ao buscar dados ({response.status_code})")

        data = response.json()
        weather = data.get("current_weather", {})

        return {
            "temperature": weather.get("temperature"),
            "windspeed": weather.get("windspeed"),
            "winddirection": weather.get("winddirection"),
            "weathercode": weather.get("weathercode"),
            "time": weather.get("time"),
        }
