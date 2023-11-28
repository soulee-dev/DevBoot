#!/bin/bash

service mysql start

mysql -u root <<_EOF_
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
_EOF_

chmod 755 /var/run/mysqld/
chown mysql:mysql /var/run/mysqld/mysqld.sock

echo "MySQL installation and configuration done."
