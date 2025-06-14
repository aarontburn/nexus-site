"use server"
import bcrypt from "bcryptjs";
import { connectDB } from "./MongoDB";
import User from "./User";
import { createAccountAnalytic } from "../../analytics/analytic-handler";


export interface RegisterProps {
    email: string;
    password: string;
    name: string;
}

export const register = async (values: RegisterProps) => {
    const { email, password, name } = values;

    try {
        await connectDB();
        const userFound = await User.findOne({ email });
        if (userFound) {
            return {
                error: 'Email already exists.'
            }
        }
        const usernameTaken = await User.findOne({ name });
        if (usernameTaken) {
            return {
                error: 'Username already taken.'
            };
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        await createAccountAnalytic(email);

    } catch (e) {
        console.log(e);
        return e
    }
}