# api-auditor

A NodeJS library for integration testing.

# Matchers. Validate API responses easily

**Matchers** API allows to easily validate objects.

EXAMPLE

Assume we need to validate API response.

```typescript
let response = client.get('https://api.com/myUserInfo')
```

Response content:

```json
{
  "id": "98837f2e-69f9-4083-b3f6-a9f90699a0bd",
  "firstName": "John",
  "lastName": "Doe",
  "numberOfPosts": 18,
  "description": null
}
```

It needed to validate only id format and first/last name.

Pure Jest way:

```typescript
expect(UuidUtils.isValid(response.id)).toBeThruly()
expect(response.firstName).toEqual('John')
expect(response.lastName).toEqual('Doe')
```

**api-auditor** matchers way:

```typescript
validateMatch(response, {
  id: Matchers.uuid(),
  firstName: 'John',
  lastName: 'Doe',
})
```

It needed to validate general response format.

Pure Jest way:

```typescript
expect(UuidUtils.isValid(response.id)).toBeThruly()
expect(typeof response.firstName).toEqual('string')
expect(typeof response.lastName).toEqual('string')
expect(typeof response.numberOfPosts).toEqual('number')
expect(Number.isInteger(response.numberOfPosts)).toBeThruly()
if (response.description != null) {
  expect(typeof response.description).toEqual('string')
}
```

**api-auditor** matchers way:

```typescript
validateMatch(response, {
  id: Matchers.uuid(),
  firstName: Matchers.string(),
  lastName: Matchers.string(),
  numberOfPosts: Matchers.number({ shouldBeInteger: true }),
  description: Matchers.string({ canBeNull: true }),
})
```

In addition to simple and clear way of writing the code there will be a clear and understandable diff in console log in
case of match error.

### HOW TO USE

```typescript
validateMatch(objectToValidate, expectedMatch)
```

```expectedMatch``` need contain only fields needed to validate. Anything else, which is not described
in ```expectedMatch``` but present in ```objectToValidate``` is ignored, so it is possible to put only those fields
which needed to be validated in ```objectToValidate```.

### VALUES

Place any primitive value to validate strict equality: ```undefined```, ```null```, ```string```,```number``` etc.

```typescript
validateMatch(objectToValidate, {
  index: 1,
  name: 'Some name',
  description: null,
})
```

### OBJECTS

Place object inside object or array to validate object contents. Fields, not included in match, are not validated.

```typescript
validateMatch(objectToValidate, {
  someInnerObject: {
    index: 1,
    id: Matchers.uuid(),
    name: 'Some name',
    innerItems: ArrayMatchers.any(),
  }
})
```

### ARRAYS

Place items inside array to validate array contents directly.

```typescript
validateMatch(arrayToValidate, [1, 2, 3])

validateMatch(arrayToValidate, [Matchers.number(), Matchers.string()])

validateMatch(arrayToValidate, [
  { index: 1, id: Matchers.uuid(), name: 'One' },
  { index: 2, id: Matchers.uuid(), name: 'Two' },
  { index: 3, id: Matchers.uuid(), name: 'Three' },
])
```

### VALUE MATCHERS

### Matchers.anything()

```
Matchers.anything()
```

Always successful validation.

### Matchers.equalsTo()

```
Matchers.equalsTo(other: any)
```

Validates strict equality to ```other```.

### Matchers.absent()

```
Matchers.absent()
```

Validates value is not present on place or strictly equal to ```undefined``` (```null``` cause validation fail).

### Matchers.absentOrNull()

```
Matchers.absentOrNull()
```

Validates value is not present on place, or strictly equal to ```undefined``` or ```null```.

### Matchers.anyDefined()

```
Matchers.anyDefined()
```

Validates value is present on place (```undefined``` or missing value cause validation fail, but ```null``` is
acceptable).

### Matchers.anyNotNull()

```
Matchers.anyNotNull()
```

Validates value is present on place (```undefined``` or missing value cause validation fail) and not ```null```.

### Matchers.object()

```
Matchers.object(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    match?: any
}
```

Validates value is JsonObject.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```match``` perform matching of object (useful when ```canBeNull``` or ```optional``` is set to TRUE)

### Matchers.string()

```
Matchers.string(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    canBeEmpty?: boolean
}
```

Validates value is type of ```string```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```canBeEmpty``` allows string to be empty (length=0); by default empty string not allowed

### Matchers.uuid()

```
Matchers.uuid(options?: {
    canBeNull?: boolean,
    optional?: boolean,
}
```

Validates value is type of ```string``` with UUID format.

* ```canBeNull``` allows value to be null
* ```optional``` allows value to be missing or ```undefined```

### Matchers.boolean()

```
Matchers.boolean(options?: {
    canBeNull?: boolean,
    optional?: boolean,
}
```

Validates value is type of ```boolean```.

* ```canBeNull``` allows value to be null
* ```optional``` allows value to be missing or ```undefined```

### Matchers.dateTime()

```
Matchers.dateTime(options?: {
    canBeNull?: boolean,
    optional?: boolean,
}
```

Validates value is type of ```string``` with default javascript ISO date-time format or value of class ```Date```.

* ```canBeNull``` allows value to be null
* ```optional``` allows value to be missing or ```undefined```

### Matchers.number()

```
Matchers.number(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    shouldBeInteger?: boolean,
    bounds?: {
        min?: number,
        max?: number
    },
    near?: {
        value: number,
        maxDifference: number,
    }
    canBeNaN?: boolean
}
```

