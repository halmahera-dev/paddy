# Clean Code Python: Reference

Examples use modern hints (`list[str]` needs 3.9+, `X | None` needs 3.10+). The original repo targets 3.7+. Source: https://github.com/zedr/clean-code-python

## Variables

**Meaningful names, no type in the name**

```python
ymdstr = datetime.date.today().strftime("%y-%m-%d")        # bad
current_date: str = datetime.date.today().strftime("%y-%m-%d")  # good
```

**One vocabulary per concept.** Not `get_user_info`, `get_client_data`, `get_customer_record`. Better: put it on the entity.

```python
class User:
    info: str

    @property
    def data(self) -> dict: ...

    def get_record(self) -> Record | None: ...
```

**Searchable names / no magic numbers**

```python
time.sleep(86400)                      # bad
SECONDS_IN_A_DAY = 60 * 60 * 24
time.sleep(SECONDS_IN_A_DAY)           # good
```

**Explanatory variables.** Name regex groups and unpack results.

```python
city_zip_code_regex = r"^[^,\\]+[,\\\s]+(?P<city>.+?)\s*(?P<zip_code>\d{5})?$"
matches = re.match(city_zip_code_regex, address)
if matches:
    print(f"{matches['city']}, {matches['zip_code']}")
```

**No mental mapping.** `for location in locations`, not `for item in seq`.

**No unneeded context.** `Car.make`, not `Car.car_make`.

**Defaults over short-circuiting**

```python
def create_micro_brewery(name: str = "Hipster Brew Co."):
    slug = hashlib.sha1(name.encode()).hexdigest()
```

## Functions

**Do one thing.** Split filtering from emailing. A generator avoids building a list.

```python
def active_clients(clients):
    return (client for client in clients if client.active)

def email_clients(clients):
    for client in active_clients(clients):
        email(client)
```

**2 or fewer arguments.** Bundle many into one object:

```python
from dataclasses import dataclass

@dataclass
class MenuConfig:
    title: str
    body: str
    button_text: str
    cancellable: bool = False

def create_menu(config: MenuConfig): ...

create_menu(MenuConfig(title="Menu", body="Items", button_text="Order"))
```

Alternatives: `NamedTuple` (immutable), `TypedDict` (3.8+, dict-shaped data). Avoid passing a loose `dict` config.

**Names say what they do.** `Email.send()`, not `Email.handle()`.

**One level of abstraction.** The top function reads like an outline:

```python
def parse(code: str) -> None:
    tokens = tokenize(code)
    syntax_tree = build_tree(tokens)
    for node in syntax_tree: ...
```

**No flags.** A boolean parameter means two code paths. Split:

```python
def create_file(name: str) -> None:
    Path(name).touch()

def create_temp_file(name: str) -> None:
    (Path(gettempdir()) / name).touch()
```

**Avoid side effects.** Never `global fullname` then reassign. Return the value:

```python
def split_into_first_and_last_name(name: str) -> list[str]:
    return name.split()
```

If state is needed, hold it in an instance. Centralize file/network writes in one service.

## Classes (SOLID)

**SRP: one reason to change.** Split a class that both authenticates and manages settings:

```python
class UserAuth:
    def __init__(self, user): self.user = user
    def verify_credentials(self): ...

class UserSettings:
    def __init__(self, user):
        self.user = user
        self.auth = UserAuth(user)
    def change_settings(self, settings):
        if self.auth.verify_credentials(): ...
```

**OCP: extend, do not edit.** Replace `if/elif` on type with polymorphism:

```python
class Adapter:
    name: str

class AjaxAdapter(Adapter):
    name = "ajaxAdapter"

class HttpRequester:
    def __init__(self, adapter: Adapter):
        self.adapter = adapter

    def fetch(self, url: str):
        return self.adapter.request(url)   # new adapter = new class, no edits here
```

**LSP: subtypes must be substitutable.** `Square` inheriting `Rectangle` breaks `set_width`/`set_height`. Use a shared `Shape` with `area()` and two siblings.

**ISP: small interfaces.** Do not force implementers to carry methods they ignore. Split a fat ABC into focused ones (e.g. a `Loadable` with only `load()` and `data`), or use `typing.Protocol` for what callers need.

**DIP: depend on abstractions.** Inject the dependency, typed as an ABC or `Protocol`:

```python
class Formatter(ABC):
    @abstractmethod
    def format(self, content: str) -> str: ...

class Printer:
    def __init__(self, formatter: Formatter):
        self.formatter = formatter

    def print(self, content: str) -> None:
        print(self.formatter.format(content))
```

## DRY

Two near-identical classes or loops (e.g. `Developer` and `Manager` that both compute `salary`, `experience`, and print them) become one `Employee` base or one function over a shared structure. Remove duplication only when the two pieces are the same concept. Wrong abstraction costs more than copy-paste.

```python
@dataclass
class Employee:
    name: str
    salary: int
    experience: int

for employee in [*developers, *managers]:
    print(employee.name, employee.salary, employee.experience)
```
