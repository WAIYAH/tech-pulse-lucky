export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const softwareEngineeringGlossary: GlossaryTerm[] = [
  {
    term: "Idempotent",
    definition:
      "An operation that produces the same result no matter how many times you run it — like setting a value to 5, versus incrementing it by 1.",
  },
  {
    term: "Technical Debt",
    definition:
      "The extra rework a team takes on later because they chose a quick fix now instead of a better, slower solution.",
  },
  {
    term: "Race Condition",
    definition:
      "A bug that happens when two processes access shared data at the same time, and the outcome depends on unpredictable timing.",
  },
  {
    term: "Big O Notation",
    definition:
      "A way of describing how much slower or more memory-hungry an algorithm gets as its input grows, ignoring constant factors.",
  },
  {
    term: "REST",
    definition:
      "Representational State Transfer — an architectural style for web APIs where resources are addressed by URLs and manipulated with standard HTTP verbs.",
  },
  {
    term: "Dependency Injection",
    definition:
      "A design pattern where a component receives the things it depends on from the outside, instead of creating them itself — making code easier to test.",
  },
  {
    term: "Polymorphism",
    definition:
      "The ability of different objects to respond to the same method call in their own way, letting code work with many types through one shared interface.",
  },
  {
    term: "Immutability",
    definition:
      "A property of data that can't be changed after it's created — instead of modifying it, you create a new copy with the change applied.",
  },
  {
    term: "CI/CD",
    definition:
      "Continuous Integration / Continuous Deployment — automatically testing and shipping code changes as soon as they're merged, instead of in big manual batches.",
  },
  {
    term: "Refactoring",
    definition:
      "Restructuring existing code to make it cleaner or easier to work with, without changing what it actually does from the outside.",
  },
  {
    term: "API",
    definition:
      "Application Programming Interface — a defined way for one piece of software to ask another piece of software to do something or share data.",
  },
  {
    term: "Encapsulation",
    definition:
      "Bundling data with the methods that operate on it, and hiding the internal details so other code only interacts through a controlled interface.",
  },
  {
    term: "Recursion",
    definition:
      "A function solving a problem by calling itself on a smaller version of that same problem, until it hits a simple base case.",
  },
  {
    term: "Memoization",
    definition:
      "Caching the results of expensive function calls so that the next time the same input comes in, you return the saved answer instead of recomputing it.",
  },
  {
    term: "Design Pattern",
    definition:
      "A reusable, named solution to a problem that comes up again and again in software design — a shared vocabulary for common approaches.",
  },
  {
    term: "Version Control",
    definition:
      "A system (like Git) that tracks every change to a codebase over time, so teams can collaborate, review history, and undo mistakes safely.",
  },
  {
    term: "Unit Test",
    definition:
      "An automated test that checks one small, isolated piece of code — usually a single function — behaves correctly on its own.",
  },
  {
    term: "Regression Bug",
    definition:
      "A bug where something that used to work correctly breaks again, usually introduced by a later, unrelated change.",
  },
  {
    term: "Load Balancer",
    definition:
      "A component that spreads incoming traffic across multiple servers, so no single machine gets overwhelmed and the system stays responsive.",
  },
  {
    term: "Cache",
    definition:
      "A temporary storage layer that keeps a copy of frequently used data close at hand, so future requests for it are much faster.",
  },
  {
    term: "Microservices",
    definition:
      "An architecture where an application is split into many small, independently deployable services instead of one large program.",
  },
  {
    term: "Monolith",
    definition:
      "An application built and deployed as a single, unified codebase — simpler to start with than microservices, but harder to scale piece by piece.",
  },
  {
    term: "ORM",
    definition:
      "Object-Relational Mapping — a tool that lets you work with a database using your programming language's objects, instead of writing raw SQL.",
  },
  {
    term: "Middleware",
    definition:
      "Code that sits between a request coming in and the final response going out, handling cross-cutting tasks like authentication or logging.",
  },
  {
    term: "Webhook",
    definition:
      "A way for one system to notify another automatically by sending an HTTP request the moment something happens, instead of being asked repeatedly.",
  },
  {
    term: "MVP",
    definition:
      "Minimum Viable Product — the smallest version of a product that still delivers real value, built to test an idea before investing further.",
  },
  {
    term: "Rubber Duck Debugging",
    definition:
      "A technique where explaining your code line by line to an inanimate object (traditionally a rubber duck) helps you spot the bug yourself.",
  },
  {
    term: "YAGNI",
    definition:
      "\"You Aren't Gonna Need It\" — a reminder not to build functionality on the assumption you might need it later, only build what's actually required now.",
  },
  {
    term: "DRY",
    definition:
      "\"Don't Repeat Yourself\" — a principle that every piece of logic should exist in exactly one place, so changes don't need to be made in multiple spots.",
  },
  {
    term: "SOLID Principles",
    definition:
      "Five object-oriented design guidelines (Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion) for maintainable code.",
  },
  {
    term: "Garbage Collection",
    definition:
      "An automatic process where a programming language reclaims memory that's no longer being used, so developers don't have to free it manually.",
  },
  {
    term: "Concurrency",
    definition:
      "The ability of a program to deal with multiple tasks that are in progress at overlapping times, whether or not they literally run at the same instant.",
  },
  {
    term: "Latency",
    definition:
      "The delay between a request being sent and a response arriving — lower latency means the system feels faster to the user.",
  },
  {
    term: "Throughput",
    definition:
      "The amount of work a system can process in a given amount of time — for example, how many requests per second a server can handle.",
  },
  {
    term: "Async/Await",
    definition:
      "Syntax that lets you write code that waits for a slow operation (like a network call) without blocking everything else, while still reading top to bottom.",
  },
  {
    term: "Null Pointer Exception",
    definition:
      "An error that happens when code tries to use a value that doesn't actually exist yet — one of the most common bugs across many languages.",
  },
  {
    term: "Sandboxing",
    definition:
      "Running code in an isolated environment with limited permissions, so that even if something goes wrong, it can't affect the rest of the system.",
  },
  {
    term: "Code Smell",
    definition:
      "A pattern in code that isn't necessarily a bug, but hints that something might be wrong underneath and could be worth refactoring.",
  },
  {
    term: "Hashing",
    definition:
      "Converting data of any size into a fixed-size string of characters, used for things like quickly comparing values or storing passwords securely.",
  },
  {
    term: "Endpoint",
    definition:
      "A specific URL where an API can be accessed — each endpoint usually corresponds to one particular action or resource.",
  },
];
