/**
 * MongoDB query, update and aggregation operators for the searchable cheat sheet.
 * Each entry links to its page in the official manual: https://www.mongodb.com/docs/manual/reference/operator/
 */

export type OperatorGroup = "Query" | "Update" | "Aggregation stage" | "Aggregation expression" | "Accumulator" | "Window";

export type Operator = {
  name: string;
  group: OperatorGroup;
  category: string;
  syntax: string;
  description: string;
  docs: string;
  since?: string;
};

type Row = [name: string, syntax: string, description: string, slug?: string, since?: string];
type Section = { group: OperatorGroup; category: string; path: "query" | "update" | "aggregation"; rows: Row[] };

const DOCS = "https://www.mongodb.com/docs/manual/reference/operator/";

const sections: Section[] = [
  {
    group: "Query",
    category: "Comparison",
    path: "query",
    rows: [
      ["$eq", "{ qty: { $eq: 20 } }", "Matches values equal to the given value. { qty: 20 } is shorthand."],
      ["$ne", "{ status: { $ne: 'A' } }", "Matches values not equal to the value, including documents without the field."],
      ["$gt", "{ qty: { $gt: 20 } }", "Greater than."],
      ["$gte", "{ qty: { $gte: 20 } }", "Greater than or equal to."],
      ["$lt", "{ qty: { $lt: 20 } }", "Less than."],
      ["$lte", "{ qty: { $lte: 20 } }", "Less than or equal to."],
      ["$in", "{ status: { $in: ['A', 'D'] } }", "Matches any of the values in the array."],
      ["$nin", "{ status: { $nin: ['A', 'D'] } }", "Matches none of the values, including documents without the field."],
    ],
  },
  {
    group: "Query",
    category: "Logical",
    path: "query",
    rows: [
      ["$and", "{ $and: [{ a: 1 }, { b: { $gt: 2 } }] }", "All conditions must match. Implicit when you list several fields."],
      ["$or", "{ $or: [{ a: 1 }, { b: 2 }] }", "At least one condition must match. Each branch can use its own index."],
      ["$nor", "{ $nor: [{ a: 1 }, { b: 2 }] }", "None of the conditions may match."],
      ["$not", "{ price: { $not: { $gt: 1.99 } } }", "Inverts an operator expression; also matches documents without the field."],
    ],
  },
  {
    group: "Query",
    category: "Element",
    path: "query",
    rows: [
      ["$exists", "{ email: { $exists: true } }", "Matches documents that have (or lack) the field, even when its value is null."],
      ["$type", "{ zip: { $type: 'string' } }", "Matches by BSON type name or number; arrays match if any element has the type."],
    ],
  },
  {
    group: "Query",
    category: "Evaluation",
    path: "query",
    rows: [
      ["$expr", "{ $expr: { $gt: ['$spent', '$budget'] } }", "Uses aggregation expressions in a query, e.g. to compare two fields."],
      ["$regex", "{ name: { $regex: '^acme', $options: 'i' } }", "Pattern match. Anchored, case-sensitive prefixes can use an index."],
      ["$text", "{ $text: { $search: 'coffee shop' } }", "Full-text search over a text index."],
      ["$mod", "{ qty: { $mod: [4, 0] } }", "Field value divided by divisor has the given remainder."],
      ["$jsonSchema", "{ $jsonSchema: { required: ['name'] } }", "Matches documents that satisfy a JSON Schema."],
      ["$where", "{ $where: 'this.a > this.b' }", "Runs JavaScript per document. Slow; prefer $expr."],
    ],
  },
  {
    group: "Query",
    category: "Array",
    path: "query",
    rows: [
      ["$all", "{ tags: { $all: ['red', 'blank'] } }", "Array contains every listed value, in any order."],
      [
        "$elemMatch",
        "{ results: { $elemMatch: { score: { $gte: 80, $lt: 85 } } } }",
        "At least one array element matches all the conditions together.",
      ],
      ["$size", "{ tags: { $size: 3 } }", "Array has exactly this many elements. Cannot take a range."],
    ],
  },
  {
    group: "Query",
    category: "Geospatial",
    path: "query",
    rows: [
      ["$geoWithin", "{ loc: { $geoWithin: { $centerSphere: [[-73.9, 40.7], 0.001] } } }", "Geometry lies entirely within a shape."],
      [
        "$geoIntersects",
        "{ area: { $geoIntersects: { $geometry: { type: 'Point', coordinates: [1, 2] } } } }",
        "Geometry intersects the given GeoJSON geometry.",
      ],
      [
        "$near",
        "{ loc: { $near: { $geometry: point, $maxDistance: 500 } } }",
        "Sorted by distance from a point. Needs a geospatial index.",
      ],
      ["$nearSphere", "{ loc: { $nearSphere: { $geometry: point } } }", "Like $near, using spherical geometry."],
    ],
  },
  {
    group: "Query",
    category: "Bitwise",
    path: "query",
    rows: [
      ["$bitsAllSet", "{ flags: { $bitsAllSet: [1, 5] } }", "All the given bit positions are 1."],
      ["$bitsAnySet", "{ flags: { $bitsAnySet: 35 } }", "Any of the given bits are 1."],
      ["$bitsAllClear", "{ flags: { $bitsAllClear: [1, 5] } }", "All the given bits are 0."],
      ["$bitsAnyClear", "{ flags: { $bitsAnyClear: 35 } }", "Any of the given bits are 0."],
    ],
  },
  {
    group: "Update",
    category: "Fields",
    path: "update",
    rows: [
      ["$set", "{ $set: { status: 'D', 'size.uom': 'in' } }", "Sets field values, creating fields (and parents) as needed."],
      ["$unset", "{ $unset: { tmp: '' } }", "Removes fields."],
      ["$inc", "{ $inc: { qty: -2, views: 1 } }", "Adds to a number; creates the field if missing."],
      ["$mul", "{ $mul: { price: 1.25 } }", "Multiplies a number."],
      ["$min", "{ $min: { lowScore: 150 } }", "Updates only if the new value is smaller."],
      ["$max", "{ $max: { highScore: 950 } }", "Updates only if the new value is larger."],
      ["$rename", "{ $rename: { nmae: 'name' } }", "Renames a field."],
      ["$setOnInsert", "{ $setOnInsert: { createdAt: new Date() } }", "Sets values only when an upsert inserts a new document."],
      ["$currentDate", "{ $currentDate: { lastModified: true } }", "Sets a field to the current date or timestamp."],
    ],
  },
  {
    group: "Update",
    category: "Arrays",
    path: "update",
    rows: [
      ["$push", "{ $push: { scores: 89 } }", "Appends a value to an array."],
      ["$addToSet", "{ $addToSet: { tags: 'new' } }", "Appends only if the value is not already present."],
      ["$pop", "{ $pop: { scores: -1 } }", "Removes the first (-1) or last (1) element."],
      ["$pull", "{ $pull: { votes: { $gte: 6 } } }", "Removes all elements that match a value or condition."],
      ["$pullAll", "{ $pullAll: { scores: [0, 5] } }", "Removes all instances of the listed values."],
      ["$", "{ $set: { 'grades.$': 82 } }", "Positional: updates the first element that matched the query.", "positional"],
      ["$[]", "{ $inc: { 'grades.$[]': 10 } }", "All positional: updates every element of the array.", "positional-all"],
      [
        "$[<identifier>]",
        "{ $set: { 'grades.$[g]': 100 } }, { arrayFilters: [{ g: { $gte: 100 } }] }",
        "Filtered positional: updates elements matching arrayFilters.",
        "positional-filtered",
      ],
      ["$each", "{ $push: { scores: { $each: [90, 92] } } }", "Modifier for $push and $addToSet to add several values."],
      ["$position", "{ $push: { scores: { $each: [50], $position: 0 } } }", "Modifier for $push: where to insert."],
      ["$slice", "{ $push: { recent: { $each: [x], $slice: -10 } } }", "Modifier for $push: keep only the first or last N elements."],
      ["$sort", "{ $push: { quizzes: { $each: [q], $sort: { score: -1 } } } }", "Modifier for $push: sort the array after pushing."],
      ["$bit", "{ $bit: { flags: { or: 4 } } }", "Bitwise and / or / xor on an integer."],
    ],
  },
  {
    group: "Aggregation stage",
    category: "Stages",
    path: "aggregation",
    rows: [
      ["$match", "{ $match: { status: 'A' } }", "Filters documents. Put it first so it can use an index."],
      ["$project", "{ $project: { name: 1, total: { $add: ['$a', '$b'] } } }", "Includes, excludes or computes fields."],
      ["$addFields", "{ $addFields: { total: { $sum: '$items.price' } } }", "Adds or overwrites fields, keeping the rest."],
      ["$set", "{ $set: { total: { $sum: '$items.price' } } }", "Alias of $addFields."],
      ["$unset", "{ $unset: ['password', 'tmp'] }", "Removes fields."],
      ["$group", "{ $group: { _id: '$status', n: { $sum: 1 } } }", "Groups by a key and computes accumulators."],
      ["$sort", "{ $sort: { createdAt: -1 } }", "Sorts documents. Uses an index only near the start of the pipeline."],
      ["$limit", "{ $limit: 10 }", "Passes the first N documents."],
      ["$skip", "{ $skip: 20 }", "Skips the first N documents."],
      ["$count", "{ $count: 'total' }", "Outputs one document with the number of input documents."],
      ["$unwind", "{ $unwind: { path: '$items', preserveNullAndEmptyArrays: true } }", "Outputs one document per array element."],
      [
        "$lookup",
        "{ $lookup: { from: 'users', localField: 'uid', foreignField: '_id', as: 'user' } }",
        "Left outer join with another collection. Index the foreignField.",
      ],
      [
        "$graphLookup",
        "{ $graphLookup: { from: 'emp', startWith: '$boss', connectFromField: 'boss', connectToField: 'name', as: 'chain' } }",
        "Recursive lookup for trees and graphs.",
      ],
      ["$unionWith", "{ $unionWith: { coll: 'archive', pipeline: [] } }", "Appends documents from another collection."],
      ["$facet", "{ $facet: { byTag: [...], byPrice: [...] } }", "Runs several sub-pipelines on the same input."],
      ["$bucket", "{ $bucket: { groupBy: '$price', boundaries: [0, 100, 200], default: 'other' } }", "Groups into ranges you define."],
      ["$bucketAuto", "{ $bucketAuto: { groupBy: '$price', buckets: 4 } }", "Groups into N evenly filled buckets."],
      ["$sortByCount", "{ $sortByCount: '$tags' }", "Groups by value and sorts by count, descending."],
      ["$replaceRoot", "{ $replaceRoot: { newRoot: '$address' } }", "Replaces each document with an embedded document."],
      ["$replaceWith", "{ $replaceWith: '$address' }", "Shorter form of $replaceRoot."],
      ["$sample", "{ $sample: { size: 100 } }", "Picks N random documents."],
      [
        "$setWindowFields",
        "{ $setWindowFields: { partitionBy: '$state', sortBy: { date: 1 }, output: { run: { $sum: '$qty', window: { documents: ['unbounded', 'current'] } } } } }",
        "Window functions: running totals, ranks, moving averages.",
        undefined,
        "5.0",
      ],
      [
        "$densify",
        "{ $densify: { field: 'ts', range: { step: 1, unit: 'hour', bounds: 'full' } } }",
        "Fills gaps in a sequence of dates or numbers.",
        undefined,
        "5.1",
      ],
      [
        "$fill",
        "{ $fill: { sortBy: { ts: 1 }, output: { price: { method: 'linear' } } } }",
        "Fills null or missing values.",
        undefined,
        "5.3",
      ],
      ["$geoNear", "{ $geoNear: { near: point, distanceField: 'dist' } }", "Sorts by distance; must be the first stage."],
      ["$redact", "{ $redact: { $cond: [cond, '$$DESCEND', '$$PRUNE'] } }", "Restricts content by document-level conditions."],
      ["$out", "{ $out: 'report' }", "Writes the results to a collection, replacing it. Last stage."],
      [
        "$merge",
        "{ $merge: { into: 'report', whenMatched: 'merge', whenNotMatched: 'insert' } }",
        "Merges results into a collection. Last stage.",
      ],
      ["$documents", "{ $documents: [{ x: 1 }, { x: 2 }] }", "Returns literal documents; use with db.aggregate().", undefined, "5.1"],
      ["$collStats", "{ $collStats: { storageStats: {} } }", "Collection statistics."],
      ["$indexStats", "{ $indexStats: {} }", "How often each index is used. Find unused indexes."],
      ["$changeStream", "db.coll.watch([...])", "Opens a change stream; usually via watch()."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Arithmetic",
    path: "aggregation",
    rows: [
      ["$add", "{ $add: ['$price', '$fee'] }", "Adds numbers, or a number of milliseconds to a date."],
      ["$subtract", "{ $subtract: ['$end', '$start'] }", "Subtracts numbers or dates (date minus date gives milliseconds)."],
      ["$multiply", "{ $multiply: ['$price', '$qty'] }", "Multiplies numbers."],
      ["$divide", "{ $divide: ['$total', '$count'] }", "Divides two numbers."],
      ["$mod", "{ $mod: ['$a', 3] }", "Remainder of a division."],
      ["$abs", "{ $abs: '$delta' }", "Absolute value."],
      ["$round", "{ $round: ['$price', 2] }", "Rounds to a number of decimal places."],
      ["$trunc", "{ $trunc: ['$price', 0] }", "Truncates to a number of decimal places."],
      ["$ceil", "{ $ceil: '$x' }", "Smallest integer greater than or equal to the number."],
      ["$floor", "{ $floor: '$x' }", "Largest integer less than or equal to the number."],
      ["$pow", "{ $pow: ['$x', 2] }", "Raises to a power."],
      ["$sqrt", "{ $sqrt: '$x' }", "Square root."],
      ["$exp", "{ $exp: '$x' }", "e raised to the power."],
      ["$ln", "{ $ln: '$x' }", "Natural logarithm."],
      ["$log10", "{ $log10: '$x' }", "Base-10 logarithm."],
      ["$log", "{ $log: ['$x', 2] }", "Logarithm in any base."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Array",
    path: "aggregation",
    rows: [
      ["$arrayElemAt", "{ $arrayElemAt: ['$items', 0] }", "Element at an index; negative counts from the end."],
      ["$first", "{ $first: '$items' }", "First element of an array."],
      ["$last", "{ $last: '$items' }", "Last element of an array."],
      ["$filter", "{ $filter: { input: '$items', as: 'i', cond: { $gt: ['$$i.qty', 0] } } }", "Keeps the elements that match a condition."],
      ["$map", "{ $map: { input: '$items', as: 'i', in: '$$i.price' } }", "Applies an expression to each element."],
      [
        "$reduce",
        "{ $reduce: { input: '$xs', initialValue: 0, in: { $add: ['$$value', '$$this'] } } }",
        "Folds an array into a single value.",
      ],
      ["$size", "{ $size: '$items' }", "Number of elements."],
      ["$in", "{ $in: ['red', '$colors'] }", "True if the value is in the array."],
      ["$indexOfArray", "{ $indexOfArray: ['$items', 'x'] }", "Index of the first occurrence, or -1."],
      ["$isArray", "{ $isArray: '$x' }", "True if the value is an array."],
      ["$concatArrays", "{ $concatArrays: ['$a', '$b'] }", "Joins arrays."],
      ["$slice", "{ $slice: ['$items', 5] }", "A subset of an array."],
      ["$reverseArray", "{ $reverseArray: '$items' }", "Reverses an array."],
      ["$sortArray", "{ $sortArray: { input: '$items', sortBy: { price: 1 } } }", "Sorts an array.", undefined, "5.2"],
      ["$range", "{ $range: [0, 10, 2] }", "Generates a sequence of integers."],
      ["$zip", "{ $zip: { inputs: ['$a', '$b'] } }", "Transposes arrays into an array of pairs."],
      ["$arrayToObject", "{ $arrayToObject: [[['k', 'v']]] }", "Converts [k, v] pairs or {k, v} documents to an object."],
      ["$objectToArray", "{ $objectToArray: '$attrs' }", "Converts an object to an array of {k, v}."],
      ["$firstN", "{ $firstN: { input: '$xs', n: 3 } }", "First N elements of an array.", undefined, "5.2"],
      ["$lastN", "{ $lastN: { input: '$xs', n: 3 } }", "Last N elements of an array.", undefined, "5.2"],
      ["$maxN", "{ $maxN: { input: '$scores', n: 3 } }", "N largest values.", undefined, "5.2"],
      ["$minN", "{ $minN: { input: '$scores', n: 3 } }", "N smallest values.", undefined, "5.2"],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Comparison and boolean",
    path: "aggregation",
    rows: [
      ["$eq", "{ $eq: ['$a', '$b'] }", "True if the values are equal."],
      ["$ne", "{ $ne: ['$a', '$b'] }", "True if the values differ."],
      ["$gt", "{ $gt: ['$qty', 250] }", "Greater than."],
      ["$gte", "{ $gte: ['$qty', 250] }", "Greater than or equal to."],
      ["$lt", "{ $lt: ['$qty', 250] }", "Less than."],
      ["$lte", "{ $lte: ['$qty', 250] }", "Less than or equal to."],
      ["$cmp", "{ $cmp: ['$a', '$b'] }", "Returns -1, 0 or 1."],
      ["$and", "{ $and: [expr1, expr2] }", "True if all expressions are true."],
      ["$or", "{ $or: [expr1, expr2] }", "True if any expression is true."],
      ["$not", "{ $not: [expr] }", "Negates a boolean."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Conditional",
    path: "aggregation",
    rows: [
      ["$cond", "{ $cond: { if: { $gte: ['$qty', 250] }, then: 30, else: 20 } }", "If / then / else."],
      ["$ifNull", "{ $ifNull: ['$nickname', '$name', 'Anonymous'] }", "First value that is not null or missing."],
      ["$switch", "{ $switch: { branches: [{ case: expr, then: v }], default: d } }", "Multi-way branch."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "String",
    path: "aggregation",
    rows: [
      ["$concat", "{ $concat: ['$first', ' ', '$last'] }", "Joins strings."],
      ["$toLower", "{ $toLower: '$email' }", "Lowercases a string."],
      ["$toUpper", "{ $toUpper: '$code' }", "Uppercases a string."],
      ["$trim", "{ $trim: { input: '$name' } }", "Removes whitespace (or given characters) from both ends."],
      ["$ltrim", "{ $ltrim: { input: '$name' } }", "Trims the start."],
      ["$rtrim", "{ $rtrim: { input: '$name' } }", "Trims the end."],
      ["$split", "{ $split: ['$path', '/'] }", "Splits a string into an array."],
      ["$substrCP", "{ $substrCP: ['$name', 0, 3] }", "Substring by code points."],
      ["$strLenCP", "{ $strLenCP: '$name' }", "Length in code points."],
      ["$indexOfCP", "{ $indexOfCP: ['$name', 'a'] }", "Index of a substring, or -1."],
      ["$strcasecmp", "{ $strcasecmp: ['$a', '$b'] }", "Case-insensitive comparison: -1, 0 or 1."],
      ["$regexMatch", "{ $regexMatch: { input: '$email', regex: /@acme\\.com$/ } }", "True if the regex matches."],
      ["$regexFind", "{ $regexFind: { input: '$text', regex: /\\d+/ } }", "First regex match and its captures."],
      ["$regexFindAll", "{ $regexFindAll: { input: '$text', regex: /\\d+/ } }", "All regex matches."],
      ["$replaceOne", "{ $replaceOne: { input: '$s', find: 'a', replacement: 'b' } }", "Replaces the first occurrence."],
      ["$replaceAll", "{ $replaceAll: { input: '$s', find: 'a', replacement: 'b' } }", "Replaces every occurrence."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Date",
    path: "aggregation",
    rows: [
      ["$dateToString", "{ $dateToString: { format: '%Y-%m-%d', date: '$at', timezone: 'Europe/Paris' } }", "Formats a date as a string."],
      ["$dateFromString", "{ $dateFromString: { dateString: '$s' } }", "Parses a string into a date."],
      ["$dateAdd", "{ $dateAdd: { startDate: '$at', unit: 'day', amount: 7 } }", "Adds a time unit to a date.", undefined, "5.0"],
      [
        "$dateSubtract",
        "{ $dateSubtract: { startDate: '$at', unit: 'month', amount: 1 } }",
        "Subtracts a time unit from a date.",
        undefined,
        "5.0",
      ],
      [
        "$dateDiff",
        "{ $dateDiff: { startDate: '$a', endDate: '$b', unit: 'day' } }",
        "Difference between two dates in a unit.",
        undefined,
        "5.0",
      ],
      ["$dateTrunc", "{ $dateTrunc: { date: '$at', unit: 'week' } }", "Rounds a date down to a unit.", undefined, "5.0"],
      ["$dateFromParts", "{ $dateFromParts: { year: 2024, month: 1, day: 31 } }", "Builds a date from parts."],
      ["$dateToParts", "{ $dateToParts: { date: '$at' } }", "Splits a date into parts."],
      ["$year", "{ $year: '$at' }", "Year of a date."],
      ["$month", "{ $month: '$at' }", "Month (1-12)."],
      ["$dayOfMonth", "{ $dayOfMonth: '$at' }", "Day of the month (1-31)."],
      ["$dayOfWeek", "{ $dayOfWeek: '$at' }", "Day of the week (1 = Sunday)."],
      ["$hour", "{ $hour: '$at' }", "Hour (0-23)."],
      ["$isoWeek", "{ $isoWeek: '$at' }", "ISO 8601 week number."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Type",
    path: "aggregation",
    rows: [
      ["$type", "{ $type: '$x' }", "BSON type name of a value."],
      ["$convert", "{ $convert: { input: '$x', to: 'int', onError: 0, onNull: 0 } }", "Converts with error and null handling."],
      ["$toString", "{ $toString: '$_id' }", "Converts to a string."],
      ["$toInt", "{ $toInt: '$qty' }", "Converts to a 32-bit integer."],
      ["$toLong", "{ $toLong: '$qty' }", "Converts to a 64-bit integer."],
      ["$toDouble", "{ $toDouble: '$price' }", "Converts to a double."],
      ["$toDecimal", "{ $toDecimal: '$price' }", "Converts to Decimal128."],
      ["$toBool", "{ $toBool: '$flag' }", "Converts to a boolean."],
      ["$toDate", "{ $toDate: '$ts' }", "Converts to a date."],
      ["$toObjectId", "{ $toObjectId: '$idString' }", "Converts a 24-hex string to an ObjectId."],
      ["$isNumber", "{ $isNumber: '$x' }", "True for int, long, double or decimal."],
    ],
  },
  {
    group: "Aggregation expression",
    category: "Object, set and variables",
    path: "aggregation",
    rows: [
      ["$mergeObjects", "{ $mergeObjects: ['$defaults', '$overrides'] }", "Combines documents; later fields win."],
      ["$getField", "{ $getField: 'price.usd' }", "Reads a field, including names with dots or $.", undefined, "5.0"],
      [
        "$setField",
        "{ $setField: { field: 'a.b', input: '$$ROOT', value: 1 } }",
        "Sets a field, including names with dots or $.",
        undefined,
        "5.0",
      ],
      ["$let", "{ $let: { vars: { t: { $add: ['$a', '$b'] } }, in: { $multiply: ['$$t', 2] } } }", "Defines variables for an expression."],
      ["$literal", "{ $literal: '$notAFieldPath' }", "Returns a value without parsing it."],
      ["$setUnion", "{ $setUnion: ['$a', '$b'] }", "Elements in either array, without duplicates."],
      ["$setIntersection", "{ $setIntersection: ['$a', '$b'] }", "Elements in both arrays."],
      ["$setDifference", "{ $setDifference: ['$a', '$b'] }", "Elements in the first array only."],
      ["$setEquals", "{ $setEquals: ['$a', '$b'] }", "True if both arrays have the same distinct elements."],
      ["$setIsSubset", "{ $setIsSubset: ['$a', '$b'] }", "True if every element of the first is in the second."],
      ["$anyElementTrue", "{ $anyElementTrue: ['$flags'] }", "True if any element is true."],
      ["$allElementsTrue", "{ $allElementsTrue: ['$flags'] }", "True if no element is false, null, 0 or undefined."],
    ],
  },
  {
    group: "Accumulator",
    category: "$group accumulators",
    path: "aggregation",
    rows: [
      ["$sum", "{ $sum: '$qty' }   { $sum: 1 }", "Total of numeric values; { $sum: 1 } counts documents."],
      ["$avg", "{ $avg: '$price' }", "Average of numeric values."],
      ["$min", "{ $min: '$price' }", "Smallest value."],
      ["$max", "{ $max: '$price' }", "Largest value."],
      ["$count", "{ $count: {} }", "Number of documents in the group.", undefined, "5.0"],
      ["$push", "{ $push: '$item' }", "Array of all values."],
      ["$addToSet", "{ $addToSet: '$tag' }", "Array of distinct values."],
      ["$first", "{ $first: '$name' }", "Value from the first document in the group (sort first)."],
      ["$last", "{ $last: '$name' }", "Value from the last document in the group."],
      ["$top", "{ $top: { sortBy: { score: -1 }, output: '$name' } }", "Top element by a sort order.", undefined, "5.2"],
      ["$bottom", "{ $bottom: { sortBy: { score: -1 }, output: '$name' } }", "Bottom element by a sort order.", undefined, "5.2"],
      ["$topN", "{ $topN: { n: 3, sortBy: { score: -1 }, output: '$name' } }", "Top N elements by a sort order.", undefined, "5.2"],
      [
        "$bottomN",
        "{ $bottomN: { n: 3, sortBy: { score: -1 }, output: '$name' } }",
        "Bottom N elements by a sort order.",
        undefined,
        "5.2",
      ],
      ["$stdDevPop", "{ $stdDevPop: '$score' }", "Population standard deviation."],
      ["$stdDevSamp", "{ $stdDevSamp: '$score' }", "Sample standard deviation."],
      ["$mergeObjects", "{ $mergeObjects: '$attrs' }", "Merges the documents of the group into one."],
    ],
  },
  {
    group: "Window",
    category: "$setWindowFields operators",
    path: "aggregation",
    rows: [
      ["$rank", "{ $rank: {} }", "Rank with gaps for ties.", undefined, "5.0"],
      ["$denseRank", "{ $denseRank: {} }", "Rank without gaps.", undefined, "5.0"],
      ["$documentNumber", "{ $documentNumber: {} }", "Row number in the partition.", undefined, "5.0"],
      ["$shift", "{ $shift: { output: '$qty', by: -1, default: 0 } }", "Value from a document N positions away.", undefined, "5.0"],
      ["$derivative", "{ $derivative: { input: '$odometer', unit: 'hour' } }", "Rate of change.", undefined, "5.0"],
      ["$integral", "{ $integral: { input: '$kw', unit: 'hour' } }", "Area under the curve.", undefined, "5.0"],
      ["$expMovingAvg", "{ $expMovingAvg: { input: '$price', N: 20 } }", "Exponential moving average.", undefined, "5.0"],
      ["$locf", "{ $locf: '$price' }", "Last observation carried forward over nulls.", undefined, "5.2"],
      ["$linearFill", "{ $linearFill: '$price' }", "Linear interpolation over nulls.", undefined, "5.3"],
    ],
  },
];

export const OPERATORS: Operator[] = sections.flatMap((s) =>
  s.rows.map(([name, syntax, description, slug, since]) => ({
    name,
    group: s.group,
    category: s.category,
    syntax,
    description,
    since,
    docs: `${DOCS}${s.path}/${slug ?? name.replace(/^\$/, "")}/`,
  })),
);

export const OPERATOR_GROUPS: OperatorGroup[] = ["Query", "Update", "Aggregation stage", "Aggregation expression", "Accumulator", "Window"];

/** Case-insensitive search over name, category, syntax and description; exact name matches rank first. */
export function searchOperators(query: string, group?: OperatorGroup | "All"): Operator[] {
  const q = query.trim().toLowerCase();
  const pool = group && group !== "All" ? OPERATORS.filter((o) => o.group === group) : OPERATORS;
  if (!q) return pool;
  const bare = q.replace(/^\$/, "");
  const score = (o: Operator) => {
    const n = o.name.toLowerCase().replace(/^\$/, "");
    if (n === bare) return 0;
    if (n.startsWith(bare)) return 1;
    if (n.includes(bare)) return 2;
    return 3;
  };
  const terms = q.split(/\s+/);
  return pool
    .filter((o) => {
      const hay = `${o.name} ${o.group} ${o.category} ${o.syntax} ${o.description}`.toLowerCase();
      return terms.every((t) => hay.includes(t) || hay.includes(t.replace(/^\$/, "")));
    })
    .sort((a, b) => score(a) - score(b));
}
