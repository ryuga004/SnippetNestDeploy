import { CodingProblemType } from "./types";

export const problems: CodingProblemType[] = [
    {
        id: "1",
        title: "Factorial Calculation",
        description: "Compute the factorial of a given number.",
        inputFormat: "A single integer N (1 ≤ N ≤ 10).",
        outputFormat: "The factorial of N.",
        exampleInput: "5",
        exampleOutput: "120",
        constraints: "1 ≤ N ≤ 10",
        difficuly: "easy",
        topic: ["Mathematics"],
        testCases: [
            { input: "1", expectedOutput: "1" },
            { input: "2", expectedOutput: "2" },
            { input: "3", expectedOutput: "6" },
            { input: "4", expectedOutput: "24" },
            { input: "5", expectedOutput: "120" }
        ]
    },
    {
        id: "2",
        title: "Sum of Digits",
        description: "Find the sum of the digits of a given integer.",
        inputFormat: "A single integer N (1 ≤ N ≤ 10000).",
        outputFormat: "Sum of the digits of N.",
        exampleInput: "1234",
        exampleOutput: "10",
        constraints: "1 ≤ N ≤ 10000",
        difficuly: "easy",
        topic: ["Mathematics"],
        testCases: [
            { input: "1234", expectedOutput: "10" },
            { input: "9999", expectedOutput: "36" },
            { input: "1001", expectedOutput: "2" },
            { input: "56", expectedOutput: "11" },
            { input: "5", expectedOutput: "5" }
        ]
    },
    {
        id: "3",
        title: "Reverse a Number",
        description: "Reverse the digits of an integer.",
        inputFormat: "A single integer N.",
        outputFormat: "The reversed integer.",
        exampleInput: "1234",
        exampleOutput: "4321",
        constraints: "1 ≤ N ≤ 100000",
        difficuly: "easy",
        topic: ["Mathematics"],
        testCases: [
            { input: "1234", expectedOutput: "4321" },
            { input: "5678", expectedOutput: "8765" },
            { input: "100", expectedOutput: "1" },
            { input: "909", expectedOutput: "909" },
            { input: "500", expectedOutput: "5" }
        ]
    },
    {
        id: "4",
        title: "Check Prime Number",
        description: "Determine if a number is prime.",
        inputFormat: "A single integer N (1 ≤ N ≤ 10^6).",
        outputFormat: "Yes if N is prime, otherwise No.",
        exampleInput: "7",
        exampleOutput: "Yes",
        constraints: "1 ≤ N ≤ 10^6",
        difficuly: "medium",
        topic: ["Mathematics"],
        testCases: [
            { input: "2", expectedOutput: "Yes" },
            { input: "4", expectedOutput: "No" },
            { input: "17", expectedOutput: "Yes" },
            { input: "20", expectedOutput: "No" },
            { input: "23", expectedOutput: "Yes" }
        ]
    },
    {
        id: "5",
        title: "Fibonacci Series",
        description: "Find the Nth Fibonacci number.",
        inputFormat: "A single integer N (1 ≤ N ≤ 30).",
        outputFormat: "The Nth Fibonacci number.",
        exampleInput: "6",
        exampleOutput: "8",
        constraints: "1 ≤ N ≤ 30",
        difficuly: "medium",
        topic: ["Mathematics"],
        testCases: [
            { input: "1", expectedOutput: "1" },
            { input: "2", expectedOutput: "1" },
            { input: "3", expectedOutput: "2" },
            { input: "4", expectedOutput: "3" },
            { input: "5", expectedOutput: "5" }
        ]
    },
    {
        id: "6",
        title: "Palindrome Check",
        description: "Check if a string is a palindrome.",
        inputFormat: "A single string S.",
        outputFormat: "Yes if S is a palindrome, otherwise No.",
        exampleInput: "madam",
        exampleOutput: "Yes",
        constraints: "1 ≤ |S| ≤ 100",
        difficuly: "easy",
        topic: ["Strings"],
        testCases: [
            { input: "madam", expectedOutput: "Yes" },
            { input: "hello", expectedOutput: "No" },
            { input: "level", expectedOutput: "Yes" },
            { input: "rotor", expectedOutput: "Yes" },
            { input: "abcba", expectedOutput: "Yes" }
        ]
    },
    {
        id: "7",
        title: "Find Maximum Element",
        description: "Find the maximum element in an array.",
        inputFormat: "An array of integers A.",
        outputFormat: "The maximum element in A.",
        exampleInput: "1 5 3 9 2",
        exampleOutput: "9",
        constraints: "1 ≤ |A| ≤ 100",
        difficuly: "easy",
        topic: ["Arrays"],
        testCases: [
            { input: "1 5 3 9 2", expectedOutput: "9" },
            { input: "10 2 5 1", expectedOutput: "10" },
            { input: "1 1 1 1", expectedOutput: "1" },
            { input: "5", expectedOutput: "5" },
            { input: "-1 -5 -2", expectedOutput: "-1" }
        ]
    },
    {
        id: "8",
        title: "String Reverse",
        description: "Reverse a given string.",
        inputFormat: "A single string S.",
        outputFormat: "The reversed string.",
        exampleInput: "hello",
        exampleOutput: "olleh",
        constraints: "1 ≤ |S| ≤ 100",
        difficuly: "easy",
        topic: ["Strings"],
        testCases: [
            { input: "hello", expectedOutput: "olleh" },
            { input: "world", expectedOutput: "dlrow" },
            { input: "abc", expectedOutput: "cba" },
            { input: "a", expectedOutput: "a" },
            { input: "", expectedOutput: "" }
        ]
    },
    {
        id: "9",
        title: "Count Vowels",
        description: "Count the number of vowels in a string.",
        inputFormat: "A single string S.",
        outputFormat: "The number of vowels in S.",
        exampleInput: "hello",
        exampleOutput: "2",
        constraints: "1 ≤ |S| ≤ 100",
        difficuly: "easy",
        topic: ["Strings"],
        testCases: [
            { input: "hello", expectedOutput: "2" },
            { input: "aeiou", expectedOutput: "5" },
            { input: "xyz", expectedOutput: "0" },
            { input: "programming", expectedOutput: "3" },
            { input: "", expectedOutput: "0" }
        ]
    },
    {
        id: "10",
        title: "Binary Search",
        description: "Perform binary search on a sorted array.",
        inputFormat: "A sorted array A and a target value T.",
        outputFormat: "The index of T in A, or -1 if not found.",
        exampleInput: "1 3 5 7 9, 5",
        exampleOutput: "2",
        constraints: "1 ≤ |A| ≤ 100, A is sorted",
        difficuly: "hard",
        topic: ["Algorithms", "Arrays"],
        testCases: [
            { "input": "1 3 5 7 9, 5", "expectedOutput": "2" },
            { "input": "2 4 6 8 10, 6", "expectedOutput": "2" },
            { "input": "1 2 3 4 5 6 7 8 9 10, 10", "expectedOutput": "9" },
            { "input": "10 20 30 40 50, 25", "expectedOutput": "-1" },
            { "input": "5, 5", "expectedOutput": "0" }
        ]
    }
]