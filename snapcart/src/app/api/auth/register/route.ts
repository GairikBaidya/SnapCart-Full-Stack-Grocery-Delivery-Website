import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request:NextRequest) {
    try {
        const {name,email,password}=await request.json()
        await connectDb()
        const existEmail=await User.findOne({email})
        if(existEmail){
            return NextResponse.json(
                {message:"email already exist!"},
                {status:400}
            )
        }
         


        if(password.length<6){
              return NextResponse.json(
                {message:"password must be at least 6 characters!"},
                {status:400}
            )
        }

       const hashedPassword= await bcrypt.hash(password,10)
       const user=await User.create({
        name,email,password:hashedPassword})

           return NextResponse.json(
                user,
                {status:201}
            )

    } catch (error) {
            return NextResponse.json(
                {message:`register error ${error}`},
                {status:500}
            )
    }
}


// // signup
//      |
//   check exist user
//     |
//   password check for 6 characters(optional)
//   hash password using bcryptjs
// user create