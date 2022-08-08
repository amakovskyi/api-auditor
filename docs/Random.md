_________________________________________

### Random.int

```
Random.int(maxInclusive: number): number
```

Generate integer number from ```0``` to ```maxInclusive```.

_________________________________________

### Random.intBetween

```
Random.intBetween(minInclusive: number, maxInclusive: number): number
```

Generate integer number from ```minInclusive``` to ```maxInclusive```.

_________________________________________

### Random.string

```
Random.string(length: number, randomLengthAdder: number = 0): string
```

Generate random string with length equal to: ```length``` with randomly added up to ```randomLengthAdder```.
Result contain lowercase and uppercase letters and numbers.

_________________________________________

### Random.text

```
Random.text(length: number = 64, randomLengthAdder: number = 64): string
```

Generate random string with length equal to: ```length``` with randomly added up to ```randomLengthAdder```.

Result contain words separated by space. Words contain lowercase and uppercase letters and numbers.

_________________________________________

### Random.uuid

```
Random.uuid(): string
```

Generate random string in UUID format.

_________________________________________

### Random.boolean

```
Random.boolean(trueThreshold: number = 0.5): boolean
```

_________________________________________

### RandomArray.singleItem

```
RandomArray.singleItem<T>(source: T[]): T
```

Get random single item from array

_________________________________________

### RandomArray.mixedCopyOf

```
RandomArray.mixedCopyOf<T>(source: T[]): T[]
```

Get copy of ```source``` with all it's items randomly mixed

_________________________________________

### RandomArray.someItems

```
RandomArray.someItems<T>(source: T[], length: number, randomLengthAdder: number = 0): T[]
```

Get array which containing randomly mixed part of ```source``` with length ```length``` plus randomly
added ```randomLengthAdder```

Get copy of ```source``` with all it's items randomly mixed

_________________________________________

### RandomArray.splitAll

```
RandomArray.splitAll<T>(source: T[], resultArraysCount: number, equally: boolean = false): T[][]
```

Randomly split ```source``` to ```resultArraysCount``` arrays.

When ```equally``` set to FALSE then result array lengths may be any, but not less than ```1```.
When ```equally``` set to TRUE then result array lengths are equal or near equal (if equal split is impossible).

_________________________________________

### RandomArray.splitToLengths

```
RandomArray.splitToLengths<T>(source: T[], lengths: number[]): T[][] 
```

Randomly split ```source``` to an arrays with exactly specified by ```lengths``` lengths.

Sum of ```lengths``` should be less or equal than length of ```source``` as split is distinctive.

_________________________________________

### RandomArray splitToLengthsWithOverlap

```
RandomArray.splitToLengthsWithOverlap<T>(source: T[], lengths: number[]): T[][] 
```

Randomly split ```source``` to an arrays with exactly specified by ```lengths``` lengths, but allows item overlaps.
