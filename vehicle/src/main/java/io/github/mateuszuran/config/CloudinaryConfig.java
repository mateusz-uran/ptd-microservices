package io.github.mateuszuran.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloud() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "name",
                "api_key", "123456789",
                "api_secret", "aaaabbb12345679",
                "secure", true));
    }
}
