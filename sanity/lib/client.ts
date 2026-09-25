import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const clientFetch = async <
  QueryResponse,
  const QueryString extends string = string,
>({
  query,
  params = {},
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> => {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      tags,
    },
  });
};
