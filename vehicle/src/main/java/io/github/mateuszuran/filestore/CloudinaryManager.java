package io.github.mateuszuran.filestore;

import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import io.github.mateuszuran.config.CloudinaryConfig;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.apache.http.entity.ContentType.IMAGE_JPEG;
import static org.apache.http.entity.ContentType.IMAGE_PNG;

@Service
@RequiredArgsConstructor
public class CloudinaryManager {
    private final CloudinaryConfig cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new FileUploadException();
        }
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType()).contains(file.getContentType())) {
            throw new FileUploadException(file.getContentType());
        }
        return upload(file);
    }

    public Map<String, Object> upload(MultipartFile file) {
        try {
            var result = cloudinary.cloud().uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("transformation",
                            new Transformation().width(640).height(360).crop("limit")));

            Map<String, Object> imageInfo = new HashMap<>();
            imageInfo.put("publicLink", result.get("public_id"));
            imageInfo.put("imageUrl", result.get("url"));
            return imageInfo;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.cloud().uploader().destroy(publicId,
                    ObjectUtils.asMap("resource_type","image"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
