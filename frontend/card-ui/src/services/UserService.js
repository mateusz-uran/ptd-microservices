import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8181/api/user",
    headers: {
        "Content-type": "application/json"
    }
});

const getUserByUsername = username => {
    return http.get({ params: { username: username } })
};

const getUser = username => {
    return http.get("/get/" + username);
}

const UserService = {
    getUserByUsername,
    getUser
};

export default UserService;