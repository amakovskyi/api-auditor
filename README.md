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

### HOW IT WORKS

```typescript
// make a structural copy of "data" variable with expectation it matches to "innerExpectedMatcher"
let expectedMatch = ValueMatcher.copyWithExpectedMatch(data, expectedMatcher)
// natural Jest comparison way
expect(data).toEqual(expectedMatch);
```

```ValueMatcher.copyWithExpectedMatch``` just making comparable copy of ```data```, which is named **comparison value**.

After that natural Jest comparator is used. In case, if ```data``` is not matches to ```expectedMatcher```
then ```ValueMatcher.copyWithExpectedMatch``` will generate error object, which will raise comparison error
inside ```expect(data).toEqual(expectedMatch)```. With this way log exactly shows place and structure of matcher
failure, easy to read and understand.

### FULL LIST OF MATCHERS

Below is list of all matcher with link to documentation

| MATCHERS LIST                                                                  |
|--------------------------------------------------------------------------------|
| [Matchers.anything()](docs/Matchers.md#matchersanything)                       |
| [Matchers.equalsTo()](docs/Matchers.md#matchersequalsto)                       |
| [Matchers.absent()](docs/Matchers.md#matchersabsent)                           |
| [Matchers.absentOrNull()](docs/Matchers.md#matchersabsentornull)               |
| [Matchers.anyDefined()](docs/Matchers.md#matchersanydefined)                   |
| [Matchers.anyNotNull()](docs/Matchers.md#matchersanynotnull)                   |
| [Matchers.object()](docs/Matchers.md#matchersobject)                           |
| [Matchers.string()](docs/Matchers.md#matchersstring)                           |
| [Matchers.uuid()](docs/Matchers.md#matchersuuid)                               |
| [Matchers.boolean()](docs/Matchers.md#matchersboolean)                         |
| [Matchers.dateTime()](docs/Matchers.md#matchersdatetime)                       |
| [Matchers.number()](docs/Matchers.md#matchersnumber)                           |
| [ArrayMatchers.any()](docs/Matchers.md#arraymatchersany)                       |
| [ArrayMatchers.uniqueItems()](docs/Matchers.md#arraymatchersuniqueitems)       |
| [ArrayMatchers.containingAll()](docs/Matchers.md#arraymatcherscontainingall)   |
| [ArrayMatchers.containingAny()](docs/Matchers.md#arraymatcherscontainingany)   |
| [ArrayMatchers.containingOnly()](docs/Matchers.md#arraymatcherscontainingonly) |
| [ArrayMatchers.notContaining()](docs/Matchers.md#arraymatchersnotcontaining)   |

### CUSTOM VALUE MATCHERS

It is possible to create you own matchers.

Type 1. Standard matcher with auto check for ```canBeNull``` and ```optional``` before pass value in you match
validation code.

```typescript
export function ownMatcher(options?: {
  canBeNull?: boolean,
  optional?: boolean,
  yourCustomOption?: boolean,
}) {
  return valueMatcher('ownMatcher', options, value => {
    if (value instanceof YourType) {
      return ValueMatcher.typeError('YourType');
    }
    if (yourCustomOption) {
      // DO CHECK
    }
    return ValueMatcher.success();
  });
}
```

Type 2: Matcher with only your own match validation checks.

```typescript
export function ownCustomMatcher(options?: {
  yourCustomOption?: boolean,
}) {
  return customValueMatcher('ownCustomMatcher', options, value => {
    if (value == null) {
      return ValueMatcher.error('Message');
    }
    if (value instanceof SomeType) {
      return ValueMatcher.typeError('SomeType');
    }
    if (yourCustomOption) {
      // DO CHECK
    }
    return ValueMatcher.success();
  });
}
```

**Type 1** matcher automatically do checks for options ```canBeNull``` and ```optional``` if they are
passed and by default does not accept missing value, ```undefined``` or ```null``` no matter is ```canBeNull```
and ```optional``` passed at all. **Type 2** immediately passes value to you validation code.

You need to return one of following from your validation code:

* ```ValueMatcher.success()``` - validation is successful
* ```ValueMatcher.error(message)``` - validation is failed, pass a corresponding message to it
* ```ValueMatcher.typeError(typeName)``` - validation is failed because of wrong type of ```value```
* ```ValueMatcher.value(value)``` - specific case when you need to return **comparison value**. When previous error will
  build a specific error object which will raise specific error in comparison log, this value will be just compared to
  actual value and raise natural diff in case if they are different.

Using inner matcher validations.

If you try to use ```validateMatch()``` inside validation code it will just throw error. If it needed to build inner
validation use specific methods:

```typescript
let expectedMatch = ValueMatcher.copyWithExpectedMatch(value, innerExpectedMatcher)
let isMatch = MatcherUtils.isFullyEquals(expectedMatch, value)
```

In result ```isMatch``` will contain your match result, when expectedMatch will contain **comparison value**.

# Random

Useful random utils for generating random values, and also randomizing arrays.

| RANDOM LIST                                                                                    |
|------------------------------------------------------------------------------------------------|
| [Random.int()](docs/Random.md#randomint)                                                       |
| [Random.intBetween()](docs/Random.md#randomintBetween)                                         |
| [Random.string()](docs/Random.md#randomstring)                                                 |
| [Random.text()](docs/Random.md#randomtext)                                                     |
| [Random.uuid()](docs/Random.md#randomuuid)                                                     |
| [Random.boolean()](docs/Random.md#randomboolean)                                               |
| [RandomArray.singleItem()](docs/Random.md#randomarraysingleitem)                               |
| [RandomArray.mixedCopyOf()](docs/Random.md#randomarraymixedcopyof)                             |
| [RandomArray.someItems()](docs/Random.md#randomarraysomeitems)                                 |
| [RandomArray.splitAll()](docs/Random.md#randomarraysplitall)                                   |
| [RandomArray.splitToLengths()](docs/Random.md#randomarraysplittolengths)                       |
| [RandomArray.splitToLengthsWithOverlap()](docs/Random.md#randomarraysplittolengthswithoverlap) |

# Pool

Under development

