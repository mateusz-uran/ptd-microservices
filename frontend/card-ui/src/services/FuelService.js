import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/fuel",
    headers: {
        "Content-type": "application/json"
    }
});

const create = (id, fuel) => {
    return http.post("/", fuel, { params: { id: id } });
}


const FuelService = {
    create
};

export default FuelService;