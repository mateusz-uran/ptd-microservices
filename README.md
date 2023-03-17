<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Professional Truck Driver System Managment</h3>
  
  <h5 align="center">Application is still developed!</h5>

  <p align="center">
    Secured system designed to speed up and facilitate data management.
    <br />
    <br />
    <a href="https://github.com/mateusz-uran/PTD-Manager">Previous version</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

PTD Manager is system that helps professional truck driver to manage data during his trip.
All funcionalities are similar to the previous version but design is different. Application is built with microservices architecture
which means system is divided into services. Some are independent but some requeire the action of others. Like for example card service
is calling user service to check if User exists in system. When user-service is down, card service cant do any operations. Card and PDF services are managed by one Frontend Application written in react and User and Vehicle services are working with angular app.


### Built With

![Spring-Boot][Spring-Boot]
![Apache Kafka][Apache Kafka]
![Resilience4J][Resilience4J]
![Zipkin][Zipkin]
![iText][iText]
![PostgreSQL][PostgreSQL]
![MongoDB][MongoDB]
![Docker][Docker]
![React][React]
![Tailwind CSS][Tailwind CSS]
![Formik & Yup][Formik & Yup]
![JavaScript][JavaScript]
![Angular][Angular]
![TypeScript][TypeScript]
![Cloudinary][Cloudinary]
![HTML][HTML]
![CSS][CSS]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Application is using Cloudinary, below is required config located in directory:

src/main/java/io/github/mateuszuran/config/CloudinaryConfig.java
```
@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloud() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "xyz",
                "api_key", "123456780",
                "api_secret", "abc123xyz",
                "secure", true));
    }
}
```

### Prerequisites

First build JAR files with maven, for some reason mvn clean package was making trouble for me
so I had to build it with:
```
mvn clean package spring-boot:repackage

```
Run this command in each service directory and image will be build from Dockerfile configuration.

### Installation

Dockerfiles are in each directory

In root directory run:
```
docker compose up -d

```
Docker will build image from each Dockerfile and then container. Each endpoints is available via localhost:8181/api/(service name)
but in frontend directory are two projects. 
For card and pdf service React Application and for user and vehicle Angular App.

User service and Vehicle service are configured to be secured, keycloak as IDP Provider, API Gateway as resource server and
Angular App as client configured with PKCE. 


<p align="right">(<a href="#readme-top">back to top</a>)</p>

![diagram]

<!-- CONTACT -->
## Contact

Email - mateusz.uranowski@onet.pl

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[Spring-Boot]: https://img.shields.io/badge/Spring--Boot-black?logo=springboot&logoColor=6DB33F
[Apache Kafka]: https://img.shields.io/badge/Apache_Kafka-000?logo=Apache+Kafka
[Resilience4J]: https://img.shields.io/badge/Resilience4j_-000
[Zipkin]: https://img.shields.io/badge/Zipkin-fe7139
[iText]: https://img.shields.io/badge/iText-ff9f18
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-336691?logo=PostgreSQL&logoColor=fff
[MongoDB]: https://img.shields.io/badge/PostgreSQL-4faa41?logo=MongoDB&logoColor=fff
[Docker]: https://img.shields.io/badge/Docker-139fdc?logo=Docker&logoColor=fff
[React]: https://img.shields.io/badge/React-black?logo=react
[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-38bdf8?logo=Tailwind+CSS&logoColor=fff
[Formik & Yup]: https://img.shields.io/badge/Formik_%26_Yup-0052cc
[Angular]: https://img.shields.io/badge/Angular-c3002f?logo=Angular
[Cloudinary]: https://img.shields.io/badge/Cloudinary-3448c5
[HTML]: https://img.shields.io/badge/HTML-white?logo=html5
[CSS]: https://img.shields.io/badge/CSS-264ee4?logo=css3
[JavaScript]: https://img.shields.io/badge/JavaScript-black?logo=javascript
[TypeScript]: https://img.shields.io/badge/TypeScript-000?logo=TypeScript


[diagram]: diagram.png
