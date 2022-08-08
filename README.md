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

### FULL LIST OF MATCHERS

Below is list of all matcher with link to documentation

| MATCHERS LIST                                                                     |
|-----------------------------------------------------------------------------------|
| [Matchers.anything()](docs/Matchers.md#Matchers.anything)                       |
| [Matchers.equalsTo()](docs/Matchers.md#Matchers.equalsTo)                       |
| [Matchers.absent()](docs/Matchers.md#Matchers.absent)                           |
| [Matchers.absentOrNull()](docs/Matchers.md#Matchers.absentOrNull)               |
| [Matchers.anyDefined()](docs/Matchers.md#Matchers.anyDefined)                   |
| [Matchers.anyNotNull()](docs/Matchers.md#Matchers.anyNotNull)                   |
| [Matchers.object()](docs/Matchers.md#Matchers.object)                           |
| [Matchers.string()](docs/Matchers.md#Matchers.string)                           |
| [Matchers.uuid()](docs/Matchers.md#Matchers.uuid)                               |
| [Matchers.boolean()](docs/Matchers.md#Matchers.boolean)                         |
| [Matchers.dateTime()](docs/Matchers.md#Matchers.dateTime)                       |
| [Matchers.number()](docs/Matchers.md#Matchers.number)                           |
| [ArrayMatchers.any()](docs/Matchers.md#ArrayMatchers.any)                       |
| [ArrayMatchers.uniqueItems()](docs/Matchers.md#ArrayMatchers.uniqueItems)       |
| [ArrayMatchers.containingAll()](docs/Matchers.md#ArrayMatchers.containingAll)   |
| [ArrayMatchers.containingAny()](docs/Matchers.md#ArrayMatchers.containingAny)   |
| [ArrayMatchers.containingOnly()](docs/Matchers.md#ArrayMatchers.containingOnly) |
| [ArrayMatchers.notContaining()](docs/Matchers.md#ArrayMatchers.notContaining)   |

# Pool

// TODO

# Random

Useful random utils for generating random values, and also randomizing arrays.

| RANDOM LIST                                                                                     |
|-------------------------------------------------------------------------------------------------|
| [Random.int()](docs/Random.md#Random int)                                                       |
| [Random.intBetween()](docs/Random.md#Random.intBetween)                                         |
| [Random.string()](docs/Random.md#Random.string)                                                 |
| [Random.text()](docs/Random.md#Random.text)                                                     |
| [Random.uuid()](docs/Random.md#Random.uuid)                                                     |
| [Random.boolean()](docs/Random.md#Random.boolean)                                               |
| [RandomArray.singleItem()](docs/Random.md#RandomArray.singleItem)                               |
| [RandomArray.mixedCopyOf()](docs/Random.md#RandomArray.mixedCopyOf)                             |
| [RandomArray.someItems()](docs/Random.md#RandomArray.someItems)                                 |
| [RandomArray.splitAll()](docs/Random.md#RandomArray.splitAll)                                   |
| [RandomArray.splitToLengths()](docs/Random.md#RandomArray.splitToLengths)                       |
| [RandomArray.splitToLengthsWithOverlap()](docs/Random.md#RandomArray-splitToLengthsWithOverlap) |
