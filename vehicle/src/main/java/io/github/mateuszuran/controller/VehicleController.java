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
    public ResponseEntity<VehicleDTO> addVehicle(@RequestBody VehicleDTO vehicleDTO, @PathVariable Long userId) {
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
            @RequestPart("description") VehicleImageDTO vehicleImageRequest,
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

    @PatchMapping("/truck/{vehicleId}")
    public ResponseEntity<VehicleDTO> updateVehicleInfo(@RequestBody VehicleDTO vehicleDTO, @PathVariable String vehicleId) {
        return ResponseEntity.ok(service.editVehicleInfo(vehicleDTO, vehicleId));
    }

    @PatchMapping("/trailer/{vehicleId}")
    public ResponseEntity<TrailerDTO> updateTrailerInfo(@RequestBody TrailerDTO trailerDTO, @PathVariable String vehicleId) {
        return ResponseEntity.ok(service.editVehicleInfo(trailerDTO, vehicleId));
    }

    @PatchMapping("/image-info/{vehicleId}")
    public ResponseEntity<VehicleImageDTO> updateVehicleImageInfo(@RequestBody VehicleImageDTO vehicleImageDTO, @PathVariable String vehicleId) {
        return ResponseEntity.ok(service.editVehicleInfo(vehicleImageDTO, vehicleId));
    }

    @PostMapping("/single-image/{vehicleId}")
    public ResponseEntity<VehicleImageDTO> sendOnlyFile(@RequestParam("file") MultipartFile file, @PathVariable String vehicleId) throws Exception {
        return ResponseEntity.ok(vehicleImageService.updateVehicleImage(vehicleId, file));
    }

    @DeleteMapping("/delete-image/{vehicleId}")
    public ResponseEntity<?> deleteVehicleImage(@PathVariable String vehicleId) {
        vehicleImageService.deleteVehicleImage(vehicleId);
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/delete/{vehicleId}")
    public ResponseEntity<?> deleteVehicle(@PathVariable String vehicleId) {
        service.delete(vehicleId);
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }
}
