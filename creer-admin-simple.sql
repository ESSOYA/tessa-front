-- Script simple pour créer un admin TESSA COIFFURE
-- Copiez et collez ce code dans votre gestionnaire MySQL (phpMyAdmin, MySQL Workbench, etc.)

-- 1. Créer un nouvel admin
INSERT INTO `users` (
    `role_id`, 
    `email`, 
    `password_hash`, 
    `first_name`, 
    `last_name`, 
    `phone`, 
    `is_active`, 
    `created_at`, 
    `updated_at`
) VALUES (
    1, 
    'admin@tessa.fr', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Admin', 
    'TESSA', 
    '01 23 45 67 89', 
    1, 
    NOW(), 
    NOW()
);

-- 2. Vérifier que l'admin a été créé
SELECT id, email, first_name, last_name, role_id, is_active 
FROM users 
WHERE email = 'admin@tessa.fr';

