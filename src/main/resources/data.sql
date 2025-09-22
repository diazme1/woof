INSERT INTO usuario (nombre, dni, email, telefono, direccion, contrasena, rol)
VALUES ('Administrador', 99999999, 'admin@woof.com', '0000000000', 'Universidad Nacional de Quilmes', 'Admin@123', 2)
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuario (nombre, dni, email, telefono, direccion, contrasena, rol)
VALUES ('Paseador', 8888888, 'p@gmail.com', '0000000000', 'Universidad Nacional de Quilmes', 'Paseador@123', 0)
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuario (nombre, dni, email, telefono, direccion, contrasena, rol)
VALUES ('Cliente', 7777777, 'c@gmail.com', '0000000000', 'Universidad Nacional de Quilmes', 'Cliente@123', 1)
ON CONFLICT (email) DO NOTHING;