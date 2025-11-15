-- Script SQL pour créer un nouvel administrateur TESSA COIFFURE
-- Exécutez ce script dans votre base de données MySQL

-- Créer un nouvel utilisateur administrateur
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
    'admin@tessa-coiffure.fr', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password = "password"
    'Admin', 
    'TESSA COIFFURE', 
    '01 23 45 67 89', 
    1, 
    NOW(), 
    NOW()
);

-- Vérifier que l'utilisateur a été créé
SELECT id, email, first_name, last_name, role_id, is_active 
FROM users 
WHERE email = 'admin@tessa-coiffure.fr';

