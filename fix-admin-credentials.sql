-- Script pour corriger les identifiants admin TESSA COIFFURE
-- Exécutez ce script dans votre base de données MySQL

-- 1. Vérifier les utilisateurs existants
SELECT id, email, first_name, last_name, role_id, is_active 
FROM users 
WHERE role_id = 1 OR email LIKE '%admin%';

-- 2. Créer un nouvel admin avec des identifiants simples
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
    1, -- role_id = 1 (admin)
    'admin@tessa.fr', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password = "password"
    'Admin', 
    'TESSA', 
    '01 23 45 67 89', 
    1, 
    NOW(), 
    NOW()
) ON DUPLICATE KEY UPDATE
    password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role_id = 1,
    is_active = 1;

-- 3. Mettre à jour l'admin existant si il existe
UPDATE users 
SET 
    password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role_id = 1,
    is_active = 1
WHERE email = 'admin@tessa-coiffure.com';

-- 4. Vérifier que l'admin a été créé/mis à jour
SELECT id, email, first_name, last_name, role_id, is_active 
FROM users 
WHERE email = 'admin@tessa.fr' OR email = 'admin@tessa-coiffure.com';

-- 5. Afficher tous les admins disponibles
SELECT id, email, first_name, last_name, role_id, is_active 
FROM users 
WHERE role_id = 1;

