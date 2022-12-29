import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/user",
    headers: {
        "Content-type": "application/json"
    }
});

const getUserByUsername = username => {
    return http.get('/', { params: { username: username } })
};

const UserService = {
    getUserByUsername
};

export default UserService;