import prisma from '@repo/payTN-db/client'
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
                const hashedPass = await bcrypt.hash(credentials.password, 10)

                const existingUser = await prisma.user.findFirst({
                    where: {
                        number: credentials.phone
                    },
                })

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    }
                    return {
                        status: 500,
                        message: "Password doesn't match"
                    }
                }

                try {
                    const newUser = await prisma.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPass
                        }
                    })

                    if (newUser) {
                        return {
                            id: newUser.id.toString(),
                            email: newUser.email,
                            name: newUser.name
                        }
                    }
                } catch (error) {
                    console.log(error)
                }

                return null;
            }
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async sesion({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
}