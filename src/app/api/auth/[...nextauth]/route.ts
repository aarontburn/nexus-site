import NextAuth, { NextAuthOptions, Session } from "next-auth";
import bcrypt from "bcryptjs";
import credentials from "next-auth/providers/credentials";
import { connectDB } from "../MongoDB";
import User from "../User";



const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const user = await User.findOne({
                    email: credentials?.email,
                }).select("+password");

                if (!user) {
                    throw new Error("No user with the provided email found.");
                };

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Incorrect password.");
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/marketplace/login"
    },
    callbacks: {
        async session({ session }): Promise<Session> {
            const databaseUser = await User.findOne({ email: session.user.email });
            session.user.id = `${databaseUser._id}`;
            return session;
        },
    },
};




const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };