package io.github.mateuszuran.service;

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
    private final VehicleMapper mapper;

    public VehicleImageDTO addVehicleImage(VehicleImageDTO vehicleImageRequest, String vehicleId, MultipartFile file) throws Exception {
        var imageInfo = uploadImage(file);

        VehicleImage vehicleImage = VehicleImage.builder()
                .vehicleImageName(vehicleImageRequest.getVehicleImageName())
                .vehicleImageDescription(vehicleImageRequest.getVehicleImageDescription())
                .vehicleImagePublicId(imageInfo.get("publicLink").toString())
                .vehicleImageDirectLink(imageInfo.get("imageUrl").toString())
                .build();
        vehicleService.updateVehicleWithImageData(vehicleImage, vehicleId);
        return VehicleImageDTO.builder()
                .vehicleImageName(vehicleImage.getVehicleImageName())
                .vehicleImageDescription(vehicleImage.getVehicleImageDescription())
                .vehicleImagePublicId(vehicleImage.getVehicleImagePublicId())
                .vehicleImageDirectLink(vehicleImage.getVehicleImageDirectLink())
                .build();
    }

    public VehicleImageDTO updateVehicleImage(String vehicleId, MultipartFile file) throws Exception {
        var vehicleToUpdate = vehicleService.getVehicleById(vehicleId);

        if (vehicleToUpdate.getImage() != null) {
            var imageInfo = uploadImage(file);

            var imageInfoToUpdate = vehicleToUpdate.getImage();
            imageInfoToUpdate.setVehicleImagePublicId(imageInfo.get("publicLink").toString());
            imageInfoToUpdate.setVehicleImageDirectLink(imageInfo.get("imageUrl").toString());

            vehicleService.updateVehicleWithImageData(imageInfoToUpdate, vehicleId);

            return mapper.mapToVehicleImageDTO(imageInfoToUpdate);
        }
        return VehicleImageDTO.builder().build();
    }

    public void deleteVehicleImage(String vehicleId) {
        var vehicleToUpdate = vehicleService.getVehicleById(vehicleId);

        if(vehicleToUpdate.getImage().getVehicleImagePublicId() != null) {
            cloudinary.deleteImage(vehicleToUpdate.getImage().getVehicleImagePublicId());

            var imageInfoToUpdate = vehicleToUpdate.getImage();
            imageInfoToUpdate.setVehicleImagePublicId("");
            imageInfoToUpdate.setVehicleImageDirectLink("");

            vehicleService.updateVehicleWithImageData(imageInfoToUpdate, vehicleId);

            mapper.mapToVehicleImageDTO(imageInfoToUpdate);
        }
    }

    private Map<String, Object> uploadImage(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new FileUploadException();
        }
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType()).contains(file.getContentType())) {
            throw new FileUploadException(file.getContentType());
        }
        return cloudinary.upload(file);
    }
}
