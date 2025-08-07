-- create database jorib_db;
-- create user 'jorib_dml'@'%' identified by 'password';
-- use jorib_db;
-- grant ALL privileges on jorib_db to 'jorib_dml';

-- 1. 사용자 (회원)
CREATE TABLE users (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 게시판 (데이터 미리 넣고 조회만)
CREATE TABLE boards (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(50) NOT NULL UNIQUE,
                        description TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. 게시글
CREATE TABLE posts (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       board_id INT NOT NULL,
                       author_id INT NOT NULL,
                       title VARCHAR(200) NOT NULL,
                       content TEXT NOT NULL,
                       category enum('WEB', 'MOBILE', 'BACK', 'HARD', 'AI', 'NETWORK', 'SECURITY', 'DEVOPS', 'ETC') NOT NULL,
                       view_count INT DEFAULT 0,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
                       FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. 댓글
CREATE TABLE comments (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          post_id INT NOT NULL,
                          author_id INT NOT NULL,
                          content TEXT NOT NULL,
                          parent_comment_id INT,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 5. 좋아요 (게시글/댓글 공통)
CREATE TABLE likes (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       user_id INT NOT NULL,
                       target_type ENUM('POST', 'COMMENT') NOT NULL,
                       target_id INT NOT NULL,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       UNIQUE KEY unique_like (user_id, target_type, target_id)
);

-- 6. 쪽지
CREATE TABLE messages (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          sender_id INT NOT NULL,
                          receiver_id INT NOT NULL,
                          content TEXT NOT NULL,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
