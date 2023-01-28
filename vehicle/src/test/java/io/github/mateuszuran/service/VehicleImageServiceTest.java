package io.github.mateuszuran.service;

import io.github.mateuszuran.dto.VehicleImageDTO;
import io.github.mateuszuran.filestore.CloudinaryManager;
import io.github.mateuszuran.mapper.VehicleMapper;
import io.github.mateuszuran.model.Vehicle;
import io.github.mateuszuran.model.VehicleImage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleImageServiceTest {
    @InjectMocks
    private VehicleImageService vehicleImageService;
    @Mock
    private VehicleService vehicleService;
    @Mock
    private CloudinaryManager cloudinaryManager;
    @Mock
    private VehicleMapper mapper;

    @Test
    void addVehicleImage() throws Exception {
        //given
        VehicleImageDTO vehicleImageDTO = VehicleImageDTO.builder().vehicleImageName("XYZ").build();
        MockMultipartFile file
                = new MockMultipartFile(
                "image",
                "image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test".getBytes()
        );
        Map<String, Object> cloudinaryResponse = new HashMap<>();
        cloudinaryResponse.put("publicLink", "test_public_id");
        cloudinaryResponse.put("imageUrl", "https://example.com/test_public_id.jpg");
        VehicleImage vehicleImage = VehicleImage.builder().vehicleImageName("XYZ").build();
        //when
        when(cloudinaryManager.uploadImage(file)).thenReturn(cloudinaryResponse);
        when(mapper.mapToVehicleImage(vehicleImageDTO)).thenReturn(vehicleImage);
        when(vehicleImageService.addVehicleImage(vehicleImageDTO, "ABC", file)).thenReturn(vehicleImageDTO);
        var result = vehicleImageService.addVehicleImage(vehicleImageDTO, "ABC", file);
        //then
        assertThat(result).isEqualTo(vehicleImageDTO);
    }

    @Test
    void updateVehicleImage() throws Exception {
        //given
        MockMultipartFile file
                = new MockMultipartFile(
                "image",
                "image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test".getBytes()
        );
        VehicleImage vehicleImage = VehicleImage.builder().build();
        VehicleImageDTO vehicleImageDTO = VehicleImageDTO.builder().build();
        Vehicle vehicle = Vehicle.builder().image(vehicleImage).build();
        Map<String, Object> cloudinaryResponse = new HashMap<>();
        cloudinaryResponse.put("publicLink", "test_public_id");
        cloudinaryResponse.put("imageUrl", "https://example.com/test_public_id.jpg");
        //when
        when(vehicleService.getVehicleById("ABC")).thenReturn(vehicle);
        when(cloudinaryManager.uploadImage(file)).thenReturn(cloudinaryResponse);
        when(vehicleImageService.updateVehicleImage("ABC", file)).thenReturn(vehicleImageDTO);
        //then
        assertThat(vehicleImageService.updateVehicleImage("ABC", file)).isEqualTo(vehicleImageDTO);
    }

    @Test
    void imageNotFoundUpdateVehicleImage() throws Exception {
        //given
        MockMultipartFile file
                = new MockMultipartFile(
                "image",
                "image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test".getBytes()
        );
        Vehicle vehicle = Vehicle.builder().image(null).build();
        VehicleImageDTO vehicleImageDTO = VehicleImageDTO.builder().build();
        //when
        when(vehicleService.getVehicleById("ABC")).thenReturn(vehicle);
        //then
        assertThat(vehicleImageService.updateVehicleImage("ABC", file)).isEqualTo(vehicleImageDTO);
        verify(vehicleService, never()).updateVehicleWithImageData(any(), eq("ABC"));
    }

    @Test
    void deleteVehicleImage() {
        //given
        VehicleImage vehicleImage = VehicleImage.builder()
                .vehicleImagePublicId("publicId")
                .build();
        Vehicle vehicle = Vehicle.builder().id("ABC").image(vehicleImage).build();
        //when
        when(vehicleService.getVehicleById(vehicle.getId())).thenReturn(vehicle);
        vehicleImageService.deleteVehicleImage(vehicle.getId());
        cloudinaryManager.deleteImage(vehicleImage.getVehicleImagePublicId());
        verify(cloudinaryManager, times(1)).deleteImage(vehicleImage.getVehicleImagePublicId());
        //then
        assertThat(vehicleImage.getVehicleImagePublicId()).isEqualTo("");
    }
}