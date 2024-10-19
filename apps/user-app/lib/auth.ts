import client from '@repo/db/client'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

export const authProviders = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone Number", type: "number", placeholder: "0000000000" },
                password: { label: "Password", type: "password", placeholder: "Enter the password" }
            },
            async authorize(credentials: any) {
                const hashedPass = bcrypt.hash(credentials.password, 10)

                const existingUser = await client.user.findUniwuq
            }
        })
    ]
}