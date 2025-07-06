import mongoose, {Document, Schema} from "mongoose";

export interface ILottery extends Document {
    date: Date;
    redBalls: number[];
    blueBall: number;
}

const lotterySchema: Schema = new Schema({
    date: { type: Date, required: true},
    redBalls: { type: Number, required: true},
    blueBall: { type: Number, required: true},
})

const Lottery = mongoose.model<ILottery>('Lottery', lotterySchema, 'looteries');

export default Lottery;