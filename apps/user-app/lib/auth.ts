import prisma from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import z from 'zod'

const numberSchema = z.string().length(10, { message: "Must be 10 character number" })
const passwordSchema = z.string().min(8, { message: "Must be 8 or more character long" })

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone Number",
          type: "text",
          placeholder: "0000000000",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"phone" | "password", string> | undefined) {

        if (!credentials) return null;

	      const parsedNum = numberSchema.parse(credentials.phone)
	      const parsedPass = passwordSchema.parse(credentials.password)

        const existingUser = await prisma.user.findFirst({
          where: {
            number: parsedNum,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
	          parsedPass,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.number,
            };
          }
          return null;
        }

        try {
          const hashedPassword = await bcrypt.hash(parsedPass, 10);
          const user = await prisma.user.create({
            data: {
              number: parsedNum, 
              password: hashedPassword,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number,
          };
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
