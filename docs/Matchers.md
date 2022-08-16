### Matchers.anything()

```
Matchers.anything()
```

Always successful validation. Can be useful when there is conditional case when in some condition match check is not
needed.

_________________________________________

### Matchers.equalsTo()

```
Matchers.equalsTo(other: any)
```

Validates strict equality to ```other```.

_________________________________________

### Matchers.absent()

```
Matchers.absent()
```

Validates value is not present on place or strictly equal to ```undefined``` (```null``` cause validation fail).

_________________________________________

### Matchers.absentOrNull()

```
Matchers.absentOrNull()
```

Validates value is not present on place, or strictly equal to ```undefined``` or ```null```.

_________________________________________

### Matchers.anyDefined()

```
Matchers.anyDefined()
```

Validates value is present on place (```undefined``` or missing value cause validation fail, but ```null``` is
acceptable).

_________________________________________

### Matchers.anyNotNull()

```
Matchers.anyNotNull()
```

Validates value is present on place (```undefined``` or missing value cause validation fail) and not ```null```.

_________________________________________

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

_________________________________________

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

_________________________________________

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

_________________________________________

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

_________________________________________

### Matchers.dateTimeApprox()

```
Matchers.dateTimeApprox(dateTime: Date, diff: {
    seconds?: number,
    minutes?: number,
    hours?: number,
    days?: number,
})
```

Validates value is type of ```string``` with default javascript ISO date-time format or value of class ```Date```.
After it checks is it approximately equal to ```dateTime``` with max difference specified in ```diff```.

* ```dateTime``` date-time to compare
* ```diff``` difference specification; inner fields have no bound limits, but result difference should be a not negative
  number
* ```diff.seconds``` seconds part of max difference
* ```diff.minutes``` minutes part of max difference
* ```diff.hours``` hours part of max difference
* ```diff.days``` days part of max difference

_________________________________________

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

_________________________________________

### ObjectMatchers.any()

```
ObjectMatchers.any(
    match: any = null,
    options?: {
      canBeNull?: boolean,
      optional?: boolean,
    },
)
```

Validates value is JsonObject and matches it with ```match``` if value passed.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored

_________________________________________

### ObjectMatchers.only()

```
ObjectMatchers.only(
    match: any,
    options?: {
      canBeNull?: boolean,
      optional?: boolean,
    },
)
```

Validates value is JsonObject, value contains only fields mentioned in ```match``` and these fields matches
corresponding ```match``` fields.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored

_________________________________________

### ObjectMatchers.exactly()

```
ObjectMatchers.exactly(
    match: any,
    options?: {
      canBeNull?: boolean,
      optional?: boolean,
    },
)
```

Validates value is JsonObject, value contains exactly same fields as ```match``` and these fields matches
corresponding ```match``` fields.

* ```canBeNull``` allows value to be null; in case of this all further checks ignored
* ```optional``` allows value to be missing or ```undefined```; in case of this all further checks ignored

_________________________________________

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

_________________________________________

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

_________________________________________

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

_________________________________________

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

_________________________________________

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

_________________________________________

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
