public @interface Main {
    import java.util.Scanner;

    public static void main(String[] args) {
        // Create a Scanner object to read user input
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter an integer n: ");
        // Read the integer input
        int n = scanner.nextInt();
        
        System.out.println("Printing numbers from 1 to " + n + ":");
        // For loop to print up to n (inclusive)
        for (int i = 1; i <= n; i++) {
            System.out.print(i + " ");
        }
        System.out.println(); // Print a newline at the end
        
        scanner.close();
    }
}

}
