GRANT ALL ON *.* TO root@'%';
CREATE DATABASE IF NOT EXISTS test;
CREATE USER 'test'@'localhost' IDENTIFIED WITH mysql_native_password BY 'testtest';
GRANT ALL ON test.* to test@'localhost';
GRANT ALL ON test.* to test@'%';

-- Path: databases/mysql/init.sql
insert into development.fee (id, target_currency, fee_per_case, fee_rate, amount_from, amount_to, valid_from,
  created_at, updated_at, valid_to, is_valid, deleted_at)
values (
default, 'USD', 1000, 0.0020, 1, 1000000,  '2023-01-01 00:00:00.000000',
  default, default, null, TRUE, default
);
insert into development.fee (id, target_currency, fee_per_case, fee_rate, amount_from, amount_to, valid_from,
  created_at, updated_at, valid_to, is_valid, deleted_at)
values (
default, 'USD', 3000, 0.0010, 1000000, null,  '2023-01-01 00:00:00.000000',
  default, default, null, TRUE, default
);
insert into development.fee (id, target_currency, fee_per_case, fee_rate, amount_from, amount_to, valid_from,
  created_at, updated_at, valid_to, is_valid, deleted_at)
values (
default, 'JPY', 3000, 0.0050, 1, null,  '2023-01-01 00:00:00.000000',
  default, default, null, TRUE, default
);