package io.github.mateuszuran.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.mateuszuran.dto.VehicleImageDTO;
import io.github.mateuszuran.filestore.CloudinaryManager;
import io.github.mateuszuran.mapper.VehicleMapper;
import io.github.mateuszuran.model.VehicleImage;
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
    private final VehicleService vehicleService;
    private final CloudinaryManager cloudinary;

    public VehicleImageDTO addVehicleImage(VehicleImageDTO vehicleImageRequest, String vehicleId, MultipartFile file) throws Exception {
        var imageInfo = uploadImage(file);

        VehicleImage vehicleImage = VehicleImage.builder()
                .name(vehicleImageRequest.getName())
                .description(vehicleImageRequest.getDescription())
                .publicImageId(imageInfo.get("publicLink").toString())
                .link(imageInfo.get("imageUrl").toString())
                .build();
        vehicleService.updateVehicleWithImageData(vehicleImage, vehicleId);
        return VehicleImageDTO.builder()
                .name(vehicleImage.getName())
                .description(vehicleImage.getDescription())
                .publicImageId(vehicleImage.getPublicImageId())
                .link(vehicleImage.getLink())
                .build();
    }

    private static VehicleImage convertJsonToDTO(String vehicleImageRequest) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(vehicleImageRequest, VehicleImage.class);
    }

    public Map<String, Object> uploadImage(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new FileUploadException();
        }
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType()).contains(file.getContentType())) {
            throw new FileUploadException(file.getContentType());
        }
        return cloudinary.upload(file);
    }
}
