#include <iostream>
using namespace std;
int main() {
    string name;
    int age;
    float number;

    cout << "Enter your name: ";
    cin >> name;
    cout  << "Enter your age: ";
    cin >> age;
    cout << "Enter your favourite number: ";
    cin >> number;

    cout << "My name is "<< name << "."<< "I am " << age << " years old. "<< "My favourite number is "<< number;

    return 0;

}