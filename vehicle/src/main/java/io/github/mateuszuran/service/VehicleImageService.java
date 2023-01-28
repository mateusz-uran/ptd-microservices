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
import java.util.Optional;

import static org.apache.http.entity.ContentType.IMAGE_JPEG;
import static org.apache.http.entity.ContentType.IMAGE_PNG;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleImageService {
    private final VehicleService vehicleService;
    private final CloudinaryManager cloudinary;
    private final VehicleMapper mapper;

    public VehicleImageDTO addVehicleImage(VehicleImageDTO vehicleImageDTO, String vehicleId, MultipartFile file) throws Exception {
        var imageInfo = cloudinary.uploadImage(file);

        var vehicleImage = mapper.mapToVehicleImage(vehicleImageDTO);
        vehicleImage.setVehicleImagePublicId(imageInfo.get("publicLink").toString());
        vehicleImage.setVehicleImageDirectLink(imageInfo.get("imageUrl").toString());

        vehicleService.updateVehicleWithImageData(vehicleImage, vehicleId);
        return mapper.mapToVehicleImageDTO(vehicleImage);
    }

    public VehicleImageDTO updateVehicleImage(String vehicleId, MultipartFile file) throws Exception {
        var vehicleToUpdate = vehicleService.getVehicleById(vehicleId);

        if (vehicleToUpdate.getImage() != null) {
            var imageInfo = cloudinary.uploadImage(file);

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

        Optional.of(vehicleToUpdate.getImage()).ifPresent(image -> {
            cloudinary.deleteImage(image.getVehicleImagePublicId());

            image.setVehicleImagePublicId("");
            image.setVehicleImageDirectLink("");

            vehicleService.updateVehicleWithImageData(image, vehicleId);
        });
    }
}
