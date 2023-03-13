import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api/trip";

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
});

const create = (id, trips) => {
    return http.post(trips, { params: { cardId: id } });
}

const createFixed = (id, trips) => {
    return http.post('/', trips, {
      params: { cardId: id }
    });
  }

const retrieveSingle = (id) => {
    return http.get("/", { params: { id: id } });
}

const editTrip = (id, trip) => {
    return http.put("/", trip, { params: { id: id } });
}

const deleteTrip = (id) => {
    return http.delete("/", { params: { id: id } });
}

const deleteManyTrips = (selectedTripId) => {
    return http.delete("/list", { data: selectedTripId });
}

const TripService = {
    create,
    createFixed,
    retrieveSingle,
    editTrip,
    deleteTrip,
    deleteManyTrips
};

export default TripService;