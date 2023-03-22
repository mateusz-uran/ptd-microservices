import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/trip";

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
});

const createFixed = (id, trips) => {
    return http.post('/', trips, {
      params: { cardId: id }
    });
  }

const deleteManyTrips = (selectedTripId) => {
    return http.delete("/list", { data: selectedTripId });
}

const TripService = {
    createFixed,
    deleteManyTrips
};

export default TripService;