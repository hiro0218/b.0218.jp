# Expert Principles on Code Comments

This document summarizes code comment principles from renowned software engineers and authors.

## Robert C. Martin (Uncle Bob) - "Clean Code"

### Core Philosophy

**"Comments are a failure"** - Comments represent our inability to express intent in code.

> "Don't comment bad code—rewrite it."

### Good Comments

1. **Legal comments**: Copyright, license notices
2. **Informative comments**: Regex patterns, algorithm explanations
3. **Explanation of intent**: Why this implementation was chosen
4. **Warning comments**: Serious side effects
5. **TODO comments**: Future improvements

### Bad Comments

1. **Mumbling**: Meaningless rambling
2. **Redundant comments**: Repeating what code says
3. **Misleading comments**: Contradicting the code
4. **Commented-out code**: Delete it instead

**Key Insight**: When tempted to write a comment, try extracting a function with a clear name instead.

---

## Martin Fowler - "Refactoring"

### Core Philosophy

**"Need for comments is a code smell"** - Comment needs signal refactoring opportunities.

> "When you feel the need to write a comment, first try to refactor the code so that any comment becomes superfluous."

### Refactoring Alternatives

| Instead of commenting... | Try this refactoring... |
| ------------------------ | ----------------------- |
| Long explanatory comment | Extract Method          |
| Variable explanation     | Rename Variable         |
| Precondition comment     | Introduce Assertion     |
| Complex logic comment    | Decompose Conditional   |

**Key Insight**: Comments often indicate that code structure needs improvement.

---

## Jeff Atwood (Coding Horror)

### Core Philosophy

**"Code tells HOW, comments tell WHY"**

> "Code tells you how; comments tell you why."

### Comment Hierarchy

- **Code itself**: Explains WHAT is happening
- **Comments**: Explain WHY it's happening this way
- **Documentation**: Explains architectural decisions

**Key Insight**: Never comment on the "what" or "how"—only the "why" and context.

---

## Steve McConnell - "Code Complete"

### Core Philosophy

**"Comments should elevate abstraction level"**

> "Good code is its own best documentation."

### Effective Comments

1. **Summary comments**: High-level overview of complex logic
2. **Intent comments**: Purpose of the code section
3. **Warning comments**: Important side effects or constraints

### Comment Guidelines

- Explain at a **higher level of abstraction** than the code
- **Don't repeat** what's obvious from code (DRY principle)
- **Keep updated** (outdated comments are harmful)

**Key Insight**: Comments should add information not present in code itself.

---

## Linus Torvalds - Linux Kernel Style

### Core Philosophy

**"Explain design decisions, not implementation details"**

> "Comments should explain 'why', not 'what' or 'how'."

### Kernel Coding Standards

Good comments explain:

- **Complex algorithms**: Why this approach was chosen
- **Non-obvious optimizations**: Performance rationale
- **Hardware constraints**: Why specific implementation is required
- **Trade-offs**: Why alternative approaches were rejected

Bad comments explain:

- What the code does (code does this)
- How it works (read the code)
- Implementation details (obvious from syntax)

**Key Insight**: Document design rationale and trade-offs, especially for non-obvious optimizations.

---

## John Carmack - id Software

### Core Philosophy

**"Small functions eliminate comment needs"**

> "Sometimes, the elegant implementation is just a function. Not a method. Not a class. Not a framework. Just a function."

### Approach

1. **Data-driven design**: Clear data structures over comments
2. **Type safety**: Use types to express constraints
3. **Functional approach**: Pure functions are self-documenting
4. **Small functions**: Each does one thing clearly

**Key Insight**: Well-structured code with clear function boundaries needs minimal comments.

---

## Consensus Principles

All experts agree on:

1. **Comments are a last resort**, not first choice
2. **Code should be self-explanatory** through good naming and structure
3. **WHY > WHAT**: Comments explain rationale, not mechanics
4. **Outdated comments are worse than no comments**
5. **Refactoring often eliminates comment needs**

## When Comments ARE Necessary

Despite minimalism, all experts acknowledge comments are essential for:

- **Public APIs**: Contract documentation (JSDoc, etc.)
- **Non-obvious optimizations**: Performance trade-offs
- **Business logic**: Domain-specific rules
- **Workarounds**: Why the "normal" approach doesn't work
- **TODOs**: Known improvements or limitations
