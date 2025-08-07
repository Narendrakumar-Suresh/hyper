// src/app/api/org/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, user_id } = body;

        // Check if a school with the same slug already exists
        const existingSchool = await db.school.findUnique({
            where: { slug },
        });

        if (existingSchool) {
            return new NextResponse("School with this slug already exists.", { status: 409 });
        }

        // Create the new school in the database
        const newSchool = await db.school.create({
            data: {
                name,
                slug,
                ownerId: user_id, // Assuming a relation to the user
            },
        });

        return NextResponse.json(newSchool, { status: 201 });
    } catch (error) {
        console.error("Error creating school:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}