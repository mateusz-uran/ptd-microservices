import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8181/api/fuel",
    headers: {
        "Content-type": "application/json"
    }
});

const create = (id, fuel) => {
    return http.post("/", fuel, { params: { id: id } });
}

const deleteFuel = (id) => {
return http.delete("/", { params: { id: id } })
}


const FuelService = {
    create,
    deleteFuel
};

export default FuelService;