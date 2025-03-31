use delivery_app;

-- USERS
create table users(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR(90) NOT NULL,
    phone VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(90) NOT NULL,
    created_at timestamp(0),
    updated_at timestamp(0)
);

-- ROLES
create table roles(
	id bigint primary key auto_increment,
    name varchar(90) not null unique,
    image varchar(255) null,
    route varchar(180) not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) not null
);

insert into roles(
	name,
    route,
    created_at,
    updated_at
) values(
	'RESTAURANTE',
    '/restaurant/orders/list',
    '2025-03-13',
    '2025-03-13'
);

insert into roles(
	name,
    route,
    created_at,
    updated_at
) values(
	'REPARTIDOR',
    '/delivery/orders/list',
    '2025-03-13',
    '2025-03-13'
);

insert into roles(
	name,
    route,
    created_at,
    updated_at
) values(
	'CLIENTE',
    '/client/orders/list',
    '2025-03-13',
    '2025-03-13'
);

create table user_has_roles(
	id_user bigint not null,
    id_rol bigint not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) not null,
    foreign key(id_user) references users(id) on update cascade on delete cascade,
    foreign key(id_rol) references roles(id) on update cascade on delete cascade,
    primary key(id_user, id_rol)
);

-- CATEGORIES
create table catregories(
	id bigint primary key auto_increment,
    name varchar(50) not null,
    description text not null,
    image varchar(255) null,
    created_at timestamp(0) not null,
	updated_at timestamp(0) not null
)