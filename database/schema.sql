CREATE TABLE accounts(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id VARCHAR(255)[] NOT NULL,
    name VARCHAR(255) NOT NULL,
   
    PRIMARY KEY(id)
);

CREATE TABLE expenses(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id VARCHAR(255)[] NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tag VARCHAR(255),
    account_id INT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    is_shared BOOLEAN NOT NULL DEFAULT false,
    
    PRIMARY KEY(id),
    
    CONSTRAINT fk_account
        FOREIGN KEY(account_id) 
            REFERENCES accounts(id)
);

CREATE TABLE payment_dates(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id VARCHAR(255)[] NOT NULL,
    expense_id INT NOT NULL,
    day_of_month INT NOT NULL,
    month INT NOT NULL,
   
    PRIMARY KEY(id),

    CONSTRAINT fk_expense
        FOREIGN KEY(expense_id) 
            REFERENCES expenses(id)
                ON DELETE CASCADE
);

CREATE TABLE settings(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    locale VARCHAR(255) NOT NULL DEFAULT 'en',
    income NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    partner_id VARCHAR(255)
);