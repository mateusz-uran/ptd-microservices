package io.github.mateuszuran.controller;

import io.github.mateuszuran.dto.request.TrailerRequest;
import io.github.mateuszuran.dto.request.VehicleImageRequest;
import io.github.mateuszuran.dto.request.VehicleRequest;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.service.TrailerService;
import io.github.mateuszuran.service.VehicleImageService;
import io.github.mateuszuran.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {
    private final VehicleService service;
    private final TrailerService trailerService;
    private final VehicleImageService vehicleImageService;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody VehicleRequest vehicleRequest) {
        service.addVehicle(vehicleRequest);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PostMapping(params = "trailer")
    public ResponseEntity<?> addTrailer(@RequestParam Long id, @RequestBody TrailerRequest trailerRequest) {
        trailerService.addTrailer(id, trailerRequest);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PostMapping(params = "image_info")
    public ResponseEntity<?> addImageInfo(@RequestParam Long id, @RequestBody VehicleImageRequest vehicleImageRequest) {
        vehicleImageService.addImageInformation(id, vehicleImageRequest);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updateVehicle(@RequestParam Long id, @RequestBody VehicleRequest vehicleRequest) {
        service.updateVehicle(id, vehicleRequest);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PutMapping(params = "trailer")
    public ResponseEntity<?> updateTrailer(@RequestParam Long id, @RequestBody TrailerRequest trailerRequest) {
        trailerService.updateTrailer(id, trailerRequest);
        return ResponseEntity.ok().body(HttpStatus.CREATED);
    }

    @PostMapping(path = "/upload",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadImageToPostByParam(@RequestParam Long id, @RequestParam MultipartFile file) throws Exception {
        vehicleImageService.uploadVehicleImage(id, file);
        return ResponseEntity.ok().body("Image uploaded");
    }

    @GetMapping(params = "userId")
    public ResponseEntity<VehiclePDFResponse> sendToPdfService(@RequestParam Long userId) {
        return ResponseEntity.ok().body(service.sendToPdf(userId));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteVehicle(@RequestParam Long id) {
        service.delete(id);
        return ResponseEntity.ok().body(HttpStatus.NO_CONTENT);
    }
}
