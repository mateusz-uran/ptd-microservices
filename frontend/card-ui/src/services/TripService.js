import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/trip",
    headers: {
        "Content-type": "application/json"
    }
});

const create = (id, trips) => {
    return http.post("/", trips, { params: { id: id } });
}

const TripService = {
    create
};

export default TripService;