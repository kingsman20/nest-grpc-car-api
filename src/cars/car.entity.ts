import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { User } from '../users/user.entity';

// make, model, features, vin, price and location

@Table
export class Car extends Model<Car> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    make: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    model: string;

    @Column({
        type: DataType.TEXT,
    })
    features: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    vin: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    price: number;

    @Column({
        type: DataType.STRING,
    })
    location: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
