# Code Bricklayer
## Introduction

I designed this tool to reduce coding time, because I found some code with the same coding pattern.

## Usage

### Create A Blueprint

#### Basic Architecture

```
...
abc ${hole} $<abc ${hole}>
...
---
separator
hole-set
brick-set-0
brick-set-1
---
```

- `...`
  - The content between `...` is the structure of the house.
  - `${}`
    The content wrapped by `${}` describes a wall hole. The holes will be filled by fitting bricks. The `${hole}` will be replaced by the contents of the brick. You can refer to [Example A](#example-a) to understand the usage.
  - `$<>`
    The content wrapped by `$<>` describes a wall. `$<wall>` must wrap at least one `${hole}`. If all `${hole}` among them are not filled with any bricks, the `$<wall>` will be destroyed. You can refer to [Expample-B](#example-b) to understand the usage.
- `---`
  - The content between `---` describes the fitting relationship between holes and bricks.
    - The first row specifies a **separator** for splitting the holes and bricks.
    - The second row lists the holes wrapped by `${}`.
    - The subsequent rows are the fitting relationship of bricks to holes. If you want to build more houses, then you should make more bricks sets.

#### Example A

##### Blueprint

```
...
${a} == ${b}
...
---
,
a,b
1,2
3,4
---
```

##### Generated content

```
1 == 2
3 == 4
```

#### Example B

##### Blueprint

```
...
${a} $<== ${b}>
...
---
,
a,b
1,2
3
---
```

##### Generated content

```
1 == 2
3
```

## Known Issues


## Release Notes

### 1.0.0

Initial release of `codeBricklayer`.


