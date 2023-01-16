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

    public void addImageInformation(String id, VehicleImageRequest vehicleDto) {
        VehicleImage image = VehicleImage.builder()
                .name(vehicleDto.getName())
                .description(vehicleDto.getDescription())
                .build();
        repository.save(image);
        service.updateVehicleWithImage(id, image);
    }

    public void uploadVehicleImage(final String id, MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new FileUploadException();
        }
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType()).contains(file.getContentType())) {
            throw new FileUploadException(file.getContentType());
        }

        var uploadedImageLink = cloudinary.upload(file);
        updateImageWithLink(id, uploadedImageLink);
    }

    private void updateImageWithLink(String id, Map<String, Object> link) {
        var existingImage = getVehicleImage(id);
        existingImage.setPublicImageId(link.get("publicLink").toString());
        existingImage.setLink(link.get("secretLink").toString());
        repository.save(existingImage);
        service.updateVehicleWithImage(id, existingImage);
    }

    private VehicleImage getVehicleImage(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
    }
}
