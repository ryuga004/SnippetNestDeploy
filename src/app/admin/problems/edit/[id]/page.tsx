"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/hoc/sectionWrapper";
import { CodingProblemType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";


const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    inputFormat: z.string().min(1, "Input format is required"),
    outputFormat: z.string().min(1, "Output format is required"),
    exampleInput: z.string().min(1, "Example input is required"),
    exampleOutput: z.string().min(1, "Example output is required"),
    constraints: z.string().min(1, "Constraints are required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    topic: z.array(z.string()).min(1, "At least one topic is required"),
    testCases: z.array(
        z.object({
            input: z.string(),
            expectedOutput: z.string(),
        })
    ),
});
export default function EditProblemPage() {

    const { id: problem_id } = useParams();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            inputFormat: "",
            outputFormat: "",
            exampleInput: "",
            exampleOutput: "",
            constraints: "",
            difficulty: "easy",
            topic: [],
            testCases: [{ input: "", expectedOutput: "" }],
        },
    });
    const addTestCase = () => {
        const currentTestCases = form.getValues("testCases");
        form.setValue("testCases", [
            ...currentTestCases,
            { input: "", expectedOutput: "" },
        ]);
    };

    const removeTestCase = (index: number) => {
        const currentTestCases = form.getValues("testCases");
        form.setValue(
            "testCases",
            currentTestCases.filter((_, i) => i !== index)
        );
    };
    useEffect(() => {
        // Mock API call - replace with actual API
        const fetchProblem = async () => {
            // Simulate API call
            const problem: CodingProblemType = {
                id: problem_id as string,
                title: "Two Sum",
                description: "Find two numbers that add up to target",
                inputFormat: "Array of integers and target sum",
                outputFormat: "Indices of the two numbers",
                exampleInput: "[2,7,11,15], target = 9",
                exampleOutput: "[0,1]",
                constraints: "2 <= nums.length <= 104",
                difficulty: "easy",
                topic: ["Arrays", "Hash Table"],
                testCases: [
                    {
                        input: "[2,7,11,15], 9",
                        expectedOutput: "[0,1]",
                    },
                ],
            };

            form.reset(problem);
        };

        fetchProblem();
    }, [problem_id, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        // Implement your update logic here
    };

    return (
        <SectionWrapper>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Edit Problem</h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="min-h-[100px]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="inputFormat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Input Format</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="outputFormat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Output Format</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="exampleInput"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Example Input</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="exampleOutput"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Example Output</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="constraints"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Constraints</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Difficulty</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Test Cases</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addTestCase}
                                        className="flex items-center gap-2"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Add Test Case
                                    </Button>
                                </div>

                                {form.watch("testCases").map((_, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-medium">Test Case {index + 1}</h4>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeTestCase(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`testCases.${index}.input`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Input</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Test case input" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`testCases.${index}.expectedOutput`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Expected Output</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                placeholder="Expected output"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </SectionWrapper>
    );
}



