"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { showToast } from "@/lib";
import { CREATE_PROBLEM } from "@/lib/services";
import { useAppDispatch } from "@/redux/redux-hooks";
import { addProblem } from "@/redux/slice/problemSlice";
import { useMutation } from "@apollo/client";
import { PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

interface ProblemForm {
    title: string;
    description: string;
    inputFormat: string;
    outputFormat: string;
    exampleInput: string;
    exampleOutput: string;
    constraints: string;
    difficulty: "easy" | "medium" | "hard";
    topic: string[];
    testCases: { input: string; expectedOutput: string }[];
}

export default function NewProblemPage() {
    const dispatch = useAppDispatch();

    const form = useForm<ProblemForm>({
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

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "testCases",
    });
    const [createCodingProblem] = useMutation(CREATE_PROBLEM);
    const onSubmit = async (values: ProblemForm) => {
        try {
            const res = await createCodingProblem({
                variables: {
                    input: {
                        ...values,
                        topic: values.topic.length > 0 ? values.topic : [""],
                        difficulty: values.difficulty.toUpperCase(),
                    }
                }
            })

            if (res.data.createCodingProblem.id) {
                dispatch(addProblem({
                    ...values,
                    id: res.data.createCodingProblem.id
                }));
                showToast("Problem added successfully", "success");
                form.reset();
            }

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <SectionWrapper>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Create New Problem</h1>

                <Card className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter problem title" required />
                                        </FormControl>
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
                                            <Textarea {...field} placeholder="Enter problem description" required />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="constraints"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Constraints</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Describe problem constraints" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="inputFormat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Input Format</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Describe input format" required />
                                            </FormControl>
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
                                                <Textarea {...field} placeholder="Describe output format" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Difficulty</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value}>
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
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="exampleInput"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Example Input</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Provide an example input" required />
                                        </FormControl>
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
                                            <Textarea {...field} placeholder="Provide an example output" required />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Test Cases</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ input: "", expectedOutput: "" })}
                                        className="flex items-center gap-2"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Add Test Case
                                    </Button>
                                </div>

                                {fields.map((field, index) => (
                                    <Card key={field.id} className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-medium">Test Case {index + 1}</h4>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
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
                                                            <Textarea {...field} placeholder="Test case input" required />
                                                        </FormControl>
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
                                                            <Textarea {...field} placeholder="Expected output" required />
                                                        </FormControl>
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
                                <Button type="submit">Create Problem</Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </SectionWrapper>
    );
}
