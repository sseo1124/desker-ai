import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validators/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SIGNUP_STATUS } from "config/constants";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const requestInputData = await req.json();
    const validatedSignUp = signUpSchema.safeParse(requestInputData);
    if (!validatedSignUp.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: SIGNUP_STATUS.ERROR.INVALID_INPUT,
          },
        },
        { status: 400 }
      );
    }

    const { email, password, phoneNumber } = validatedSignUp.data;
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return NextResponse.json(
        {
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: SIGNUP_STATUS.ERROR.EMAIL_ALREADY_EXISTS,
          },
        },
        { status: 409 }
      );
    }

    const SALT_ROUNDS = 12;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.user.create({
      data: { email, passwordHash, phoneNumber },
      select: { id: true, email: true, createdAt: true },
    });

    const url = new URL(`/login?email=${encodeURIComponent(email)}`, req.url);
    return NextResponse.redirect(url, { status: 303 });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "SIGNUP_SERVER_ERROR" } },
      { status: 500 }
    );
  }
};
