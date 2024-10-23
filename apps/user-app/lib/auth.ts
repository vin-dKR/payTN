import prisma from '@repo/db/client'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

type Credentials = {
    // phone: {
    //     label: string,
    //     type: string,
    //     placeholder: string
    // },
    // password: {
    //     password: {
    //         label: string,
    //         type: string
    //     }
    // }

    phone: string,
    password: string
}

export const authProviders = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone Number", type: "number", placeholder: "0000000000" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null
                }
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

                    if (!newUser) {
                        return null
                    }

                    return {
                        id: newUser.id.toString(),
                        email: newUser.email,
                        name: newUser.name
                    }
                } catch (error) {
                    console.log(error)
                }

                //WIP: bug here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // return newUser.name;
                const res = await fetch("/your/endpoint", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                  })
                  const user = await res.json()
            
                  // If no error and we have user data, return it
                  if (res.ok && user) {
                    return user
                  }
                  // Return null if user data could not be retrieved
                  return null
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