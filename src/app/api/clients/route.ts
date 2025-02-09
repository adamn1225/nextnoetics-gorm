import { supabase } from "@lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, email, phone, message } = await request.json();

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 },
            );
        }

        // Insert client data into the database
        const { data, error } = await supabase
            .from("clients")
            .insert([{ name, email, phone, message }]);

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 },
        );
    }
}