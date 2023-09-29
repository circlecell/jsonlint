---
title: "Common JSON Mistakes and How to Avoid Them"
description: "Avoid common mistakes. See tooling options such as JSONLint - the trusted validator and reformatter for error-free code."
---

# Common JSON Mistakes and How to Avoid Them

## Introduction

JSON, short for JavaScript Object Notation, is a widely used open-standard format for representing structured data in a human-readable and compact manner. It enables the interchange of complex data structures between systems and has a diverse range of applications. Although it resembles readable text, not all systems use it for data communication.

Furthermore, it's advisable to be aware of some common mistakes that occur when working with this format. We'll explore these mistakes and provide tips on how to avoid them. Even though, we'll mostly rely on tooling to detect and correct these mishaps, having a solid understanding of how they happen is a valuable prerequisite.


## Inconsistent Key Naming Conventions

One such common mistake is the inconsistent use of key naming conventions. JSON keys should follow a consistent naming pattern throughout your code, such as **camelCase**, **snake_case**, or **kebab-case**. Mixing different naming conventions can lead to confusion and negatively impact readability and maintenance.

#### A Bad Example


```json
{
  "firstName": "Douglas",
  "last_name": "Crockford",
  "email-address": "doug.mock@example.com"
}
```

#### The Proper Approach

Choose a consistent naming convention for your JSON keys and stick to it. For instance, you might decide to use **camelCase** for all keys.

```json
{
  "firstName": "Douglas",
  "lastName": "Crockford",
  "emailAddress": "doug.mock@example.com"
}
```


## Missing or Extra Commas

Another potential mishap is forgetting to add a comma between elements or accidentally including an extra comma at the end of a list or object. In JSON, commas are used to separate elements within objects and arrays. A missing comma can cause a parsing error, while an extra comma is considered invalid syntax.

#### A Bad Example

```json
{
  "name": "Tim",
  "age": 29
  "city": "New York",
  "hobbies": ["reading", "traveling",]
}
```

#### The Proper Approach

To avoid this mistake, double-check your JSON code for any missing or extra commas. Ensure that each element within an object or array is followed by a comma, except for the last element.

```json
{
  "name": "Tim",
  "age": 29,
  "city": "New York",
  "hobbies": ["reading", "traveling"]
}
```

## Improper Use of Quotes

The creator of JSON was pretty strict when it comes to consistency. Keys and string values must be enclosed in double quotes **"**, while single quotes **'** aren't allowed. Using single quotes or improperly quoting keys and values can lead to parsing errors.


#### A Bad Example

```json
{
  'title': 'Harry Potter and the Philosopher's Stone',
  "year": '1997',
  "author": ["J.K. Rowling"],
}
```

#### The Proper Approach

To fix this issue, make sure to use double quotes for all keys and string values. Additionally, be careful not to include quotes around numeric or boolean values, as this will change their data type to a string.

```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "year": 1997,
  "author": ["J.K. Rowling"],
  "price": 15.99
}
```

## Mismatched Brackets and Braces

Mismatched brackets(used for arrays) and braces (specific to objects), can lead to parsing errors in our code structures. It's crucial to have a corresponding closing bracket or brace for each opening one.

#### A Bad Example

```json
{
  "book": {
    "title": "The Lord of the Rings",
    "author": "J.R.R. Tolkien",
    "published_year": 1954,
    "characters": [
      "Frodo Baggins",
      "Gandalf",
      "Samwise Gamgee",
      "Aragorn",
      "Legolas",
      "Gimli",
      "Boromir"
    ],
  }
```

#### The Proper Approach

Carefully observe the nesting to ensure that all brackets and braces are correctly matched. In the above example, a closing brace is missing for the "book" object.

```json
{
  "book": {
    "title": "The Lord of the Rings",
    "author": "J.R.R. Tolkien",
    "published_year": 1954,
    "characters": [
      "Frodo Baggins",
      "Gandalf",
      "Samwise Gamgee",
      "Aragorn",
      "Legolas",
      "Gimli",
      "Boromir"
    ]
  }
}
```

## Invalid Data Types

JSON structure with incorrect data types could lead to unexpected results and errors and bring confusion to an already attention-demanding workflow. Moreover, JSON has a limited set of data types: strings, numbers, booleans, objects, arrays, and null. So, make sure that you're using the correct data types for your keys and values.

#### A Bad Example

```json
{
  "name": "Bob",
  "age": "23",
  "isStudent": "false",
  "courses": {
    "math": 101,
    "history": "201"
  }
}
```

#### The Proper Approach

Review and correct any data type inconsistencies. As we can see in the mock example, the "age" and "isStudent" values should be a number and a boolean, respectively, and the "history" course number should be a number as well.

```json
{
  "name": "Bob",
  "age": 23,
  "isStudent": false,
  "courses": {
    "math": 101,
    "history": 201
  }
}
```

## Incorrect Nesting of Objects and Arrays

Improperly nested objects and arrays in JSON code can lead to parsing errors, negatively impacting the readability and maintainability of the structure. To avoid these issues, it's a must that objects and arrays are correctly nested.

#### A Bad Example

```json
{
  "team": {
    "name": "Dream Team",
    "members": [
      "John",
      "Emma",
      "skills": {
        "John": ["Python", "JavaScript"],
        "Emma": ["Java", "C++"]
      }
    ]
  }
}
```

#### The Proper Approach

To prevent such errors, do meticulously reviews, and confirm that objects and arrays are nested in the right order. In the given example, the "skills" object must be placed outside the "members" array and nested correctly within the "team" object.

```json
{
  "team": {
    "name": "Dream Team",
    "members": ["John", "Emma"],
    "skills": {
      "John": ["Python", "JavaScript"],
      "Emma": ["Java", "C++"]
    }
  }
}
```


## Trailing Decimal Point in Numbers

JSON's possibilities allow for numbers to be represented in decimal, scientific, or integer notation. However, using a trailing decimal point without any digits following it is considered invalid syntax leading to parsing errors once again.


#### A Bad Example

```json
{
  "product": {
    "name": "Laptop",
    "price": 999.,
    "weight": 1.5
  }
}
```
#### The Proper Approach

So, to avoid such errors, have at least one digit following the decimal point. In the example above, the "price" value should include a digit after the decimal point:

```json
{
  "product": {
    "name": "Laptop",
    "price": 999.0,
    "weight": 1.5
  }
}
```

## Summary

What we saw in the previous sections was tailored to showcase the common errors through mock examples. But, JSON data can be quite verbose, especially when dealing with large datasets. To improve storage and transmission efficiency, we can leverage JSON data compression, which can significantly reduce the size of JSON files.

### Useful Links

[JSON Style Guide](https://google.github.io/styleguide/jsoncstyleguide.xml)