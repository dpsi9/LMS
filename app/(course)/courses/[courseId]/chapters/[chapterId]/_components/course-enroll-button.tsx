"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
    courseId: string;
    price: number;
}

export const CourseEnrollButton = ({
    price,
    courseId
}:CourseEnrollButtonProps ) => {
    return (
        <Button
        size="sm"
        className="w-full md:w-auto"
        >
            Enroll form {formatPrice(price)}
        </Button>
    )
}