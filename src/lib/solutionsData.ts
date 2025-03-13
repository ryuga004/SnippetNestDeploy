import { Solution } from "./types";


export const solutions: Solution[] = [
    {
        id: "1",
        problem: { id: "1" },
        explanation: "The factorial of a number N is the product of all positive integers up to N. It can be calculated using recursion or iteration.",
        answer: [
            {
                language: "C++",
                code: `#include <iostream>
using namespace std;
long long factorial(int n) {
    return (n == 0 || n == 1) ? 1 : n * factorial(n - 1);
}
int main() {
    int n; cin >> n;
    cout << factorial(n) << endl;
}`
            },
            {
                language: "Python",
                code: `def factorial(n):
    return 1 if n == 0 or n == 1 else n * factorial(n - 1)

n = int(input())
print(factorial(n))`
            },
            {
                language: "Java",
                code: `import java.util.Scanner;
class Factorial {
    static long factorial(int n) {
        return (n == 0 || n == 1) ? 1 : n * factorial(n - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`
            }
        ]
    },
    {
        id: "2",
        problem: {
            id: "2"
        },
        explanation: "The sum of digits of a number is obtained by extracting each digit and adding them together.",
        answer: [
            {
                language: "C++",
                code: `#include <iostream>
using namespace std;
int sumOfDigits(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}
int main() {
    int n; cin >> n;
    cout << sumOfDigits(n) << endl;
}`
            },
            {
                language: "Python",
                code: `n = int(input())
print(sum(int(digit) for digit in str(n)))`
            },
            {
                language: "Java",
                code: `import java.util.Scanner;
class SumOfDigits {
    static int sumOfDigits(int n) {
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        return sum;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(sumOfDigits(n));
    }
}`
            }
        ]
    },
    {
        id: "3",
        problem: {
            id: "3"
        },
        explanation: "Reversing a number involves extracting digits and reconstructing the number in reverse order.",
        answer: [
            {
                language: "C++",
                code: `#include <iostream>
using namespace std;
int reverseNumber(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}
int main() {
    int n; cin >> n;
    cout << reverseNumber(n) << endl;
}`
            },
            {
                language: "Python",
                code: `n = int(input())
print(int(str(n)[::-1]))`
            },
            {
                language: "Java",
                code: `import java.util.Scanner;
class ReverseNumber {
    static int reverseNumber(int n) {
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        return rev;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(reverseNumber(n));
    }
}`
            }
        ]
    }
];
