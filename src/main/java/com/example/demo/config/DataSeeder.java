package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 開發用測試帳號，資料庫沒有任何使用者時才會建立，方便直接測試登入畫面。
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new User("admin", passwordEncoder.encode("admin123")));
            System.out.println("已建立測試帳號 -> username: admin / password: admin123");
        }
    }
}
