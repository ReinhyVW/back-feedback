CREATE DATABASE SURVEYDB
GO

USE SURVEYDB

CREATE TABLE Centers (
    CenterId INT PRIMARY KEY IDENTITY,
    FacilityName VARCHAR(60),
    LocationAddress VARCHAR(200),
    ContactName VARCHAR(60),
    ContactPhone BIGINT
);

INSERT INTO Centers (FacilityName, LocationAddress, ContactName, ContactPhone)
VALUES
    ('Coconut Creek', '3850 Coconut Creek Pkwy, Suite 3', 'Midalys Galdo', 9549739222),
	('Pembroke Pines', '10067 Pines Blvd, Suite A', 'Elizabeth Ventos', 9544306900),
	('Plantation', '7353 NW 4th St Plantation', 'Jenay Ramsay', 9545817171);
GO

CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY,
    RoleLevel VARCHAR(50)
);

INSERT INTO Roles (RoleLevel)
VALUES
    ('Admin'),
    ('Location Manager'),
    ('Data Entry');
GO

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY,
    Username VARCHAR(100),
    Passcode VARCHAR(150),
    PasswordReset BIT DEFAULT 0,
    MemberName VARCHAR(100),
    MemberLname VARCHAR(100),
    CreationDate DATETIME DEFAULT GETDATE(),
    RoleId INT REFERENCES Roles (RoleId),
    CenterId INT REFERENCES Centers (CenterId)
);

INSERT INTO Users (Username, Passcode, MemberName, MemberLname, RoleId, CenterId)
VALUES
    ('Admin', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Juan', 'Rosa', 1, 1),
	('AdminCC', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Midalys', 'Galdo', 2, 1),
	('CoconutCreek', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Check', 'Out', 3, 1),
	('AdminPP', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Elizabeth', 'Vento', 2, 2),
	('PembrokePines', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Check', 'Out', 3, 2),
	('AdminPlantation', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Jenay', 'Ramsay', 2, 3),
	('Plantation', '$2a$12$znJiOrbdSiShqLucoAtYIOJhOxYWKl0sbDQcsmklkxrLSfeCNQKq.', 'Check', 'Out', 3, 3);
GO

CREATE TABLE Answers (
    AnswerId INT PRIMARY KEY,
    OptionName VARCHAR(50)
);

INSERT INTO Answers (AnswerId, OptionName)
VALUES
    (2, 'Excellent'),
    (1, 'Good'),
    (0, 'Poor');
GO

CREATE TABLE Reasons (
    ReasonId INT PRIMARY KEY IDENTITY,
    ReasonName VARCHAR(50)
);

INSERT INTO Reasons (ReasonName)
VALUES
    ('Doctor'),
    ('Staff'),
    ('Hold'),
    ('Front Desk'),
    ('Facility'),
    ('All');
GO

CREATE TABLE Feedback (
    RecordId INT PRIMARY KEY IDENTITY,
    RecordDate DATE DEFAULT GETDATE(),
    RecordTime TIME DEFAULT GETDATE(),
    AnswerId INT REFERENCES Answers (AnswerId),
    ReasonId INT REFERENCES Reasons (ReasonId),
    UserId INT REFERENCES Users (UserId)
);

CREATE TABLE SLA (
    CenterId INT PRIMARY KEY REFERENCES Centers (CenterId),
    Detail VARCHAR(80),
    Target DECIMAL(5, 2)
);

INSERT INTO SLA (CenterId, Detail, Target)
VALUES
    (1, 'Coconut Creek', 0.90),
	(2, 'Pembroke Pines', 0.90),
	(3, 'Plantation', 0.90);
GO