Validates value is type of ```number```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```shouldBeInteger``` requires number to be integer
* ```bounds``` requires number to be inside bounds between ```min``` and ```max``` inclusive; allowed to set only lower
  or
  upper bound;
* ```near``` requires number to be near ```value``` with max allowed difference ```maxDifference```
* ```canBeNaN``` allows number to be ```NaN```

### ARRAY MATCHERS

### ArrayMatchers.any()

```
ArrayMatchers.any(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    requireNotEmpty?: boolean,
    expectedLength?: number,
    itemMatch?: any
}
```

Validates value is type of ```JsonArray```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```requireNotEmpty``` requires from array to be not empty
* ```expectedLength``` requires array length ot be exactly equal to ```expectedLength```
* ```itemMatch``` requires all items in array matches ```itemMatch```

### ArrayMatchers.uniqueItems()

```
ArrayMatchers.uniqueItems(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    requireNotEmpty?: boolean,
    expectedLength?: number,
    itemMatch?: any
}
```

Validates value is type of ```JsonArray``` and has unique items.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```requireNotEmpty``` requires from array to be not empty

### ArrayMatchers.containingAll()

```
ArrayMatchers.containingAll(expectedMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
    allowDuplicateMatch?: boolean,
}
```

Validates value is type of ```JsonArray``` and contains item match for each of ```expectedMatches```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```allowDuplicateMatch``` allows multiple array items to match same item of ```expectedMatches``` (by default matches
  should be distinctive)

### ArrayMatchers.containingAny()

```
ArrayMatchers.containingAny(expectedAnyMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
}
```

Validates value is type of ```JsonArray``` and contains at least single items match for any of ```expectedAnyMatches```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored

### ArrayMatchers.containingOnly()

```
ArrayMatchers.containingOnly(expectedMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
    allowDuplicateMatch?: boolean,
    requireAll?: boolean,
}
```

Validates value is type of ```JsonArray``` and contains only items which match any of ```expectedMatches```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored
* ```allowDuplicateMatch``` allows multiple array items to match same item of ```expectedMatches``` (by default matches
* ```requireAll``` requires that array contains matches to each of ```expectedMatches```

### ArrayMatchers.notContaining()

```
ArrayMatchers.notContaining(expectedNoMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
}
```

Validates value is type of ```JsonArray``` and NOT contains item matches for any of ```expectedNoMatches```.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored

### COMPOSITE MATCHERS

```
matchAll(matches: any[])
```

Matcher which validates object for all ```matches``` and raises first unmatched error in case if validation fail.

```
matchAny(matches: any[])
```

Matcher which validates object for first successful match from ```matches``` and raises error in case there are no
successful matches.

# Pool

// TODO

# Random

Useful random utils.

### Random.int()

```
Random.int(maxInclusive: number): number
```

Generate integer number from ```0``` to ```maxInclusive```.

### Random.intBetween()

```
Random.intBetween(minInclusive: number, maxInclusive: number): number
```

Generate integer number from ```minInclusive``` to ```maxInclusive```.

### Random.string()

```
Random.string(length: number, randomLengthAdder: number = 0): string
```

Generate random string with length equal to: ```length``` with randomly added up to ```randomLengthAdder```.
Result contain lowercase and uppercase letters and numbers.

### Random.text()

```
Random.text(length: number = 64, randomLengthAdder: number = 64): string
```

Generate random string with length equal to: ```length``` with randomly added up to ```randomLengthAdder```.

Result contain words separated by space. Words contain lowercase and uppercase letters and numbers.

### Random.uuid()

```
Random.uuid(): string
```

Generate random string in UUID format.

### Random.boolean()

```
Random.boolean(trueThreshold: number = 0.5): boolean
```

### RandomArray.singleItemFrom()

```
RandomArray.singleItemFrom<T>(source: T[]): T
```

Get random single item from array

### RandomArray.mixedCopyOf()

```
RandomArray.mixedCopyOf<T>(source: T[]): T[]
```

Get copy of ```source``` with all it's items randomly mixed

### RandomArray.someItemsFrom()

```
RandomArray.someItemsFrom<T>(source: T[], length: number, randomLengthAdder: number = 0): T[]
```

Get array which containing randomly mixed part of ```source``` with length ```length``` plus randomly
added ```randomLengthAdder```

Get copy of ```source``` with all it's items randomly mixed

### RandomArray.splitAll()

```
RandomArray.splitAll<T>(source: T[], resultArraysCount: number, equally: boolean = false): T[][]
```

Randomly split ```source``` to ```resultArraysCount``` arrays.

When ```equally``` set to FALSE then result array lengths may be any, but not less than ```1```.
When ```equally``` set to TRUE then result array lengths are equal or near equal (if equal split is impossible).

### RandomArray.splitToLengths()

```
RandomArray.splitToLengths<T>(source: T[], lengths: number[]): T[][] 
```

Randomly split ```source``` to an arrays with exactly specified by ```lengths``` lengths.

Sum of ```lengths``` should be less or equal than length of ```source``` as split is distinctive.

### RandomArray.splitToLengthsWithOverlap()

```
RandomArray.splitToLengthsWithOverlap<T>(source: T[], lengths: number[]): T[][] 
```

Randomly split ```source``` to an arrays with exactly specified by ```lengths``` lengths, but allows item overlaps.
