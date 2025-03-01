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
        constraints: "1 ≤ N ≤ 10"
    },
    {
        id: "2",
        title: "Sum of Digits",
        description: "Find the sum of the digits of a given integer.",
        inputFormat: "A single integer N (1 ≤ N ≤ 10000).",
        outputFormat: "Sum of the digits of N.",
        exampleInput: "1234",
        exampleOutput: "10",
        constraints: "1 ≤ N ≤ 10000"
    },
    {
        id: "3",
        title: "Reverse a Number",
        description: "Reverse the digits of an integer.",
        inputFormat: "A single integer N.",
        outputFormat: "The reversed integer.",
        exampleInput: "1234",
        exampleOutput: "4321",
        constraints: "1 ≤ N ≤ 100000"
    },
    {
        id: "4",
        title: "Check Prime Number",
        description: "Determine if a number is prime.",
        inputFormat: "A single integer N (1 ≤ N ≤ 10^6).",
        outputFormat: "Yes if N is prime, otherwise No.",
        exampleInput: "7",
        exampleOutput: "Yes",
        constraints: "1 ≤ N ≤ 10^6"
    },
    {
        id: "5",
        title: "Fibonacci Series",
        description: "Find the Nth Fibonacci number.",
        inputFormat: "A single integer N (1 ≤ N ≤ 30).",
        outputFormat: "The Nth Fibonacci number.",
        exampleInput: "6",
        exampleOutput: "8",
        constraints: "1 ≤ N ≤ 30"
    },
    {
        id: "6",
        title: "Greatest Common Divisor",
        description: "Find the GCD of two numbers.",
        inputFormat: "Two integers A and B.",
        outputFormat: "The greatest common divisor of A and B.",
        exampleInput: "10 15",
        exampleOutput: "5",
        constraints: "1 ≤ A, B ≤ 10^5"
    },
    {
        id: "7",
        title: "LCM of Two Numbers",
        description: "Find the least common multiple of two numbers.",
        inputFormat: "Two integers A and B.",
        outputFormat: "The least common multiple of A and B.",
        exampleInput: "4 6",
        exampleOutput: "12",
        constraints: "1 ≤ A, B ≤ 10^5"
    },
    {
        id: "8",
        title: "Armstrong Number",
        description: "Check if a number is an Armstrong number.",
        inputFormat: "A single integer N.",
        outputFormat: "Yes if N is an Armstrong number, otherwise No.",
        exampleInput: "153",
        exampleOutput: "Yes",
        constraints: "1 ≤ N ≤ 100000"
    },
    {
        id: "9",
        title: "Palindrome Number",
        description: "Check if a number is a palindrome.",
        inputFormat: "A single integer N.",
        outputFormat: "Yes if N is a palindrome, otherwise No.",
        exampleInput: "121",
        exampleOutput: "Yes",
        constraints: "1 ≤ N ≤ 10^6"
    },
    {
        id: "10",
        title: "Binary to Decimal",
        description: "Convert a binary number to decimal.",
        inputFormat: "A binary number as a string.",
        outputFormat: "The decimal representation of the binary number.",
        exampleInput: "1010",
        exampleOutput: "10",
        constraints: "1 ≤ length of binary string ≤ 32"
    },
    {
        id: "11",
        title: "Decimal to Binary",
        description: "Convert a decimal number to binary.",
        inputFormat: "A single integer N.",
        outputFormat: "The binary representation of N.",
        exampleInput: "10",
        exampleOutput: "1010",
        constraints: "1 ≤ N ≤ 1000"
    },
    {
        id: "12",
        title: "Count Vowels",
        description: "Count the number of vowels in a string.",
        inputFormat: "A single string S.",
        outputFormat: "The count of vowels in S.",
        exampleInput: "hello",
        exampleOutput: "2",
        constraints: "1 ≤ length of S ≤ 100"
    },
    {
        id: "13",
        title: "String Reverse",
        description: "Reverse a given string.",
        inputFormat: "A single string S.",
        outputFormat: "The reversed string.",
        exampleInput: "hello",
        exampleOutput: "olleh",
        constraints: "1 ≤ length of S ≤ 100"
    },
    {
        id: "14",
        title: "Second Largest Number",
        description: "Find the second largest number in an array.",
        inputFormat: "An array of N integers.",
        outputFormat: "The second largest number.",
        exampleInput: "10 20 4 45 99",
        exampleOutput: "45",
        constraints: "2 ≤ N ≤ 1000"
    },
    {
        id: "15",
        title: "Sum of Array",
        description: "Find the sum of elements in an array.",
        inputFormat: "An array of N integers.",
        outputFormat: "The sum of elements in the array.",
        exampleInput: "1 2 3 4 5",
        exampleOutput: "15",
        constraints: "1 ≤ N ≤ 1000"
    },
    {
        id: "16",
        title: "Find Missing Number",
        description: "Find the missing number in a sequence from 1 to N.",
        inputFormat: "An array of N-1 distinct integers from 1 to N.",
        outputFormat: "The missing number.",
        exampleInput: "1 2 4 5",
        exampleOutput: "3",
        constraints: "2 ≤ N ≤ 1000"
    },
    {
        id: "17",
        title: "Check Anagram",
        description: "Check if two strings are anagrams.",
        inputFormat: "Two strings S1 and S2.",
        outputFormat: "Yes if they are anagrams, otherwise No.",
        exampleInput: "listen silent",
        exampleOutput: "Yes",
        constraints: "1 ≤ length of S1, S2 ≤ 100"
    },
    {
        id: "18",
        title: "Count Words",
        description: "Count the number of words in a given sentence.",
        inputFormat: "A string representing a sentence.",
        outputFormat: "The word count.",
        exampleInput: "Hello world!",
        exampleOutput: "2",
        constraints: "1 ≤ length of sentence ≤ 1000"
    },
    {
        id: "19",
        title: "Matrix Transpose",
        description: "Find the transpose of a given matrix.",
        inputFormat: "A N×M matrix.",
        outputFormat: "The transposed matrix.",
        exampleInput: "[[1, 2], [3, 4]]",
        exampleOutput: "[[1, 3], [2, 4]]",
        constraints: "1 ≤ N, M ≤ 10"
    },
    {
        id: "20",
        title: "Sum of Digits Until One Digit",
        description: "Repeatedly sum the digits of a number until a single digit is obtained.",
        inputFormat: "A single integer N.",
        outputFormat: "The single digit sum.",
        exampleInput: "9875",
        exampleOutput: "2",
        constraints: "1 ≤ N ≤ 10^9"
    }
];
