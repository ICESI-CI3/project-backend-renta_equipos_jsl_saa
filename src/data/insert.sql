INSERT INTO public."user" (id, name, email, password, cellphone, address, role) VALUES
('a1f2a111-1a2b-4c3d-9e5f-aaaabbbbcccc', 'Alice López', 'alice@example.com', 'hashedpass1', '3001234567', 'Cra 45 #10-20', 'user'),
('b2f3b222-2b3c-5d4e-0f1a-bbbbccccdddd', 'Carlos Mejía', 'carlos@example.com', 'hashedpass2', '3019876543', 'Cl 23 #34-45', 'admin'),
('c3f4c333-3c4d-6e5f-1a2b-ccccddddeeee', 'Diana Ruiz', 'diana@example.com', 'hashedpass3', '3024567890', 'Cra 67 #89-12', 'superuser'),
('d4f5d444-4d5e-7f6a-2b3c-ddddeeeeffff', 'Esteban Ríos', 'esteban@example.com', 'hashedpass4', '3036543210', 'Cl 89 #67-54', 'tecnico');

INSERT INTO public.device (id, name, description, type, status, owner, image) VALUES
('10000000-0000-0000-0000-000000000001', 'Smart Meter X1', 'Medidor inteligente de consumo eléctrico', 'medidor', 'available', 'admin', 'smart_meter.png'),
('10000000-0000-0000-0000-000000000002', 'Solar Panel SP50', 'Panel solar de 50W', 'panel', 'in use', 'user', 'panel_sp50.png'),
('10000000-0000-0000-0000-000000000003', 'Battery Pack B100', 'Batería de respaldo 100Ah', 'bateria', 'maintenance', 'tecnico', 'battery_b100.png'),
('10000000-0000-0000-0000-000000000004', 'Wind Turbine WT200', 'Turbina eólica doméstica', 'generador', 'available', 'superuser', 'turbine_wt200.png');

INSERT INTO public.request (id, user_email, date_start, date_finish, status, admin_comment) VALUES
('20000000-0000-0000-0000-000000000001', 'alice@example.com', '2025-05-01', '2025-06-01', 'approved', 'Todo en orden.'),
('20000000-0000-0000-0000-000000000002', 'alice@example.com', '2025-06-15', '2025-07-15', 'pending', 'Falta revisión técnica.'),
('20000000-0000-0000-0000-000000000003', 'diana@example.com', '2025-04-10', '2025-05-10', 'rejected', 'Inconsistencias en la documentación.');

INSERT INTO public.request_device (id, request_id, device_id, deviceName) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Smart Meter X1'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Solar Panel SP50'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Battery Pack B100');

INSERT INTO public.contract (id, user_email, request_id, date_start, date_finish, status, client_signature) VALUES
('40000000-0000-0000-0000-000000000001', 'alice@example.com', '20000000-0000-0000-0000-000000000001', '2025-05-01', '2025-06-01', 'active', 'firma_digital_alice.png'),
('40000000-0000-0000-0000-000000000002', 'alice@example.com', '20000000-0000-0000-0000-000000000002', '2025-06-15', '2025-07-15', 'pending', null);

INSERT INTO public.contract_device (id, contract_id, device_id, deviceName, delivery_status) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Smart Meter X1', 'delivered'),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Solar Panel SP50', 'in transit'),
('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Battery Pack B100', 'pending');
