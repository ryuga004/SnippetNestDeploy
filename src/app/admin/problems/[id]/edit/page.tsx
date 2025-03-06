// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { CodingProblemType } from "@/lib/types";


// const formSchema = z.object({
//     title: z.string().min(1, "Title is required"),
//     description: z.string().min(1, "Description is required"),
//     inputFormat: z.string().min(1, "Input format is required"),
//     outputFormat: z.string().min(1, "Output format is required"),
//     exampleInput: z.string().min(1, "Example input is required"),
//     exampleOutput: z.string().min(1, "Example output is required"),
//     constraints: z.string().min(1, "Constraints are required"),
//     difficulty: z.enum(["easy", "medium", "hard"]),
//     topic: z.array(z.string()).min(1, "At least one topic is required"),
// });
// interface PageProps {
//     params: {
//         id: string;
//     };
// }
// export default function EditProblemPage({ params }: PageProps) {
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             title: "",
//             description: "",
//             inputFormat: "",
//             outputFormat: "",
//             exampleInput: "",
//             exampleOutput: "",
//             constraints: "",
//             difficulty: "easy",
//             topic: [],
//         },
//     });

//     useEffect(() => {
//         // Mock API call - replace with actual API
//         const fetchProblem = async () => {
//             // Simulate API call
//             const problem: CodingProblemType = {
//                 id: params.id as string,
//                 title: "Two Sum",
//                 description: "Find two numbers that add up to target",
//                 inputFormat: "Array of integers and target sum",
//                 outputFormat: "Indices of the two numbers",
//                 exampleInput: "[2,7,11,15], target = 9",
//                 exampleOutput: "[0,1]",
//                 constraints: "2 <= nums.length <= 104",
//                 difficulty: "easy",
//                 topic: ["Arrays", "Hash Table"],
//                 testCases: [
//                     {
//                         input: "[2,7,11,15], 9",
//                         expectedOutput: "[0,1]",
//                     },
//                 ],
//             };

//             form.reset(problem);
//         };

//         fetchProblem();
//     }, [params.id, form]);

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         console.log(values);
//         // Implement your update logic here
//     };

//     return (
//         <div className="container mx-auto py-8">
//             <h1 className="text-3xl font-bold mb-8">Edit Problem</h1>

//             <div className="bg-white rounded-lg shadow p-6">
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                         <FormField
//                             control={form.control}
//                             name="title"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Title</FormLabel>
//                                     <FormControl>
//                                         <Input {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="description"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Description</FormLabel>
//                                     <FormControl>
//                                         <Textarea {...field} className="min-h-[100px]" />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <div className="grid grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="inputFormat"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Input Format</FormLabel>
//                                         <FormControl>
//                                             <Textarea {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="outputFormat"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Output Format</FormLabel>
//                                         <FormControl>
//                                             <Textarea {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="exampleInput"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Example Input</FormLabel>
//                                         <FormControl>
//                                             <Textarea {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="exampleOutput"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Example Output</FormLabel>
//                                         <FormControl>
//                                             <Textarea {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <FormField
//                             control={form.control}
//                             name="constraints"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Constraints</FormLabel>
//                                     <FormControl>
//                                         <Textarea {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="difficulty"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Difficulty</FormLabel>
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select difficulty" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem value="easy">Easy</SelectItem>
//                                             <SelectItem value="medium">Medium</SelectItem>
//                                             <SelectItem value="hard">Hard</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <div className="flex justify-end gap-4">
//                             <Button variant="outline" type="button">
//                                 Cancel
//                             </Button>
//                             <Button type="submit">Save Changes</Button>
//                         </div>
//                     </form>
//                 </Form>
//             </div>
//         </div>
//     );
// }

import React from 'react'

const page = () => {
    return (
        <div>page</div>
    )
}

export default page