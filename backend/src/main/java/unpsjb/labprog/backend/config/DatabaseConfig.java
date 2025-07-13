package unpsjb.labprog.backend.config;

import java.net.URI;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        log.info("Configurando DataSource con DATABASE_URL");
        
        // Convertir DATABASE_URL de Render
        // Formato actual: postgresql://user:pass@host:port/database
        // Necesario: jdbc:postgresql://host:port/database (sin credenciales en la URL)
        URI dbUri = URI.create(databaseUrl);
        
        // Construir la URL JDBC correctamente sin credenciales
        String host = dbUri.getHost();
        int port = dbUri.getPort() != -1 ? dbUri.getPort() : 5432;
        String database = dbUri.getPath(); // ya incluye el /
        
        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + database;
        
        String username = dbUri.getUserInfo().split(":")[0];
        String password = dbUri.getUserInfo().split(":")[1];

        log.info("Usuario: {}", username);
        log.info("Host: {}:{}", host, port);
        log.info("Database: {}", database);
        log.info("JDBC URL: {}", jdbcUrl);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        
        // Configuraciones adicionales para Render
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
