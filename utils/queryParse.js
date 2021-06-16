const queryParse = (query, type) => {
  try {
    let { filter = "{}", range = "[]", sort = "[]", ...rest } = query;
    filter = JSON.parse(filter);
    range = JSON.parse(range);
    sort = JSON.parse(sort);

    if (Object.keys(filter).length) {
      filter = Object.entries(filter).reduce((prev, [key, value]) => {
        key = key.replace(" ", ".");
        if (key == "q") {
          const reg = new RegExp(`.*(${value}).*`, "gi");
          prev["$or"] = [
            { ["name.first"]: reg },
            { ["name.first"]: reg },
            { ["name"]: reg },
            { email: reg },
            { title: reg },
            { description: reg },
          ];
          return prev;
        }
        if (key == "id") {
          prev["_id"] = value;
          return prev;
        }
        if (key == "rate") {
          const rateFilter = (value) => ({
            $gte: +value,
            $lt: +value + 0.9,
          });
          if (Array.isArray(value)) {
            prev["$or"] ??= [];
            value.forEach((rate) =>
              prev["$or"].push({ rate: rateFilter(rate) })
            );
          } else {
            prev["rate"] = rateFilter(value);
          }
          return prev;
          //   prev['rate'] = Array.isArray(value)
          //     ? { $or: value.map(rateFilter) }
          //     : rateFilter(value);
          // console.log(prev);
          // return prev;
        }
        prev[key] = Array.isArray(value) ? { $in: value } : value;
        return prev;
      }, {});
    }

    if (range.length)
      range = { offset: range[0], limit: range[1] - range[0] + 1 };

    if (typeof sort === "string" && sort) {
      sort = [sort];
    }
    if (Array.isArray(sort)) {
      sort.unshift("_id");
      let prevOrder = "";
      let order = "";
      sort = sort
        .reverse()
        .map((i) => {
          if (i === "ASC" || i === "DESC") {
            order = i == "DESC" ? "-" : "";
            return null;
          } else {
            prevOrder = order;
            order = "";
            return prevOrder + i;
          }
        })
        .filter(Boolean)
        .join(" ");
      // sort = sort.map((a) => (a == "ASC" ? "-" : a == "DESC" ? "" : a));
      // sort = sort.reduceRight((total, curr) => {
      //   if (curr === "-" || curr === "") return total + " " + curr;
      //   return total + curr;
      // }, "");
    }

    return { filter, range, sort };
  } catch (err) {
    return { err };
  }
};
module.exports = { queryParse };
