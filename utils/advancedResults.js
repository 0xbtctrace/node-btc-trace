export const advancedResults = async (model, reqQuery, alias, aliasSortBy) =>
  new Promise(async (resolve, reject) => {
    try {
      let query = { ...reqQuery };

      // Sorting
      if (query.sort_by) {
        const sort_by = query.sort_by;
        const sort_order = query.sort_order === 'desc' ? 'DESC' : 'ASC';

        if (alias && aliasSortBy) {
          // If alias and aliasSortBy are provided, handle aliased sorting
          const nestedSort = {
            model: model.associations[alias],
            as: aliasSortBy,
          };
          if (!query.order) {
            query.order = [];
          }
          query.order.push([nestedSort, sort_order]);
        } else {
          // Handle sorting by non-alias column
          if (!query.order) {
            query.order = [];
          }
          query.order.push([sort_by, sort_order]);
        }
      }

      // Handle includes (if any)
      if (query.include) {
        for (const include of query.include) {
          if (include.alias && include.aliasSortBy) {
            processQuery(include, include.alias);
          }
        }
      }

      // Pagination
      let page = parseInt(query.page, 10) || 1;
      if (page <= 0) {
        page = 1;
      }

      let limit = parseInt(query.limit, 10) || 25;
      if (limit > 50 || limit <= 0) {
        limit = 25;
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      query.offset = startIndex;
      query.limit = limit;

      // Executing query
      const result = await model.findAndCountAll({
        ...query,
      });

      const total = Array.isArray(result.count)
        ? result.count.length
        : result.count;

      // Pagination result
      const pagination = {};

      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }

      resolve({
        count: total,
        pagination,
        data: result.rows,
      });
    } catch (error) {
      reject(error);
    }
  });
