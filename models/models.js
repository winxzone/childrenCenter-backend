import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const Position = sequelize.define("position", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    salary: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 8000, max: 50000 } },
});

const Employee = sequelize.define("employee", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(50), allowNull: false },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [13, 13] },
    },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    date_of_employment: { type: DataTypes.DATEONLY, allowNull: false },
    position_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Position,
            key: "id",
        },
    },
});

const Event = sequelize.define("event", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    date: {
        type: DataTypes.DATEONLY, // only date
        allowNull: false,
    },
    time: { type: DataTypes.TIME, allowNull: false },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: "id",
        },
    },
});

const Client = sequelize.define("client", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(50), allowNull: false },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [13, 13] },
    },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    workplace: { type: DataTypes.STRING, allowNull: false },
});

const Children = sequelize.define("children", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(50), allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: "id",
        },
    },
});

const Group = sequelize.define("group", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    max_children: { type: DataTypes.INTEGER, validate: { len: [1, 12] } },
});

const Lesson = sequelize.define("lesson", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    age_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 4,
            max: 16,
        },
    },
    number_of_lessons_per_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 30,
            max: 120,
        },
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Employee",
            key: "id",
        },
    },
});

const Schedule = sequelize.define("schedule", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lessons_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Lesson",
            key: "id",
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    groups_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Group",
            key: "id",
        },
    },
});

const Progress = sequelize.define("progress", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Schedule",
            key: "id",
        },
    },
    children_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Children",
            key: "id",
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 12,
        },
    },
});

const Price = sequelize.define("price", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lessons_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Lesson",
            key: "id",
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

const Contract = sequelize.define("contract", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Employee",
            key: "id",
        },
    },
    children_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Children",
            key: "id",
        },
    },
    groups_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Group",
            key: "id",
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12,
        },
    },
});

const ClientEvent = sequelize.define("client_event", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Client",
            key: "id",
        },
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Event",
            key: "id",
        },
    },
});
