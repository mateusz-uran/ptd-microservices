package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.request.VehicleImageRequest;
import io.github.mateuszuran.filestore.CloudinaryManager;
import io.github.mateuszuran.model.VehicleImage;
import io.github.mateuszuran.repository.VehicleImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Map;

import static org.apache.http.entity.ContentType.IMAGE_JPEG;
import static org.apache.http.entity.ContentType.IMAGE_PNG;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleImageService {
    private final VehicleImageRepository repository;
    private final VehicleService service;
    private final CloudinaryManager cloudinary;

    public void addImageInformation(Long id, VehicleImageRequest vehicleDto) {
        var vehicle = service.getVehicle(id);
        VehicleImage image = VehicleImage.builder()
                .name(vehicleDto.getName())
                .description(vehicleDto.getDescription())
                .vehicle(vehicle)
                .build();
        repository.save(image);
        service.updateVehicleWithImage(id, image);
    }

    public void uploadVehicleImage(final Long id, MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new FileUploadException();
        }
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType()).contains(file.getContentType())) {
            throw new FileUploadException(file.getContentType());
        }
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Vehicle image information not found");
        }
        var result = cloudinary.upload(file);
        updateImageLink(result, id);
    }

    private void updateImageLink(Map metadata, Long id) {
        var vehicleImage = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        vehicleImage.setPublicImageId(String.valueOf(metadata.get("public_id")));
        vehicleImage.setLink(String.valueOf(metadata.get("secure_url")));
        repository.save(vehicleImage);
    }
}
