import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/pdf",
    headers: {
        "Content-type": "application/pdf"
    },
    responseType: "blob"
});

const getPdf = id => {
    return http.get('/', { params: { id: id } })
};

const PdfService = {
    getPdf
};

export default PdfService;