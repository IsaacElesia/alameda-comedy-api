CREATE TYPE stage AS ENUM ('patio', 'showroom');

CREATE TABLE show (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY UNIQUE,
    title TEXT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    comics INTEGER,
    stage STAGE,
    details TEXT,
    notes TEXT,
    price_premium MONEY NOT NULL,
    price_general MONEY NOT NULL,
    capacity INTEGER,
    comps INTEGER,
    tix_id INTEGER
)