package io.github.mateuszuran.controller;

import io.github.mateuszuran.dto.TrailerDTO;
import io.github.mateuszuran.dto.VehicleDTO;
import io.github.mateuszuran.dto.VehicleImageDTO;
import io.github.mateuszuran.dto.VehicleResponseDTO;
import io.github.mateuszuran.dto.request.TrailerRequest;
import io.github.mateuszuran.dto.request.VehicleImageRequest;
import io.github.mateuszuran.dto.request.VehicleRequest;
import io.github.mateuszuran.dto.response.VehiclePDFResponse;
import io.github.mateuszuran.dto.response.VehicleResponse;
import io.github.mateuszuran.model.Vehicle;
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

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<VehicleResponse> addVehicle(@RequestBody VehicleDTO vehicleDTO, @PathVariable Long userId) {
        return ResponseEntity.ok()
                .body(service.addVehicleInformation(vehicleDTO, userId));
    }

    @PostMapping("/trailer/{vehicleId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<TrailerDTO> addTrailer(@RequestBody TrailerDTO trailerDTO, @PathVariable String vehicleId) {
        return ResponseEntity.ok()
                .body(trailerService.addTrailerToVehicle(trailerDTO, vehicleId));
    }

    @PostMapping(value = "/image/{vehicleId}", consumes = {
            MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<VehicleImageDTO> addImage(
            @RequestPart("description") String vehicleImageRequest,
            @PathVariable String vehicleId,
            @RequestPart("image") MultipartFile file
    ) throws Exception {
        return ResponseEntity.ok()
                .body(vehicleImageService.addVehicleImage(vehicleImageRequest, vehicleId, file));
    }

    @GetMapping("/info/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<VehicleResponseDTO> retrieveInformation(@PathVariable Long userId) {
        return ResponseEntity.ok().body(service.retrieveVehicleInformation(userId));
    }

    @GetMapping(params = "userId")
    public ResponseEntity<VehiclePDFResponse> sendToPdfService(@RequestParam Long userId) {
        return ResponseEntity.ok().body(service.sendToPdf(userId));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteVehicle(@RequestParam String id) {
        service.delete(id);
        return ResponseEntity.ok().body(HttpStatus.NO_CONTENT);
    }
}
