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

const singleFuel = (id) => {
    return http.get("/", { params: { id: id } })
}

const editFuel = (id, fuel) => {
    return http.put("/", fuel, { params: { id: id } });
}

const deleteFuel = (id) => {
return http.delete("/", { params: { id: id } })
}


const FuelService = {
    create,
    singleFuel,
    editFuel,
    deleteFuel
};

export default FuelService;