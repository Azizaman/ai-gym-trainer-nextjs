import { NextResponse } from "next/server";

const exercises = [
    { id: "squat", name: "Squat", category: "legs" },
    { id: "deadlift", name: "Deadlift", category: "posterior_chain" },
    { id: "bench-press", name: "Bench Press", category: "chest" },
    { id: "overhead-press", name: "Overhead Press", category: "shoulders" },
    { id: "pull-up", name: "Pull-Up / Chin-Up", category: "back" },
    { id: "push-up", name: "Push-Up", category: "chest" },
    { id: "lunge", name: "Lunge", category: "legs" },
    { id: "romanian-deadlift", name: "Romanian Deadlift", category: "posterior_chain" },
    { id: "hip-thrust", name: "Hip Thrust", category: "glutes" },
    { id: "plank", name: "Plank", category: "core" },
    { id: "burpee", name: "Burpee", category: "full_body" },
    { id: "kettlebell-swing", name: "Kettlebell Swing", category: "full_body" },
];

export async function GET() {
    return NextResponse.json({ success: true, data: exercises });
}
