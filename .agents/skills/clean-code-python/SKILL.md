---
name: clean-code-python
description: Clean Code principles for Python (adapted from Robert C. Martin by zedr/clean-code-python) covering naming, functions, SOLID classes, and DRY. Use when writing, reviewing, or refactoring Python code, or when the user mentions clean code, readable Python, SOLID, code smells, or naming.
---

# Clean Code Python

Source: https://github.com/zedr/clean-code-python. These are guidelines, not laws. Apply the ones that make the code at hand easier to read, test, and change. Do not refactor untouched code just to match.

## Quick checklist

Run this on any Python you write or review:

1. **Names** are pronounceable, searchable, and say what the thing is. No type in the name (`ymdstr`), no repeated class context (`Car.car_make`), one word per concept (`user`, not `client`/`customer`).
2. **No magic values.** `86400` becomes `SECONDS_IN_A_DAY = 60 * 60 * 24`.
3. **Functions do one thing**, at one level of abstraction. Name says what it does (`send`, not `handle`).
4. **2 or fewer arguments.** More: bundle into a `dataclass`, `NamedTuple`, or `TypedDict`.
5. **No boolean flag arguments.** Split into two functions.
6. **No side effects.** No `global`, no mutating inputs. Return a new value. Keep unavoidable I/O in one place.
7. **Defaults over conditionals.** `def f(name: str = "x")`, not `name = "x" if name is None else name`.
8. **Classes**: one reason to change (SRP), extend without editing (OCP), subtypes honor the parent contract (LSP), small interfaces (ISP), depend on abstractions (DIP).
9. **No duplication.** Merge near-identical code into one abstraction, but only when it is a real shared concept.

## Workflow: review or refactor

1. Read the code. Find the smells from the checklist, worst first.
2. For each smell, pick the matching fix in [REFERENCE.md](REFERENCE.md).
3. Keep behavior the same. Run tests before and after.
4. Report each change as one line: location, smell, fix.

## Quick example

```python
# Bad: flag, side effect, magic number, vague name
def handle(clients, flag):
    for c in clients:
        if c.active and flag:
            send(c, 86400)

# Good: one job each, named values
SECONDS_IN_A_DAY = 60 * 60 * 24

def active_clients(clients):
    return (client for client in clients if client.active)

def email_clients(clients):
    for client in active_clients(clients):
        email(client, retry_after=SECONDS_IN_A_DAY)
```

## Project rules win

If the repo has its own style rules (CLAUDE.md, AGENTS.md, linter config), follow them where they differ from this skill. For example, "extract only when a pattern repeats 3 times" overrides rule 9 for small duplication.

## More detail

Before/after code for every rule, grouped by Variables, Functions, Classes (SOLID), and DRY: see [REFERENCE.md](REFERENCE.md).
